import { Table } from 'src/schema/entities';
import { Importable } from '../dependency';
import { Case } from 'change-case-all';
import { DtoAttribute } from './dto-attribute';
import {
  createDtoTemplate,
  dtoTemplate,
  updateDtoTemplate,
} from './dto.template';

export class CreateDto implements Importable {
  name: string;
  dependency: Importable[] = [];
  attributes: DtoAttribute[] = [];

  constructor(
    public module: string,
    readonly table: Table,
  ) {
    this.name = createDtoTemplate({ name: Case.pascal(table.name) });

    this.attributes = this.table.attributes.map(
      (attribute) => new DtoAttribute(attribute),
    );

    this.dependency.push(
      ...this.attributes.flatMap((attribute) =>
        attribute.dependency.map((dep) => {
          if (dep.module === null) {
            dep.module = this.module;
          }
          return dep;
        }),
      ),
    );
  }

  code(): string {
    return dtoTemplate({
      name: this.name,
      attributes: this.attributes.map((attr) => attr.code()),
    });
  }
}

export class UpdateDto implements Importable {
  name: string;
  dependency: Importable[] = [];
  attributes: DtoAttribute[] = [];

  constructor(
    public module: string,
    readonly table: Table,
  ) {
    this.name = updateDtoTemplate({ name: Case.pascal(table.name) });

    this.attributes = this.table.attributes.map(
      (attribute) => new DtoAttribute(attribute, true),
    );

    this.dependency.push(
      ...this.attributes.flatMap((attribute) => attribute.dependency),
    );
  }

  code(): string {
    return dtoTemplate({
      name: this.name,
      attributes: this.attributes.map((attr) => attr.code()),
    });
  }
}
