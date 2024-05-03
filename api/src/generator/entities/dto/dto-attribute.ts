import {
  Attribute,
  AttributeType,
  mapAttributeType,
} from 'src/schema/entities';
import { Importable } from '../dependency';
import {
  ValidatorIsBoolean,
  ValidatorIsNumber,
  ValidatorIsOptional,
  ValidatorIsString,
} from '../dependency/class-validator';
import { attributeTemplate } from '../entity/attribute.template';
import { Case } from 'change-case-all';

const mapTypeToDtoType = (type: string) => {
  switch (type) {
    case AttributeType.CHAR:
    case AttributeType.VARCHAR:
    case AttributeType.TEXT:
      return new ValidatorIsString();
    case AttributeType.BOOLEAN:
      return new ValidatorIsBoolean();
    case AttributeType.TINYINT:
    case AttributeType.INTEGER:
    case AttributeType.BIGINT:
    case AttributeType.FLOAT:
    case AttributeType.DOUBLE:
      return new ValidatorIsNumber();
    case AttributeType.DATE:
    case AttributeType.TIME:
    case AttributeType.TIMESTAMP:
      return new ValidatorIsString();
    default:
      console.warn('Unknown type: ', type, 'defaulting to IsString decor');
      return new ValidatorIsString();
  }
};

export class DtoAttribute {
  name: string;

  dependency: Importable[] = [];

  constructor(
    readonly attribute: Attribute,
    readonly isOptional: boolean = false,
  ) {
    this.dependency.push(...this.decorators);
  }

  get decorators(): Importable[] {
    if (this.attribute.isNullable || this.isOptional) {
      return [new ValidatorIsOptional(), mapTypeToDtoType(this.attribute.type)];
    }
    return [mapTypeToDtoType(this.attribute.type)];
  }

  code(): string {
    return attributeTemplate({
      decorators: this.decorators.map((decorator) => decorator.code()),
      name: Case.camel(this.attribute.name),
      type: mapAttributeType(this.attribute.type),
    });
  }
}
