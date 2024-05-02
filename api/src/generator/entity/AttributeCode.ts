import { Attribute, AttributeType, RelationType } from 'src/schema/entities';
import { ICodeFile, IImportable } from './Code';
import {
  ColumnDecorator,
  GeneratedDecorator,
  ManyToOneDecorator,
  OneToOneDecorator,
  PrimaryColumnDecorator,
  PrimaryGeneratedColumnDecorator,
} from './Importables';

export class AttributeCode implements ICodeFile {
  location: string;
  imports: IImportable[];
  exports: string[];

  constructor(private readonly attribute: Attribute) {
    this.location = '';
    this.imports = [];
    this.exports = [];
  }

  type() {
    switch (this.attribute.type) {
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
        throw new Error(`Unknown type: ${this.attribute.type}`);
    }
  }

  getDecorators() {
    if (!this.attribute.isForeign) {
      //
      if (this.attribute.isPrimary && this.attribute.isGenerated) {
        return [new PrimaryGeneratedColumnDecorator()];
      }

      //
      else if (this.attribute.isGenerated) {
        return [
          new ColumnDecorator({
            nullable: this.attribute.isNullable,
            unique: this.attribute.isUnique,
          }),

          new GeneratedDecorator(),
        ];
      }

      //
      else if (this.attribute.isPrimary) {
        return [new PrimaryColumnDecorator()];
      }

      //
      else {
        return [
          new ColumnDecorator({
            nullable: this.attribute.isNullable,
            unique: this.attribute.isUnique,
          }),
        ];
      }
    }

    //
    else if (this.attribute.relationType === RelationType.ONE_TO_ONE) {
      return [
        new OneToOneDecorator(
          this.attribute.references.table.name,
          this.attribute.table.name,
          this.attribute.backref,
          {
            nullable: this.attribute.isNullable,
          },
        ),
      ];
    }

    //
    else if (this.attribute.relationType === RelationType.MANY_TO_ONE) {
      return [
        new ManyToOneDecorator(
          this.attribute.references.table.name,
          this.attribute.table.name,
          this.attribute.backref,
          {
            nullable: this.attribute.isNullable,
          },
        ),
      ];
    }
  }

  getCode(): string {
    const decorators = this.getDecorators();

    this.imports = this.imports.concat(decorators);

    if (
      this.attribute.isForeign &&
      this.attribute.references.table.id !== this.attribute.table.id
    ) {
      this.imports.push({
        name: this.attribute.references.table.name,
        path: '',
      } as IImportable);
    }

    const code = decorators.map((decorator) => decorator.getCode());

    return `${code.join('\n')}\n${this.attribute.name}: ${this.type()};`;
  }
}
