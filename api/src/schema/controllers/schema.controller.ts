import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { SchemaService } from '../services/schema.service';
import { CreateSchemaDto } from '../dto/request.dto';
import { ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('schemas')
@Controller('schemas')
export class SchemaController {
  constructor(private schemaService: SchemaService) {}

  @Post()
  async create(@Body() createSchemaDto: CreateSchemaDto) {
    return this.schemaService.create(createSchemaDto);
  }

  @Get()
  async findAll() {
    return this.schemaService.findAll();
  }

  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'Schema id',
  })
  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    try {
      return await this.schemaService.findOne(id);
    } catch (e) {
      throw new NotFoundException(e.message);
    }
  }

  @Delete(':id')
  async delete(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    try {
      return await this.schemaService.delete(id);
    } catch (e) {
      throw new NotFoundException(e.message);
    }
  }
}
