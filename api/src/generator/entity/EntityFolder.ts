import { Schema } from 'src/schema/entities';
import { ICodeFile, ICodeFolder } from './Code';
import { EntityCode } from './EntityCode';

export class EntityFolder implements ICodeFolder {
  constructor(private readonly schema: Schema) {}

  getFiles(): ICodeFile[] {
    return this.schema.tables.map((table) => new EntityCode(table));
  }
}
