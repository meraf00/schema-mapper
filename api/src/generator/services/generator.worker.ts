import { OnQueueCompleted, Process, Processor } from '@nestjs/bull';
import { CODE_GENERATION } from '../injectionKeys';
import { Job } from 'bull';
import { EntityFolder } from '../entity/EntityFolder';
import { ICodeFile } from '../entity/Code';
import { Schema } from 'src/schema/entities';
import { DtoFolder } from '../entity/DtoFolder';
import { ModuleFolder } from '../entity/ModuleFolder';
import * as fs from 'fs';
import * as path from 'path';
import * as prettier from 'prettier';
import * as archiver from 'archiver';

@Processor(CODE_GENERATION)
export class GeneratorWorker {
  resolveDependency(file: ICodeFile, resourceMap: Map<string, string>) {
    return file.imports.map((imp) => {
      if (imp.path) {
        return `import { ${imp.name} } from '${imp.path}';`;
      }

      if (!resourceMap.has(imp.name)) {
        throw new Error(`Cannot resolve dependency ${imp.name}`);
      }

      return `import { ${imp.name} } from '${resourceMap.get(imp.name)}';`;
    });
  }

  generateEntities(schema: Schema, resourceMap: Map<string, string>) {
    const code = new EntityFolder(schema);
    const files = code.getFiles();

    const fileContents: string[] = [];

    for (let file of files) {
      fileContents.push(file.getCode());

      for (let exp of file.exports) {
        resourceMap.set(exp, file.location);
      }
    }

    const fileMap = new Map<string, string>();

    for (let i in files) {
      fileMap.set(
        files[i].location,
        this.resolveDependency(files[i], resourceMap).join('\n') +
          '\n\n' +
          fileContents[i],
      );
    }

    return fileMap;
  }

  generateDtos(schema: Schema, resourceMap: Map<string, string>) {
    const code = new DtoFolder(schema);
    const files = code.getFiles();

    const fileContents: string[] = [];

    for (let file of files) {
      fileContents.push(file.getCode());

      for (let exp of file.exports) {
        resourceMap.set(exp, file.location);
      }
    }

    const fileMap = new Map<string, string>();

    for (let i in files) {
      fileMap.set(
        files[i].location,
        this.resolveDependency(files[i], resourceMap).join('\n') +
          '\n\n' +
          fileContents[i],
      );
    }

    return fileMap;
  }

  generateModules(schema: Schema, resourceMap: Map<string, string>) {
    const code = new ModuleFolder(schema);
    const files = code.getFiles();

    const fileContents: string[] = [];

    for (let file of files) {
      fileContents.push(file.getCode());

      for (let exp of file.exports) {
        resourceMap.set(exp, file.location);
      }
    }

    const fileMap = new Map<string, string>();

    for (let i in files) {
      fileMap.set(
        files[i].location,
        this.resolveDependency(files[i], resourceMap).join('\n') +
          '\n\n' +
          fileContents[i],
      );
    }

    return fileMap;
  }

  generateScaffold(schema: Schema) {
    const fileMap = new Map<string, string>();

    fileMap.set(
      'src/app.module',
      `import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ${schema.name}Module } from './${schema.name}/${schema.name}.module';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'root',
      database: '${schema.name}',
      entities: [__dirname + '/**/*.entity{.ts}'],
      synchronize: true,
      autoLoadEntities: true,
    }),

    ${schema.name}Module,
  ],
})
export class AppModule {}`,
    );

    return fileMap;
  }

  async generateZipFile(
    zipFilepath: string,
    folderPath: string,
    outputFolderPath: string,
    onComplete: (filePath: string) => void,
    onError: (err: Error) => void,
  ) {
    var ar = archiver.create('zip', {});

    var output = fs.createWriteStream(zipFilepath, { flags: 'w' });
    output.on('close', function () {
      console.log('ZIP file written to:', zipFilepath);
      return onComplete(zipFilepath);
    });

    ar.on('error', function (err) {
      console.error('error compressing: ', err);
      return onError(err);
    });

    ar.pipe(output);
    ar.directory(path.normalize(folderPath + '/'), outputFolderPath).finalize();
  }

  async writeFiles(
    schema: Schema,
    files: Map<string, string>,
    onComplete: (filePath: string) => void,
    onError: (err: Error) => void,
  ) {
    const baseFolder = path.join(process.cwd(), 'storage/base');

    const schemaFolder = path.join(process.cwd(), `/storage/${schema.id}`);

    if (fs.existsSync(schemaFolder)) {
      fs.rmSync(schemaFolder, {
        force: true,
        recursive: true,
      });
    }

    fs.cpSync(baseFolder, schemaFolder, { recursive: true });

    for (let [location, content] of files) {
      const filePath = path.join(schemaFolder, location + '.ts');

      fs.mkdirSync(path.dirname(filePath), { recursive: true });

      try {
        fs.writeFileSync(
          filePath,
          await prettier.format(content, { parser: 'typescript' }),
          {
            encoding: 'utf-8',
          },
        );
      } catch (e) {
        console.log(filePath, e.message);
        fs.writeFileSync(filePath, content, {
          encoding: 'utf-8',
        });
      }
    }

    const zipFilepath = path.join(process.cwd(), `storage/${schema.id}.zip`);
    const outputFolderPath = path.join(process.cwd(), `storage`);
    const folderPath = path.join(process.cwd(), `storage/${schema.id}`);

    this.generateZipFile(
      zipFilepath,
      folderPath,
      outputFolderPath,
      onComplete,
      onError,
    );
  }

  @Process()
  async generateCode(job: Job) {
    const schema = job.data;

    const resourceMap = new Map<string, string>();

    const entitieFiles = this.generateEntities(schema, resourceMap);
    const dtoFiles = this.generateDtos(schema, resourceMap);
    const moduleFiles = this.generateModules(schema, resourceMap);
    const scaffoldFiles = this.generateScaffold(schema);

    const files = new Map<string, string>();

    for (let [key, value] of entitieFiles) {
      files.set(key, value);
    }

    for (let [key, value] of dtoFiles) {
      files.set(key, value);
    }

    for (let [key, value] of moduleFiles) {
      files.set(key, value);
    }

    for (let [key, value] of scaffoldFiles) {
      files.set(key, value);
    }

    const onComplete = async (filePath: string) => {
      await job.moveToCompleted(filePath, true);
    };

    const onError = async (err: Error) => {
      await job.moveToFailed(err, true);
    };

    await this.writeFiles(schema, files, onComplete, onError);
  }

  @OnQueueCompleted()
  onCompleted(job: Job) {
    console.log(`Job completed with result`);
  }
}
