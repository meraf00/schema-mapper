import { Module } from '@nestjs/common';
import {
  AttributeController,
  SchemaController,
  TableController,
} from './controllers';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchemaService, TableService, AttributeService } from './services';
import { Schema, Table, Attribute } from './entities';
import { CodeGenerationService } from './services/codegeneration.service';

@Module({
  imports: [TypeOrmModule.forFeature([Schema, Table, Attribute])],
  providers: [
    SchemaService,
    AttributeService,
    TableService,
    CodeGenerationService,
  ],
  controllers: [SchemaController, AttributeController, TableController],
})
export class SchemaModule {}
