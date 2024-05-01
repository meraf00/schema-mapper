import { Attribute, AttributeType } from 'src/schema/entities';
import { IImportable } from '../entity/Code';
import { RelationType } from 'src/schema/entities/attribute.entity';

export class AttributeCode {
  dependency: IImportable[];

  decorators: IImportable[];

  constructor(readonly attribute: Attribute) {}

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

  build() {
    if (this.attribute.relationType === RelationType.ONE_TO_ONE) {
    } else if (this.attribute.relationType === RelationType.MANY_TO_ONE) {
    } else {
    }
  }

  code(): string {
    return '';
  }
}
