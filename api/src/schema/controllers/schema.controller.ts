import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { SchemaService } from '../services/schema.service';
import { CreateSchemaDto, UpdateSchemaDto } from '../dto/request.dto';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { CodeGenerationService } from '../services/codegeneration.service';

@ApiTags('schemas')
@Controller('schemas')
export class SchemaController {
  constructor(
    private schemaService: SchemaService,
    private codeGenerationService: CodeGenerationService,
  ) {}

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

  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'Schema id',
  })
  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateSchemaDto: UpdateSchemaDto,
  ) {
    try {
      return await this.schemaService.update(id, updateSchemaDto);
    } catch (e) {
      throw new NotFoundException(e.message);
    }
  }

  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'Schema id',
  })
  @Delete(':id')
  async delete(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    try {
      return await this.schemaService.delete(id);
    } catch (e) {
      console.log(e);
      throw new NotFoundException(e.message);
    }
  }

  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'Schema id',
  })
  @Get(':id/code')
  async generateCode(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    try {
      return await this.codeGenerationService.generateCode(id);
    } catch (e) {
      throw new NotFoundException(e.message);
    }
  }
}
