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
import { TemplateService } from '../services/template.service';
import { CreateTemplateDto, UpdateTemplateDto } from '../dto/request.dto';
import { ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('templates')
@Controller('templates')
export class TemplateController {
  constructor(private templateService: TemplateService) {}

  @Get('populate')
  async populate() {
    return this.templateService.populateDefaultTemplates();
  }

  @Get('reset')
  async reset() {
    return this.templateService.reset();
  }

  @Post()
  async create(@Body() createTemplateDto: CreateTemplateDto) {
    return this.templateService.create(createTemplateDto);
  }

  @Get()
  async findAll() {
    return this.templateService.findAll();
  }

  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'Template id',
  })
  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    try {
      return await this.templateService.findOne(id);
    } catch (e) {
      throw new NotFoundException(e.message);
    }
  }

  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'Template id',
  })
  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateTemplateDto: UpdateTemplateDto,
  ) {
    try {
      return await this.templateService.update(id, updateTemplateDto);
    } catch (e) {
      throw new NotFoundException(e.message);
    }
  }

  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'Template id',
  })
  @Delete(':id')
  async delete(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    try {
      return await this.templateService.delete(id);
    } catch (e) {
      throw new NotFoundException(e.message);
    }
  }
}
