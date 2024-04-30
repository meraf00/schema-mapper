import { Attribute, AttributeType } from 'src/schema/entities';
import { ICodeFile, IImportable } from './Code';
import {
  ApiPropertyDecorator,
  IsBooleanDecorator,
  IsOptionalDecorator,
  IsStringDecorator,
} from './Importables';

export class DtoAttributeCode implements ICodeFile {
  location: string;
  imports: IImportable[];
  exports: string[];

  constructor(
    private readonly attribute: Attribute,
    private readonly isOptional: boolean = false,
  ) {
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

  typeDecorator() {
    switch (this.attribute.type) {
      case AttributeType.CHAR:
      case AttributeType.VARCHAR:
      case AttributeType.TEXT:
        return new IsStringDecorator();
      case AttributeType.BOOLEAN:
        return new IsBooleanDecorator();
      case AttributeType.TINYINT:
      case AttributeType.INTEGER:
      case AttributeType.BIGINT:
      case AttributeType.FLOAT:
      case AttributeType.DOUBLE:
        return new IsBooleanDecorator();
      case AttributeType.DATE:
      case AttributeType.TIME:
      case AttributeType.TIMESTAMP:
        return new IsStringDecorator();
      default:
        console.warn(
          'Unknown type: ',
          this.attribute.type,
          'defaulting to IsString decor',
        );
        return new IsStringDecorator();
    }
  }

  getDecorators() {
    if (this.attribute.isNullable || this.isOptional) {
      return [
        new ApiPropertyDecorator({ nullable: true }),
        new IsOptionalDecorator(),
        this.typeDecorator(),
      ];
    } else {
      return [new ApiPropertyDecorator({}), this.typeDecorator()];
    }
  }

  getCode(): string {
    if (this.attribute.isGenerated || this.attribute.isPrimary) {
      return '';
    }

    const decorators = this.getDecorators();

    this.imports = this.imports.concat(decorators);

    const code = decorators.map((decorator) => decorator.getCode());

    return `${code.join('\n')}\n${this.attribute.name}: ${this.type()};`;
  }
}
