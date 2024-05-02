import { Injectable } from '@nestjs/common';
import { SchemaService } from 'src/schema/services';
import { Entity } from '../entities/entity';
import { Schema } from 'src/schema/entities';

@Injectable()
export class CodeGeneratorService {
  constructor(private schemaService: SchemaService) {}

  createEntities(schema: Schema): Entity[] {
    return schema.tables.map(
      (table) =>
        new Entity(
          schema.name,
          table,
          schema.tables.flatMap((t) => t.attributes),
        ),
    );
  }
}
