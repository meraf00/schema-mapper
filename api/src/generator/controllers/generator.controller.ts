import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  StreamableFile,
} from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';
import { CodeGeneratorService } from '../services/generator.service';
import { GenerateCodeDto } from '../dto/request.dto';

@Controller('generator')
export class GeneratorController {
  constructor(private readonly generatorService: CodeGeneratorService) {}

  @Post(':id')
  async generate(
    @Param('id', new ParseUUIDPipe({ version: '4' })) schemaId: string,
  ) {
    try {
      return await this.generatorService.enqueueJob({ schemas: [schemaId] });
    } catch (e) {
      throw new NotFoundException(e.message);
    }
  }

  @Post()
  async generateMultiple(@Body() generateCodeDto: GenerateCodeDto) {
    try {
      return await this.generatorService.enqueueJob(generateCodeDto);
    } catch (e) {
      throw new NotFoundException(e.message);
    }
  }

  @Get(':id/generate')
  async generate_(
    @Param('id', new ParseUUIDPipe({ version: '4' })) schemaId: string,
  ) {
    try {
      return await this.generatorService.enqueueJob({ schemas: [schemaId] });
    } catch (e) {
      throw new NotFoundException(e.message);
    }
  }

  @Get()
  async getJobs() {
    return await this.generatorService.getJobs();
  }

  @Get(':id')
  async getJob(@Param('id') jobId: string) {
    return await this.generatorService.getJob(jobId);
  }

  @Get(':id/download')
  async getFile(@Param('id') jobId): Promise<StreamableFile> {
    const job = await this.generatorService.getJob(jobId);

    const file = createReadStream(join(job.returnvalue));

    return new StreamableFile(file, {
      disposition: 'attachment',
      type: 'application/zip',
    });
  }
}
