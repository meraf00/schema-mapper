import { Attribute, Table } from 'src/schema/entities';
import { ICodeFile, IImportable } from './Code';
import { AttributeCode } from './AttributeCode';
import { EntityDecorator } from './Importables';
import { BackRefAttribCode } from './BackRefAttribCode';

export class EntityCode implements ICodeFile {
  imports: IImportable[];
  exports: string[];
  location: string;

  constructor(
    private readonly table: Table,
    private readonly module: string,
    private readonly schemaAttributes: Attribute[],
  ) {
    this.location = `src/entities/${table.name}`;
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


    this.schemaAttributes
      .filter(
        (attr) => attr.isForeign && attr.references.tableId === this.table.id,
      )
      .forEach((attr) => {
        const imp = new BackRefAttribCode(attr);
        body.push(imp.getCode());
        this.imports.push(...imp.imports);
      });

    return `@Entity()\nexport class ${this.table.name} {\n${body.join(
      '\n\n',
    )}\n}`;
  }
}
