import { Module } from '@nestjs/common';
import {
  AttributeController,
  SchemaController,
  TableController,
} from './controllers';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchemaService, TableService, AttributeService } from './services';
import { Schema, Table, Attribute } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([Schema, Table, Attribute])],
  providers: [SchemaService, AttributeService, TableService],
  controllers: [SchemaController, AttributeController, TableController],
})
export class SchemaModule {}
