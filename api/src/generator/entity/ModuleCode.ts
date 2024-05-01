import { Schema } from 'src/schema/entities';
import { ICodeFile, IImportable } from './Code';
import { ModuleDecorator, TypeOrmModuleImport } from './Importables';

export class ModuleCode implements ICodeFile {
  location: string;
  imports: IImportable[];
  name: string;
  exports: string[];

  constructor(readonly schema: Schema) {
    this.location = `src/${schema.name}/${schema.name}.module`;
    this.imports = [new ModuleDecorator(), new TypeOrmModuleImport()];
    this.name = `${schema.name}Module`;
    this.exports = [this.name];
  }

  getCode(): string {
    const entities = this.schema.tables.map((table) => {
      this.imports.push({ name: table.name, path: '' } as IImportable);
      return table.name;
    });

    const controllers = this.schema.tables
      .filter((table) => table.isAggregate)
      .map((table) => {
        this.imports.push({
          name: `${table.name}Controller`,
          path: '',
        } as IImportable);
        return `${table.name}Controller`;
      });

    const services = this.schema.tables
      .filter((table) => table.isAggregate)
      .map((table) => {
        this.imports.push({
          name: `${table.name}Service`,
          path: '',
        } as IImportable);
        return `${table.name}Service`;
      });

    return `@Module({
  imports: [TypeOrmModule.forFeature([${entities.join(', ')}])],
  controllers: [${controllers.join(', ')}],
  providers: [${services.join(', ')}],
})
export class ${this.name} {}`;
  }
}
