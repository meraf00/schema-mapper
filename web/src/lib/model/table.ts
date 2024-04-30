import { Attribute } from './attribute';

export class Table {
  id: string;

  name: string;

  attributes: Attribute[];

  isAggregate: boolean;

  constructor(
    id: string,
    name: string,
    attributes: Attribute[],
    isAggregate: boolean
  ) {
    this.id = id;
    this.name = name;
    this.attributes = attributes;
    this.isAggregate = isAggregate;
  }
}
