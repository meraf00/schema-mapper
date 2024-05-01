import { Attribute, AttributeType } from 'src/schema/entities';
import { RelationType } from 'src/schema/entities/attribute.entity';
import {
  TypeOrmColumn,
  TypeOrmGeneratedColumn,
  TypeOrmManyToOne,
  TypeOrmOneToOne,
  TypeOrmPrimaryColumn,
  TypeOrmPrimaryGeneratedColumn,
} from './dependency';
import { Importable } from './dependency';
import { attributeTemplate } from './attribute.template';
import { Case } from 'change-case-all';

const mapType = (type: AttributeType) => {
  switch (type) {
    case AttributeType.CHAR:
    case AttributeType.VARCHAR:
    case AttributeType.TEXT:
      return 'string';
    case AttributeType.BOOLEAN:
      return 'boolean';
    case AttributeType.TINYINT:
    case AttributeType.INTEGER:
    case AttributeType.BIGINT:
    case AttributeType.FLOAT:
    case AttributeType.DOUBLE:
      return 'number';
    case AttributeType.DATE:
    case AttributeType.TIME:
    case AttributeType.TIMESTAMP:
      return 'Date';
    default:
      throw new Error(`Unknown type: ${type}`);
  }
};

export class AttributeCode {
  dependency: Importable[] = [];

  constructor(readonly attribute: Attribute) {
    this.dependency.push(...this.decorators);

    if (
      this.attribute.isForeign &&
      this.attribute.references.table.id !== this.attribute.table.id
    ) {
      this.dependency.push({
        name: this.attribute.references.table.name,
        module: null,
      } as Importable);
    }
  }

  get decorators(): Importable[] {
    if (this.attribute.relationType === RelationType.ONE_TO_ONE) {
      return [
        new TypeOrmOneToOne(
          this.attribute.references.table.name,
          this.attribute.backref,
          { nullable: this.attribute.isNullable },
        ),
      ];
    } else if (this.attribute.relationType === RelationType.MANY_TO_ONE) {
      return [
        new TypeOrmManyToOne(
          this.attribute.references.table.name,
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
    return attributeTemplate({
      decorators: this.decorators.map((decorator) => decorator.code()),
      name: Case.camel(this.attribute.name),
      type: mapType(this.attribute.type),
    });
  }
}
