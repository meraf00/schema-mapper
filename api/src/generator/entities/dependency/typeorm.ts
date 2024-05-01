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
