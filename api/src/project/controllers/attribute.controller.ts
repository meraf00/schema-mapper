import {
  BadRequestException,
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
import { CreateAttributeDto, UpdateAttributeDto } from '../dto/request.dto';
import { InvalidAttributeTypeException } from '../exceptions/exceptions';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { AttributeService } from '../services/attribute.service';

@ApiTags('attributes')
@Controller('attributes')
export class AttributeController {
  constructor(private attributeService: AttributeService) {}

  @Post()
  async create(@Body() createAttributeDto: CreateAttributeDto) {
    try {
      return await this.attributeService.create(createAttributeDto);
    } catch (e) {
      switch (e.constructor) {
        case InvalidAttributeTypeException:
          throw new BadRequestException(e.message);
        default:
          throw new BadRequestException(e.message);
      }
    }
  }

  @Get()
  async findAll() {
    return this.attributeService.findAll();
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: String })
  async findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    const attribute = await this.attributeService.findOne(id);
    if (!attribute) {
      throw new NotFoundException();
    }
    return attribute;
  }

  @Put(':id')
  @ApiParam({ name: 'id', type: String })
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateAttributeDto: UpdateAttributeDto,
  ) {
    try {
      return await this.attributeService.update(id, updateAttributeDto);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: String })
  async delete(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    try {
      return await this.attributeService.delete(id);
    } catch (e) {
      throw new NotFoundException(e.message);
    }
  }
}
