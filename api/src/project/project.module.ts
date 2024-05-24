import { Module } from '@nestjs/common';
import {
  AttributeController,
  SchemaController,
  TableController,
  ProjectController,
} from './controllers';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  SchemaService,
  TableService,
  AttributeService,
  ProjectService,
} from './services';
import { Schema, Table, Attribute, Project } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([Project, Schema, Table, Attribute])],
  providers: [ProjectService, SchemaService, AttributeService, TableService],
  controllers: [
    ProjectController,
    SchemaController,
    AttributeController,
    TableController,
  ],
  exports: [ProjectService, SchemaService, AttributeService, TableService],
})
export class ProjectModule {}
