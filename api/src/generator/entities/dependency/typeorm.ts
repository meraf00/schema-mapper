import { Case } from 'change-case-all';
import { decoratorTemplate } from './common.templates';
import { backRefTemplate, refTableTemplate } from './typeorm.template';
import { stringify } from '../util';

export class TypeOrmOneToOne {
  readonly name = 'OneToOne';
  readonly module = 'typeorm';

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

export class TypeOrmManyToOne {
  readonly name = 'ManyToOne';
  readonly module = 'typeorm';

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

export class TypeOrmOneToMany {
  readonly name = 'OneToMany';
  readonly module = 'typeorm';

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

export class TypeOrmColumn {
  public name = 'Column';
  readonly module = 'typeorm';

  constructor(readonly options: { [key: string]: any }) {}

  code(): string {
    return decoratorTemplate({
      name: this.name,
      params: this.options ? [stringify(this.options)] : [],
    });
  }
}

export class TypeOrmPrimaryColumn extends TypeOrmColumn {
  override name = 'PrimaryColumn';

  constructor(readonly options: { [key: string]: any }) {
    super(options);
  }
}

export class TypeOrmPrimaryGeneratedColumn extends TypeOrmColumn {
  override name = 'PrimaryGeneratedColumn';

  constructor(readonly options: { [key: string]: any }) {
    super(options);
  }
}

export class TypeOrmGeneratedColumn extends TypeOrmColumn {
  override name = 'Generated';

  constructor(readonly options: { [key: string]: any }) {
    super(options);
  }
}

export class TypeOrmJoinColumn extends TypeOrmColumn {
  override name = 'JoinColumn';

  constructor(readonly options: { [key: string]: any }) {
    super(options);
  }
}

export class TypeOrmRepository {
  readonly name = 'Repository';
  readonly path = 'typeorm';

  constructor(readonly entity: string) {}

  code(): string {
    return `${this.name}<${this.entity}>`;
  }
}

export class TypeOrmEntity {
  readonly name = 'Entity';
  readonly path = 'typeorm';

  code(): string {
    return decoratorTemplate({ name: this.name, params: [] });
  }
}
