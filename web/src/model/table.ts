import { Attribute } from './attribute';

export class Table {
  id: string;

  name: string;

  attributes: Attribute[];

  constructor(id: string, name: string, attributes: Attribute[]) {
    this.id = id;
    this.name = name;
    this.attributes = attributes;
  }
}
