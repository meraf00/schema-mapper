import {
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { GeneratorService } from '../services/generator.service';

@Controller('generator')
export class GeneratorController {
  constructor(private readonly generatorService: GeneratorService) {}

  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe({ version: '4' })) schemaId: string,
  ) {
    try {
      return await this.generatorService.enqueueJob(schemaId);
    } catch (e) {
      throw new NotFoundException(e.message);
    }
  }

  @Get()
  async getJob() {
    return await this.generatorService.getJob();
  }
}
