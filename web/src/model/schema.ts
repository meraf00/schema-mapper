import { Table } from './table';

export class Schema {
  id: string;

  name: string;

  tables: Table[];

  constructor(id: string, name: string, tables: Table[]) {
    this.id = id;
    this.name = name;
    this.tables = tables;
  }
}
