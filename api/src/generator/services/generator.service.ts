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

<<<<<<< HEAD
  async getJobs() {
=======
  async getJob() {
>>>>>>> ff2e4b9 (feat: add entity code generator module)
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

    if (!schema) {
      throw new Error('Schema not found');
    }

    const job = await this.queue.add(schema);

    return job;
  }
}
