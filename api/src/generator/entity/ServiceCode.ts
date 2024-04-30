import { Table } from 'src/schema/entities';
import { ICodeFile, IImportable } from './Code';
import {
  InjectRepositoryDecorator,
  InjectableDecorator,
  RepositoryType,
} from './Importables';
import { AttributeCode } from './AttributeCode';

export class ServiceCode implements ICodeFile {
  imports: IImportable[];
  exports: string[];
  location: string;
  name: string;

  constructor(
    readonly table: Table,
    readonly module: string,
  ) {
    this.location = `src/${this.module}/services/${this.table.name}.service`;
    this.imports = [
      new InjectableDecorator(),
      new InjectRepositoryDecorator(table.name),
      new RepositoryType(table.name),
      {
        name: 'Create' + table.name + 'Dto',
        path: '',
      } as IImportable,
      {
        name: 'Update' + table.name + 'Dto',
        path: '',
      } as IImportable,
      {
        name: table.name,
        path: '',
      } as IImportable,
    ];
    this.name = `${table.name}Service`;
    this.exports = [this.name];
  }

  getPrimaryKey() {
    return this.table.attributes.find((attr) => attr.isPrimary);
  }

  getCode(): string {
    const primaryKey = this.getPrimaryKey();
    let primaryKeyType: string;

    if (primaryKey) {
      primaryKeyType = new AttributeCode(primaryKey).type();
    }

    primaryKeyType = primaryKeyType || 'string';

    const repoName = `${this.table.name.toLocaleLowerCase()}Repository`;

    return `@Injectable()
export class ${this.name} {
    constructor(@InjectRepository(${this.table.name}) private readonly ${repoName}: Repository<${this.table.name}>) {}

    findAll(): Promise<${this.table.name}[]> {
        return this.${repoName}.find();
    }

    findOne(${primaryKey.name}: ${primaryKeyType}): Promise<${this.table.name}> {
        return this.${repoName}.findOne({where: { ${primaryKey.name} }});
    }

    create(data: Create${this.table.name}Dto): Promise<${this.table.name}> {
        const entity = this.${repoName}.create(data);
        return this.${repoName}.save(entity);
    }

    update(${primaryKey.name}: ${primaryKeyType}, data: Update${this.table.name}Dto): Promise<${this.table.name}> {
        this.${repoName}.update(${primaryKey.name}, data);
        return this.findOne(${primaryKey.name});
    }

    delete(${primaryKey.name}: ${primaryKeyType}): Promise<void> {
        return this.${repoName}.delete(${primaryKey.name});
    }
}`;
  }
}
