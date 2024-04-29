import { Table } from 'src/schema/entities';
import { ICodeFile, IImportable } from './Code';
import { AttributeCode } from './AttributeCode';
import { EntityDecorator } from './Importables';

export class EntityCode implements ICodeFile {
  imports: IImportable[];
  exports: string[];
  location: string;

  constructor(
    private readonly table: Table,
    private readonly module: string,
  ) {
    this.location = `src/${this.module}/entities/${table.name}.ts`;
    this.imports = [new EntityDecorator()];
    this.exports = [table.name];
  }

  getCode(): string {
    const attribs = this.table.attributes.map(
      (attribute) => new AttributeCode(attribute),
    );

    const body = [];

    for (let attrib of attribs) {
      body.push(attrib.getCode());

      attrib.imports.forEach((imp) => {
        if (!this.imports.find((i) => i.name === imp.name)) {
          this.imports.push(imp);
        }
      });
    }

    return `@Entity()\nexport class ${this.table.name} {\n${body.join(
      '\n\n',
    )}\n}`;
  }
}
