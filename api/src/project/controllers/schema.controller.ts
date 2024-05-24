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
  Query,
} from '@nestjs/common';
import { SchemaService } from '../services/schema.service';
import { CreateSchemaDto, UpdateSchemaDto } from '../dto/request.dto';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('schemas')
@Controller('schemas')
export class SchemaController {
  constructor(private schemaService: SchemaService) {}

  @Post()
  async create(@Body() createSchemaDto: CreateSchemaDto) {
    return this.schemaService.create(createSchemaDto);
  }

  @ApiQuery({
    name: 'projectStub',
    type: String,
    description: 'Unique project identifier',
    required: false,
  })
  @Get()
  async findAll(@Query('projectStub') projectStub: string) {
    return this.schemaService.findAll(projectStub);
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
      throw new NotFoundException(e.message);
    }
  }
}
