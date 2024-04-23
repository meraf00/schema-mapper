import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Schema } from '../entities/schema.entity';
import { Repository } from 'typeorm';
import { SchemaNotFoundException } from '../exceptions/exceptions';
import { CreateSchemaDto, UpdateSchemaDto } from '../dto/request.dto';

@Injectable()
export class SchemaService {
  constructor(
    @InjectRepository(Schema)
    private schemaRepository: Repository<Schema>,
  ) {}

  async create(createSchemaDto: CreateSchemaDto): Promise<Schema> {
    const schema = this.schemaRepository.create(createSchemaDto);
    return this.schemaRepository.save(schema);
  }

  async findAll(): Promise<Schema[]> {
    return this.schemaRepository.find({
      relations: ['tables', 'tables.attributes'],
    });
  }

  async findOne(id: string): Promise<Schema> {
    return this.schemaRepository.findOne({
      where: { id },
      relations: ['tables', 'tables.attributes'],
    });
  }

  async update(id: string, updateSchemaDto: UpdateSchemaDto): Promise<Schema> {
    await this.schemaRepository.update(id, updateSchemaDto);
    return { id, ...updateSchemaDto } as Schema;
  }

  async delete(id: string): Promise<void> {
    await this.schemaRepository.delete(id);
  }
}
