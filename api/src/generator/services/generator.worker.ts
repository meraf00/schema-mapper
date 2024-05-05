import { OnQueueCompleted, Process, Processor } from '@nestjs/bull';
import { CODE_GENERATION } from '../injectionKeys';
import { Job } from 'bull';
import { CodeGeneratorService } from './generator.service';

@Processor(CODE_GENERATION)
export class GeneratorWorker {
  constructor(private readonly codeGeneratorService: CodeGeneratorService) {}

  @Process()
  async generateCode(job: Job) {
    const schemas = job.data;

    try {
      const filepath = await this.codeGeneratorService.generate(schemas);
      return filepath;
    } catch (error) {
      console.error(error);
      await job.moveToFailed(error);
    }
  }

  @OnQueueCompleted()
  onCompleted(job: Job) {
    console.log(`Job completed with result`);
    console.log(job);
  }
}
