import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Table } from '../entities/table.entity';
import { Attribute, AttributeType } from '../entities/attribute.entity';
import { Repository } from 'typeorm';
import { UtilityService } from 'src/common/utility/utility.service';
import { InvalidAttributeTypeException } from '../exceptions/exceptions';
import { CreateAttributeDto, UpdateAttributeDto } from '../dto/request.dto';

@Injectable()
export class AttributeService {
  constructor(
    @InjectRepository(Attribute)
    private attributeRepository: Repository<Attribute>,
    private utilityService: UtilityService,
  ) {}

  async create(createAttributeDto: CreateAttributeDto): Promise<Attribute> {
    const attribute = this.attributeRepository.create();
    attribute.name = createAttributeDto.name;
    attribute.table = { id: createAttributeDto.tableId } as Table;
    if (createAttributeDto.references) {
      attribute.references = { id: createAttributeDto.references } as Attribute;
    }

    try {
      attribute.type = this.utilityService.enumFromValue(
        createAttributeDto.type.toLocaleUpperCase(),
        AttributeType,
      );
    } catch (e) {
      throw new InvalidAttributeTypeException(createAttributeDto.type);
    }

    return this.attributeRepository.save(attribute);
  }

  async findAll(): Promise<Attribute[]> {
    return this.attributeRepository.find();
  }

  async findOne(id: string): Promise<Attribute> {
    return this.attributeRepository.findOne({
      where: { id },
    });
  }

  async update(
    id: string,
    updateAttributeDto: UpdateAttributeDto,
  ): Promise<Attribute> {
    const update = { ...updateAttributeDto } as unknown as Partial<Attribute>;

    if (update.type) {
      try {
        update.type = this.utilityService.enumFromValue(
          update.type.toLocaleUpperCase(),
          AttributeType,
        ) as AttributeType;
      } catch (e) {
        throw new InvalidAttributeTypeException(update.type);
      }
    }
    await this.attributeRepository.update(id, update);

    return this.findOne(id);
  }

  async delete(id: string): Promise<void> {
    await this.attributeRepository.delete(id);
  }
}