import { Table } from 'src/schema/entities';
import { AttributeCode } from './attribute';
import { entityTemplate } from './entity.template';
import { Importable } from './dependency';

export class Entity implements Importable {
  name: string;
  dependency: Importable[];
  attributes: AttributeCode[];

  constructor(
    readonly module: string,
    readonly table: Table,
  ) {
    this.name = table.name;

    this.attributes = this.table.attributes.map(
      (attribute) => new AttributeCode(attribute),
    );

    this.dependency.push(
      ...this.attributes.flatMap((attribute) => attribute.dependency),
    );
  }

  code(): string {
    return entityTemplate({
      name: this.table.name,
      attributes: this.attributes.map((attr) => attr.code()),
    });
  }
}
