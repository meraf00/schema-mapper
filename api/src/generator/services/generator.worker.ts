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
      'src/app.module.ts',
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

  async writeFiles(schema: Schema, files: Map<string, string>) {
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
      const filePath = path.join(schemaFolder, location);
      fs.mkdirSync(path.dirname(filePath));
      fs.writeFileSync(filePath, content);
    }
  }

  @Process()
  async generateCode(job: Job) {
    const schema = job.data;

    const resourceMap = new Map<string, string>();

    const entitieFiles = this.generateEntities(schema, resourceMap);
    const dtoFiles = this.generateDtos(schema, resourceMap);
    const moduleFiles = this.generateModules(schema, resourceMap);
    const scaffoldFiles = this.generateScaffold(schema);

    await this.writeFiles(schema, entitieFiles);
    await this.writeFiles(schema, dtoFiles);
    await this.writeFiles(schema, moduleFiles);
    await this.writeFiles(schema, scaffoldFiles);

    await job.progress(42);

    await job.moveToCompleted('done', true);
  }

  @OnQueueCompleted()
  onCompleted(job: Job) {
    console.log(`Job completed with result`);
  }
}
