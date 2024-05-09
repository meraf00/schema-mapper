import { Attribute, Table } from 'src/schema/entities';
import { AttributeCode } from './attribute';
import { entityNameTemplate, entityTemplate } from './entity.template';
import { Importable, TypeOrmEntity } from '../dependency';
import { Case } from 'change-case-all';
import { BackRef } from './backref';

export class Entity implements Importable {
  name: string;
  dependency: Importable[] = [];
  attributes: AttributeCode[] = [];

  constructor(
    public module: string,
    readonly table: Table,
    readonly schemaAttributes: Attribute[],
  ) {
    this.name = entityNameTemplate({ name: Case.pascal(table.name) });

    this.attributes =
      this.table.attributes?.map((attribute) => new AttributeCode(attribute)) ||
      [];

    this.schemaAttributes
      .filter(
        (attribute) =>
          attribute.isForeign && attribute.references.tableId === this.table.id,
      )
      .forEach((attribute) => {
        const backref = new BackRef(attribute);
        this.attributes.push(backref);
        this.dependency.push(...backref.dependency);
      });

    this.dependency.push(
      ...[
        new TypeOrmEntity(),

        ...this.attributes.flatMap((attribute) =>
          attribute.dependency.map((dep) => {
            // Entity should only reference other entity with in the same module
            // So we can resolve modules of referenced tables as such
            if (dep.module === null) {
              dep.module = this.module;
            }
            return dep;
          }),
        ),
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
