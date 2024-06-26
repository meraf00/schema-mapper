import {
  Attribute,
  RelationType,
  mapAttributeType,
} from 'src/project/entities';
import {
  TypeOrmColumn,
  TypeOrmGeneratedColumn,
  TypeOrmManyToOne,
  TypeOrmOneToOne,
  TypeOrmPrimaryColumn,
  TypeOrmPrimaryGeneratedColumn,
} from '../dependency';
import { Importable } from '../dependency';
import { attributeTemplate } from './attribute.template';
import { Case } from 'change-case-all';
import { Entity } from './entity';
import { entityNameTemplate } from './entity.template';

export class AttributeCode {
  dependency: Importable[] = [];

  constructor(readonly attribute: Attribute) {
    this.dependency.push(...this.decorators);

    if (
      this.attribute.isForeign &&
      this.attribute.references.table.id !== this.attribute.table.id
    ) {
      this.dependency.push(
        new Entity(null, this.attribute.references.table, []),
      );
    }
  }

  get decorators(): Importable[] {
    if (this.attribute.relationType === RelationType.ONE_TO_ONE) {
      return [
        new TypeOrmOneToOne(
          entityNameTemplate({ name: this.attribute.references.table.name }),
          this.attribute.backref,
          { nullable: this.attribute.isNullable },
        ),
      ];
    } else if (this.attribute.relationType === RelationType.MANY_TO_ONE) {
      return [
        new TypeOrmManyToOne(
          entityNameTemplate({ name: this.attribute.references.table.name }),
          this.attribute.backref,
          { nullable: this.attribute.isNullable },
        ),
      ];
    } else {
      // Primary generated column
      if (this.attribute.isPrimary && this.attribute.isGenerated) {
        return [new TypeOrmPrimaryGeneratedColumn()];
      }

      // Generated column
      else if (this.attribute.isGenerated) {
        return [
          new TypeOrmColumn({
            nullable: this.attribute.isNullable,
            unique: this.attribute.isUnique,
          }),

          new TypeOrmGeneratedColumn(),
        ];
      }

      // Primary Column
      else if (this.attribute.isPrimary) {
        return [new TypeOrmPrimaryColumn()];
      }

      // Default
      return [
        new TypeOrmColumn({
          nullable: this.attribute.isNullable,
          unique: this.attribute.isUnique,
        }),
      ];
    }
  }

  code(): string {
    let type: string;

    if (this.attribute.isForeign) {
      type = entityNameTemplate({ name: this.attribute.references.table.name });
    } else {
      type = mapAttributeType(this.attribute.type);
    }

    return attributeTemplate({
      decorators: this.decorators.map((decorator) => decorator.code()),
      name: Case.camel(this.attribute.name),
      type,
    });
  }
}
