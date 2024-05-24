export const PostgresErrorCodes = {
  unique_violation: '23505',
};

export class ProjectNotFoundException extends Error {
  constructor(id: string) {
    super(`Schema with id ${id} not found`);
  }
}

export class SchemaNotFoundException extends Error {
  constructor(id: string) {
    super(`Schema with id ${id} not found`);
  }
}

export class TableNotFoundException extends Error {
  constructor(id: string) {
    super(`Table with id ${id} not found`);
  }
}

export class AttributeNotFoundException extends Error {
  constructor(id: string) {
    super(`Attribute with id ${id} not found`);
  }
}

export class InvalidAttributeTypeException extends Error {
  constructor(type: string) {
    super(`Invalid attribute type '${type}'`);
  }
}
