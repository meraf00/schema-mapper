import { Schema } from 'src/schema/entities';
import { ICodeFile, ICodeFolder } from './Code';
import { DtoCode } from './DtoCode';

export class DtoFolder implements ICodeFolder {
  constructor(private readonly schema: Schema) {}

  getFiles(): ICodeFile[] {
    return this.schema.tables.map(
      (table) => new DtoCode(table, this.schema.name),
    );
  }
}
