import { Case } from 'change-case-all';
import { decoratorTemplate } from './common.templates';
import { backRefTemplate, refTableTemplate } from './typeorm.template';
import { stringify } from '../util';
import { Importable } from './types';

export class TypeOrmOneToOne implements Importable {
  readonly name = 'OneToOne';
  readonly module = 'typeorm';
  readonly dependency = [];

  constructor(
    readonly referencedTableName: string,
    readonly backRefName: string | null,
    readonly options: { [key: string]: any },
  ) {}

  code(): string {
    const params = [
      refTableTemplate({
        table: Case.pascal(this.referencedTableName),
      }),
    ];

    if (this.backRefName) {
      params.push(
        backRefTemplate({
          refTable: Case.camel(this.referencedTableName),
          backRef: Case.camel(this.backRefName),
        }),
      );
    }

    const options = stringify(this.options);

    if (options) params.push(options);

    return decoratorTemplate({
      name: this.name,
      params,
    });
  }
}

export class TypeOrmManyToOne implements Importable {
  readonly name = 'ManyToOne';
  readonly module = 'typeorm';
  readonly dependency = [];

  constructor(
    readonly referencedTableName: string,
    readonly backRefName: string | null,
    readonly options: { [key: string]: any },
  ) {}

  code(): string {
    const params = [
      refTableTemplate({
        table: Case.pascal(this.referencedTableName),
      }),
    ];

    if (this.backRefName) {
      params.push(
        backRefTemplate({
          refTable: Case.camel(this.referencedTableName),
          backRef: Case.camel(this.backRefName),
        }),
      );
    }

    const options = stringify(this.options);

    if (options) params.push(options);

    return decoratorTemplate({
      name: this.name,
      params,
    });
  }
}

export class TypeOrmOneToMany implements Importable {
  readonly name = 'OneToMany';
  readonly module = 'typeorm';
  readonly dependency = [];

  constructor(
    readonly referencedTableName: string,
    readonly attribute: string | null,
    readonly options: { [key: string]: any },
  ) {}

  code(): string {
    const params = [
      refTableTemplate({
        table: Case.pascal(this.referencedTableName),
      }),
    ];

    if (this.attribute) {
      params.push(
        backRefTemplate({
          refTable: Case.camel(this.referencedTableName),
          backRef: Case.camel(this.attribute),
        }),
      );
    }

    const options = stringify(this.options);

    if (options) params.push(options);

    return decoratorTemplate({
      name: this.name,
      params,
    });
  }
}

export class TypeOrmColumn implements Importable {
  public name = 'Column';
  readonly module = 'typeorm';
  readonly dependency = [];

  constructor(readonly options?: { [key: string]: any }) {}

  code(): string {
    return decoratorTemplate({
      name: this.name,
      params: this.options ? [stringify(this.options)] : [],
    });
  }
}

export class TypeOrmPrimaryColumn extends TypeOrmColumn implements Importable {
  override name = 'PrimaryColumn';
  readonly dependency = [];

  constructor(readonly options?: { [key: string]: any }) {
    super(options);
  }
}

export class TypeOrmPrimaryGeneratedColumn
  extends TypeOrmColumn
  implements Importable
{
  override name = 'PrimaryGeneratedColumn';
  readonly dependency = [];

  constructor(readonly options?: { [key: string]: any }) {
    super(options);
  }
}

export class TypeOrmGeneratedColumn
  extends TypeOrmColumn
  implements Importable
{
  override name = 'Generated';
  readonly dependency = [];

  constructor(readonly options?: { [key: string]: any }) {
    super(options);
  }
}

export class TypeOrmJoinColumn extends TypeOrmColumn implements Importable {
  override name = 'JoinColumn';
  readonly dependency = [];

  constructor(readonly options?: { [key: string]: any }) {
    super(options);
  }
}

export class TypeOrmRepository implements Importable {
  readonly name = 'Repository';
  readonly module = 'typeorm';
  readonly dependency = [];

  constructor(readonly entity: string) {}

  code(): string {
    return `${this.name}<${this.entity}>`;
  }
}

export class TypeOrmEntity implements Importable {
  readonly name = 'Entity';
  readonly module = 'typeorm';
  readonly dependency = [];

  code(): string {
    return decoratorTemplate({ name: this.name, params: [] });
  }
}
