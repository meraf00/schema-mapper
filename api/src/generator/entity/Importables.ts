import { IImportable } from './Code';

const optionsToCode = (options: { [key: string]: any }): string => {
  const code = [];

  for (let key in options) {
    code.push(`${key}: ${options[key]}`);
  }

  if (code) {
    return `{ ${code.join(', ')} }`;
  }

  return '';
};

export class EntityDecorator implements IImportable {
  readonly name = 'Entity';
  readonly path = 'typeorm';

  getCode(): string {
    return `@${this.name}()`;
  }
}

export class ColumnDecorator implements IImportable {
  readonly name = 'Column';
  readonly path = 'typeorm';

  constructor(
    readonly options: {
      nullable?: boolean;
      unique?: boolean;
    },
  ) {}

  getCode(): string {
    return `@${this.name}(${optionsToCode(this.options)})`;
  }
}

export class PrimaryGeneratedColumnDecorator implements IImportable {
  readonly name = 'PrimaryGeneratedColumn';
  readonly path = 'typeorm';

  getCode(): string {
    return `@${this.name}()`;
  }
}

export class PrimaryColumnDecorator implements IImportable {
  readonly name = 'PrimaryColumn';
  readonly path = 'typeorm';

  getCode(): string {
    return `@${this.name}()`;
  }
}

export class OneToManyDecorator implements IImportable {
  readonly name = 'OneToMany';
  readonly path = 'typeorm';

  constructor(
    readonly referencedTable: string,
    readonly attributeTable: string,
    readonly backref: string | null,
    readonly options: { [key: string]: any },
  ) {}

  getCode(): string {
    const attrs = [`() => ${this.referencedTable}`];

    if (this.backref) {
      attrs.push(
        `(${this.referencedTable.toLocaleLowerCase()}) => ${this.referencedTable.toLocaleLowerCase()}.${this.backref}`,
      );
    }

    const ops = optionsToCode(this.options);

    if (ops) {
      attrs.push(ops);
    }

    return `@${this.name}(${attrs.join(', ')})`;
  }
}

export class ManyToOneDecorator implements IImportable {
  readonly name = 'ManyToOne';
  readonly path = 'typeorm';

  constructor(
    readonly referencedTable: string,
    readonly attributeTable: string,
    readonly backref: string | null,
    readonly options: { [key: string]: any },
  ) {}

  getCode(): string {
    const attrs = [`() => ${this.referencedTable}`];

    if (this.backref) {
      attrs.push(
        `(${this.referencedTable.toLocaleLowerCase()}) => ${this.referencedTable.toLocaleLowerCase()}.${this.backref}`,
      );
    }

    const ops = optionsToCode(this.options);

    if (ops) {
      attrs.push(ops);
    }

    return `@${this.name}(${attrs.join(', ')})`;
  }
}

export class OneToOneDecorator implements IImportable {
  readonly name = 'OneToOne';
  readonly path = 'typeorm';

  constructor(
    readonly referencedTable: string,
    readonly attributeTable: string,
    readonly backref: string | null,
    readonly options: { [key: string]: any },
  ) {}

  getCode(): string {
    const attrs = [`() => ${this.referencedTable}`];

    if (this.backref) {
      attrs.push(
        `(${this.referencedTable.toLocaleLowerCase()}) => ${this.referencedTable.toLocaleLowerCase()}.${this.backref}`,
      );
    }

    const ops = optionsToCode(this.options);

    if (ops) {
      attrs.push(ops);
    }

    return `@${this.name}(${attrs.join(', ')})`;
  }
}

export class GeneratedDecorator implements IImportable {
  readonly name = 'Generated';
  readonly path = 'typeorm';

  getCode(): string {
    return `@${this.name}()`;
  }
}

export class UniqueDecorator implements IImportable {
  readonly name = 'Unique';
  readonly path = 'typeorm';

  getCode(): string {
    return `@${this.name}()`;
  }
}

export class JoinColumnDecorator implements IImportable {
  readonly name = 'JoinColumn';
  readonly path = 'typeorm';

  getCode(): string {
    return `@${this.name}()`;
  }
}
