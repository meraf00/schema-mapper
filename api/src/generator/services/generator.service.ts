import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { SchemaService } from 'src/schema/services';
import { CODE_GENERATION } from '../injectionKeys';
import { Queue } from 'bull';

@Injectable()
export class GeneratorService {
  constructor(
    private schemaService: SchemaService,

    @InjectQueue(CODE_GENERATION) private queue: Queue,
  ) {}

  async getRedisStatus() {
    return this.queue.client.status;
  }

  async getJob() {
    return await this.queue.getJobs([
      'waiting',
      'active',
      'completed',
      'failed',
      'delayed',
    ]);
  }

  async enqueueJob(schemaId: string) {
    const schema = await this.schemaService.findOne(schemaId);

    if (!schema) {
      throw new Error('Schema not found');
    }

    const job = await this.queue.add(schema);

    return job;
  }
}
