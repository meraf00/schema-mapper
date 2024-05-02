import { Case } from 'change-case-all';
import { Importable, TypeOrmRepository } from '../dependency';
import { Table, mapAttributeType } from 'src/schema/entities';
import {
  repositoryNameTemplate,
  serviceNameTemplate,
  serviceTemplate,
} from './service.template';
import { NestInjectRepository, NestInjectable } from '../dependency/nestjs';
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

        {
          name: createDtoTemplate({ name: Case.pascal(this.table.name) }),
          module: this.module,
        } as Importable,

        {
          name: updateDtoTemplate({ name: Case.pascal(this.table.name) }),
          module: this.module,
        } as Importable,

        {
          name: Case.pascal(this.table.name),
          module: this.module,
        } as Importable,
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
        name: Case.pascal(this.table.name),
        primaryKey: Case.camel(primaryAttribute.name),
        primaryKeyType: attribType,
      },
      repository: repoName,
    });
  }
}