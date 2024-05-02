import { Injectable } from '@nestjs/common';
import { SchemaService } from 'src/schema/services';
import { Entity } from '../entities/entity';
import { Schema } from 'src/schema/entities';
import { Service } from '../entities/service/service';
import { Controller } from '../entities/controller/controller';
import { Importable } from '../entities/dependency';
import { CreateDto, UpdateDto } from '../entities/dto/dto';

@Injectable()
export class CodeGeneratorService {
  constructor(private schemaService: SchemaService) {}

  createModule(schema: Schema): Importable {
    return;
  }

  createEntities(schema: Schema): Importable[] {
    return schema.tables.map(
      (table) =>
        new Entity(
          schema.name,
          table,
          schema.tables.flatMap((t) => t.attributes),
        ),
    );
  }

  createServices(schema: Schema): Importable[] {
    return schema.tables
      .filter((table) => table.isAggregate)
      .map((table) => new Service(schema.name, table));
  }

  createControllers(schema: Schema): Importable[] {
    return schema.tables
      .filter((table) => table.isAggregate)
      .map((table) => new Controller(schema.name, table));
  }

  createDtos(schema: Schema): Importable[] {
    return schema.tables
      .filter((table) => table.isAggregate)
      .flatMap((table) => [
        new CreateDto(schema.name, table),
        new UpdateDto(schema.name, table),
      ]);
  }
}
