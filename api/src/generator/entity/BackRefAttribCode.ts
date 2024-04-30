import { Attribute, AttributeType } from 'src/schema/entities';
import { ICodeFile, IImportable } from './Code';
import { OneToManyDecorator, OneToOneDecorator } from './Importables';
import { RelationType } from 'src/schema/entities/attribute.entity';

export class BackRefAttribCode implements ICodeFile {
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
    //
    if (this.attribute.relationType === RelationType.ONE_TO_ONE) {
      return [
        new OneToOneDecorator(
          this.attribute.table.name,
          this.attribute.references.table.name,
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
        new OneToManyDecorator(
          this.attribute.table.name,
          this.attribute.references.table.name,
          this.attribute.name,
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

    if (this.attribute.relationType === RelationType.ONE_TO_ONE) {
      return `${code.join('\n')}\n${this.attribute.backref}: ${this.attribute.table.name};`;
    } else {
      return `${code.join('\n')}\n${this.attribute.backref}: ${this.attribute.table.name}[];`;
    }
  }
}
