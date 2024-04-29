import { OnQueueCompleted, Process, Processor } from '@nestjs/bull';
import { CODE_GENERATION } from '../injectionKeys';
import { Job } from 'bull';
import { EntityFolder } from '../entity/EntityFolder';
import { ICodeFile } from '../entity/Code';
import { Schema } from 'src/schema/entities';
import { DtoFolder } from '../entity/DtoFolder';
import { ModuleFolder } from '../entity/ModuleFolder';

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

  @Process()
  async generateCode(job: Job) {
    const schema = job.data;

    const resourceMap = new Map<string, string>();

    const entitieFiles = this.generateEntities(schema, resourceMap);
    const dtoFiles = this.generateDtos(schema, resourceMap);
    const moduleFiles = this.generateModules(schema, resourceMap);

    console.log(entitieFiles);
    console.log(dtoFiles);
    console.log(moduleFiles);

    await job.progress(42);

    await job.moveToCompleted('done', true);
  }

  @OnQueueCompleted()
  onCompleted(job: Job) {
    console.log(`Job completed with result ${job}`);
  }
}
