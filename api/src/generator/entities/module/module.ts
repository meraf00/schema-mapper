import { Case } from 'change-case-all';
import { Importable } from '../dependency';
import { Schema } from 'src/schema/entities';
import { serviceNameTemplate } from '../service/service.template';
import { controllerNameTemplate } from '../controller/controller.template';
import { moduleNameTemplate, moduleTemplate } from './module.template';
import { NestModule, NestTypeOrmModule } from '../dependency/nestjs';
import { Entity } from '../entity';
import { Service } from '../service/service';
import { Controller } from '../controller/controller';
import { CreateDto, UpdateDto } from '../dto/dto';

export class Module implements Importable {
  name: string;
  dependency: Importable[] = [];

  constructor(
    public module: string,
    readonly schema: Schema,
  ) {
    this.name = moduleNameTemplate({ name: Case.pascal(this.module) });

    this.dependency.push(
      ...this.entities,
      ...this.providers,
      ...this.controllers,
      new NestTypeOrmModule({
        type: 'forFeature',
        options: this.entities.map((entity) => entity.name),
      }),
      new NestModule(),
    );
  }

  get entities(): Importable[] {
    if (!this.schema) return [];

    return this.schema.tables.map(
      (table) =>
        new Entity(
          this.module,
          table,
          this.schema.tables.flatMap((table) => table.attributes),
        ),
    );
  }

  get providers(): Importable[] {
    if (!this.schema) return [];

    return this.schema.tables
      .filter((table) => table.isAggregate)
      .map((table) => new Service(this.module, table));
  }

  get controllers(): Importable[] {
    if (!this.schema) return [];

    return this.schema.tables
      .filter((table) => table.isAggregate)
      .map((table) => new Controller(this.module, table));
  }

  get dtos(): Importable[] {
    if (!this.schema) return [];

    return this.schema.tables
      .filter((table) => table.isAggregate)
      .flatMap((table) => [
        new CreateDto(this.module, table),
        new UpdateDto(this.module, table),
      ]);
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
