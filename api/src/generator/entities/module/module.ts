import { Case } from 'change-case-all';
import { Importable } from '../dependency';
import { Schema } from 'src/schema/entities';
import { serviceNameTemplate } from '../service/service.template';
import { controllerNameTemplate } from '../controller/controller.template';
import { moduleTemplate } from './module.template';
import { NestTypeOrmModule } from '../dependency/nestjs';

export class Module implements Importable {
  name: string;
  dependency: Importable[] = [];

  constructor(
    public module: string,
    readonly schema: Schema,
  ) {
    this.name = Case.pascal(this.module);

    this.dependency.push(
      ...this.entities,
      ...this.providers,
      ...this.controllers,
      new NestTypeOrmModule({
        type: 'forFeature',
        options: this.entities.map((entity) => entity.name),
      }),
    );
  }

  get entities(): Importable[] {
    return this.schema.tables.map(
      (table) =>
        ({
          name: Case.pascal(table.name),
          module: this.module,
        }) as Importable,
    );
  }

  get providers(): Importable[] {
    return this.schema.tables
      .filter((table) => table.isAggregate)
      .map(
        (table) =>
          ({
            name: serviceNameTemplate({
              name: Case.pascal(table.name),
            }),
            module: this.module,
          }) as Importable,
      );
  }

  get controllers(): Importable[] {
    return this.schema.tables
      .filter((table) => table.isAggregate)
      .map(
        (table) =>
          ({
            name: controllerNameTemplate({
              name: Case.pascal(table.name),
            }),
            module: this.module,
          }) as Importable,
      );
  }

  code(): string {
    return moduleTemplate({
      name: this.name,
      imports: [
        new NestTypeOrmModule({
          type: 'forFeature',
          options: this.entities.map((entity) => entity.name),
        }).code(),
      ],
      providers: this.providers.map((provider) => provider.name),
      controllers: this.controllers.map((controller) => controller.name),
    });
  }
}
