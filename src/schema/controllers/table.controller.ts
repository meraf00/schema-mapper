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
import { CreateTableDto } from '../dto/request.dto';
import { InvalidAttributeTypeException } from '../exceptions/exceptions';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { TableService } from '../services/table.service';

@ApiTags('table')
@Controller('table')
export class TableController {
  constructor(private tableService: TableService) {}

  @Post()
  async create(@Body() createTableDto: CreateTableDto) {
    return this.tableService.create(createTableDto);
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: String })
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    const table = await this.tableService.findOne(id);
    if (!table) {
      throw new NotFoundException();
    }
    return table;
  }

  @Get()
  async findAll() {
    return this.tableService.findAll();
  }

  @Put(':id')
  @ApiParam({ name: 'id', type: String })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateTableDto: CreateTableDto,
  ) {
    try {
      return this.tableService.update(id, updateTableDto);
    } catch (e) {
      if (e instanceof InvalidAttributeTypeException) {
        throw new BadRequestException(e.message);
      }
      throw e;
    }
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: String })
  async delete(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.tableService.delete(id);
  }
}
