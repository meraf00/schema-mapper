import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Schema } from '../entities/schema.entity';
import { Table } from '../entities/table.entity';
import { Repository } from 'typeorm';
import { CreateTableDto, UpdateTableDto } from '../dto/request.dto';

@Injectable()
export class TableService {
  constructor(
    @InjectRepository(Table)
    private tableRepository: Repository<Table>,
  ) {}

  async findOne(id: string): Promise<Table> {
    return this.tableRepository.findOne({
      where: { id },
      relations: {
        attributes: true,
      },
    });
  }

  async create(createTableDto: CreateTableDto): Promise<Table> {
    // const table = this.tableRepository.create();
    // table.name = createTableDto.name;
    // table.schema = { id: createTableDto.schemaId } as Schema;

    const table = this.tableRepository.create(createTableDto);
    return this.tableRepository.save(table);
  }

  async findAll(): Promise<Table[]> {
    return await this.tableRepository.find();
  }

  async update(id: string, updateTableDto: UpdateTableDto): Promise<Table> {
    await this.tableRepository.update(id, updateTableDto);
    return { id, ...updateTableDto } as Table;
  }

  async delete(id: string): Promise<void> {
    await this.tableRepository.delete(id);
  }
}
