import { Case } from 'change-case-all';
import { Importable, TypeOrmRepository } from '../dependency';
import { Table, mapAttributeType } from 'src/project/entities';
import {
  repositoryNameTemplate,
  serviceNameTemplate,
  serviceTemplate,
} from './service.template';
import { NestInjectRepository, NestInjectable } from '../dependency/nestjs';
import { Entity } from '../entity';
import { CreateDto, UpdateDto } from '../dto/dto';
import { entityNameTemplate } from '../entity/entity.template';
import { createDtoTemplate, updateDtoTemplate } from '../dto/dto.template';

export class Service implements Importable {
  name: string;
  dependency: Importable[] = [];

  constructor(
    readonly module: string,
    readonly table: Table,
  ) {
    this.name = serviceNameTemplate({ name: Case.pascal(this.table.name) });

    this.dependency.push(
      ...[
        new NestInjectable(),

        new NestInjectRepository(this.table.name),

        new TypeOrmRepository(this.table.name),

        new CreateDto(this.module, this.table),
        new UpdateDto(this.module, this.table),
        new Entity(this.module, this.table, []),
      ],
    );
  }

  code(): string {
    const primaryAttribute = this.table.attributes.find(
      (attr) => attr.isPrimary,
    );

    const attribType = primaryAttribute
      ? mapAttributeType(primaryAttribute.type)
      : 'string';

    const repoName = repositoryNameTemplate({
      name: Case.camel(this.table.name),
    });

    return serviceTemplate({
      name: this.name,
      entity: {
        name: entityNameTemplate({ name: Case.pascal(this.table.name) }),
        primaryKey: Case.camel(primaryAttribute.name),
        primaryKeyType: attribType,
      },
      createDto: createDtoTemplate({ name: Case.pascal(this.table.name) }),
      updateDto: updateDtoTemplate({ name: Case.pascal(this.table.name) }),
      repository: repoName,
    });
  }
}
