import { OnQueueCompleted, Process, Processor } from '@nestjs/bull';
import { CODE_GENERATION } from '../injectionKeys';
import { Job } from 'bull';
import { EntityFolder } from '../entity/EntityFolder';
import { ICodeFile } from '../entity/Code';

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

  @Process()
  async generateCode(job: Job) {
    const schema = job.data;

    const resourceMap = new Map<string, string>();

    const code = new EntityFolder(schema);
    const files = code.getFiles();

    const fileContents: string[] = [];

    for (let file of files) {
      fileContents.push(file.getCode());

      for (let exp of file.exports) {
        resourceMap.set(exp, file.location);
      }
    }

    const filesWithImports = files.map((file, i) => {
      return (
        this.resolveDependency(file, resourceMap).join('\n') +
        '\n\n' +
        fileContents[i]
      );
    });

    for (let i in filesWithImports) {
      console.log(files[i].location);
      console.log(filesWithImports[i]);
      console.log();
    }

    await job.progress(42);

    await job.moveToCompleted('done', true);
  }

  @OnQueueCompleted()
  onCompleted(job: Job) {
    //console.log(job);
    console.log(`Job completed with result ${job}`);
  }
}
