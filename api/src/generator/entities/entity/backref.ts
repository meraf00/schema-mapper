import { Attribute, RelationType, mapAttributeType } from 'src/schema/entities';
import { TypeOrmOneToMany, TypeOrmOneToOne } from '../dependency';
import { Importable } from '../dependency';
import {
  backrefOneToManyTemplate,
  backrefOneToOneTemplate,
} from './attribute.template';
import { Case } from 'change-case-all';
import { Entity } from './entity';

export class BackRef {
  dependency: Importable[] = [];

  constructor(readonly attribute: Attribute) {
    this.dependency.push(...this.decorators);
    this.dependency.push(new Entity(null, this.attribute.table, []));
  }

  get decorators(): Importable[] {
    if (this.attribute.relationType === RelationType.ONE_TO_ONE) {
      return [
        new TypeOrmOneToOne(this.attribute.table.name, this.attribute.backref, {
          nullable: this.attribute.isNullable,
        }),
      ];
    } else if (this.attribute.relationType === RelationType.MANY_TO_ONE) {
      return [
        new TypeOrmOneToMany(this.attribute.table.name, this.attribute.name, {
          nullable: this.attribute.isNullable,
        }),
      ];
    }
  }

  code(): string {
    if (this.attribute.relationType === RelationType.ONE_TO_ONE) {
      return backrefOneToOneTemplate({
        decorators: this.decorators.map((decorator) => decorator.code()),
        name: Case.camel(this.attribute.backref),
        type: this.attribute.table.name,
      });
    } else {
      return backrefOneToManyTemplate({
        decorators: this.decorators.map((decorator) => decorator.code()),
        name: Case.camel(this.attribute.backref),
        type: this.attribute.table.name,
      });
    }
  }
}
