export enum AttributeType {
  CHAR = 'CHAR',
  VARCHAR = 'VARCHAR',
  TEXT = 'TEXT',
  BOOLEAN = 'BOOLEAN',
  TINYINT = 'TINYINT',
  INTEGER = 'INTEGER',
  BIGINT = 'BIGINT',
  FLOAT = 'FLOAT',
  DOUBLE = 'DOUBLE',
  DATE = 'DATE',
  TIME = 'TIME',
  TIMESTAMP = 'TIMESTAMP',
}

export enum RelationType {
  ONE_TO_ONE = 'ONE_TO_ONE',
  MANY_TO_ONE = 'MANY_TO_ONE',
}

export const mapAttributeType = (type: AttributeType) => {
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
