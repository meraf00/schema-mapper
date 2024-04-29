import { Schema } from 'src/schema/entities';
import { ICodeFile, ICodeFolder } from './Code';
import { ModuleCode } from './ModuleCode';
import { ControllerCode } from './ControllerCode';
import { ServiceCode } from './ServiceCode';

export class ModuleFolder implements ICodeFolder {
  constructor(private readonly schema: Schema) {}

  getFiles(): ICodeFile[] {
    const files: ICodeFile[] = [];

    files.push(new ModuleCode(this.schema));

    this.schema.tables.forEach((table) => {
      if (table.isAggregate) {
        files.push(new ControllerCode(table, this.schema.name));
        files.push(new ServiceCode(table, this.schema.name));
      }
    });

    return files;
  }
}
