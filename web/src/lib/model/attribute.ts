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

export class Attribute {
  id: string;

  name: string;

  type: AttributeType;

  isNullable: boolean;

  isUnique: boolean;

  isPrimary: boolean;

  isForeign: boolean;

  isGenerated: boolean;

  references?: Attribute;

  relationType?: RelationType;

  backref?: string;

  constructor(
    id: string,
    name: string,
    type: AttributeType,
    isNullable: boolean,
    isUnique: boolean,
    isPrimary: boolean,
    isForeign: boolean,
    isGenerated: boolean,
    relationType?: RelationType,
    references?: Attribute,
    backref?: string
  ) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.isNullable = isNullable;
    this.isUnique = isUnique;
    this.isPrimary = isPrimary;
    this.isForeign = isForeign;
    this.isGenerated = isGenerated;
    this.references = references;
    this.relationType = relationType;
    this.backref = backref;
  }
}
