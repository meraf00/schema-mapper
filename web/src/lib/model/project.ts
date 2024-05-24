import { Schema } from 'yup';

export class Project {
  stub: string;

  name: string;

  schemas: Schema[];

  constructor(stub: string, name: string, schemas: Schema[]) {
    this.name = name;
    this.stub = stub;
    this.schemas = schemas;
  }
}
