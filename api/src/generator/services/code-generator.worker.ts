import { OnQueueCompleted, Process, Processor } from '@nestjs/bull';
import { CODE_GENERATION } from '../injectionKeys';
import { Job } from 'bull';

import { CodeGeneratorService } from './generator.svc';

@Processor(CODE_GENERATION)
export class CodeGeneratorWorker {
  constructor(private readonly codeGeneratorService: CodeGeneratorService) {}

  @Process()
  async generate(job: Job) {
    const schema = job.data;

    const onComplete = async (filePath: string) => {
      await job.moveToCompleted(filePath, true);
    };

    const onError = async (err: Error) => {
      await job.moveToFailed(err, true);
    };
  }

  @OnQueueCompleted()
  onCompleted(job: Job) {
    console.log(`Job completed with result`);
  }
}
