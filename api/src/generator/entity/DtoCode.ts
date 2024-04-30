import { Table } from 'src/schema/entities';
import { ICodeFile, IImportable } from './Code';
import { DtoAttributeCode } from './DtoAttributeCode';

export class DtoCode implements ICodeFile {
  imports: IImportable[];
  exports: string[];
  location: string;

  constructor(
    private readonly table: Table,
    private readonly module: string,
  ) {
    this.location = `src/${this.module}/dto/${this.table.name}.dto`;
    this.imports = [];
    this.exports = [
      `Create${this.table.name}Dto`,
      `Update${this.table.name}Dto`,
    ];
  }

  getCode(): string {
    const createAttribs = this.table.attributes.map(
      (attribute) => new DtoAttributeCode(attribute),
    );

    const updateAttribs = this.table.attributes.map(
      (attribute) => new DtoAttributeCode(attribute),
    );

    const createBody = [];
    const updateBody = [];

    for (let attrib of createAttribs) {
      createBody.push(attrib.getCode());

      attrib.imports.forEach((imp) => {
        if (!this.imports.find((i) => i.name === imp.name)) {
          this.imports.push(imp);
        }
      });
    }

    for (let attrib of updateAttribs) {
      updateBody.push(attrib.getCode());

      attrib.imports.forEach((imp) => {
        if (!this.imports.find((i) => i.name === imp.name)) {
          this.imports.push(imp);
        }
      });
    }

    return `export class Create${this.table.name}Dto {\n${createBody.join(
      '\n\n',
    )}\n}\n\nexport class Update${this.table.name}Dto {\n${updateBody.join('\n\n')}\n}`;
  }
}
