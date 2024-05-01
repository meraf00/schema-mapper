import { Table } from 'src/schema/entities';
import { AttributeCode } from './attribute';
import { IImportable } from '../entity/Code';
import { entityTemplate } from './entity.template';

export class Entity {
  dependency: IImportable[];

  attributes: AttributeCode[];

  constructor(readonly table: Table) {
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
