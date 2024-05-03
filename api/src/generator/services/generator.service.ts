import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { SchemaService } from 'src/schema/services';
import { CODE_GENERATION } from '../injectionKeys';
import { Queue } from 'bull';
import { CodeGeneratorService } from './generator.svc';

@Injectable()
export class GeneratorService {
  constructor(
    private schemaService: SchemaService,
    private gser: CodeGeneratorService,

    @InjectQueue(CODE_GENERATION) private queue: Queue,
  ) {}

  async getRedisStatus() {
    return this.queue.client.status;
  }

  async getJobs() {
    return await this.queue.getJobs([
      'waiting',
      'active',
      'completed',
      'failed',
      'delayed',
    ]);
  }

  async getJob(jobId: string) {
    return await this.queue.getJob(jobId);
  }

  async enqueueJob(schemaId: string) {
    const schema = await this.schemaService.findOne(schemaId);
    try {
      await this.gser.generate([schema]);
    } catch (e) {
      console.log(e);
    }

    if (!schema) {
      throw new Error('Schema not found');
    }

    const job = await this.queue.add(schema);

    return job;
  }
}
