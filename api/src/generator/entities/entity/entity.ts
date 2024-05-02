import { Table } from 'src/schema/entities';
import { AttributeCode } from './attribute';
import { entityTemplate } from './entity.template';
import { Importable, TypeOrmEntity } from '../dependency';
import { Case } from 'change-case-all';

export class Entity implements Importable {
  name: string;
  dependency: Importable[] = [];
  attributes: AttributeCode[] = [];

  constructor(
    readonly module: string,
    readonly table: Table,
  ) {
    this.name = Case.pascal(table.name);

    this.attributes = this.table.attributes.map(
      (attribute) => new AttributeCode(attribute),
    );

    this.dependency.push(
      ...[
        new TypeOrmEntity(),

        ...this.attributes.flatMap((attribute) => attribute.dependency),
      ],
    );
  }

  code(): string {
    return entityTemplate({
      name: this.name,
      attributes: this.attributes.map((attr) => attr.code()),
    });
  }
}
