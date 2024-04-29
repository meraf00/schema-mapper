import { Table } from 'src/schema/entities';
import { ICodeFile, IImportable } from './Code';
import {
  ControllerDecorator,
  NotFoundExceptionImport,
  PostDecorator,
} from './Importables';
import { AttributeCode } from './AttributeCode';

export class ControllerCode implements ICodeFile {
  imports: IImportable[];
  exports: string[];
  location: string;
  name: string;

  constructor(
    readonly table: Table,
    readonly module: string,
  ) {
    this.location = `src/${this.module}/controllers/${this.table.name}.controller.ts`;
    this.imports = [
      new ControllerDecorator(this.table.name),
      new NotFoundExceptionImport(),
      {
        name: `${this.table.name}Service`,
        path: '',
      } as IImportable,
      {
        name: `Create${this.table.name}Dto`,
        path: '',
      } as IImportable,
      {
        name: `Update${this.table.name}Dto`,
        path: '',
      } as IImportable,
    ];

    this.exports = [`${this.table.name}Controller`];
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

    return `@Controller('${this.table.name}')
export class ${this.table.name}Controller {

    constructor(private readonly ${this.table.name}Service: ${this.table.name}Service) {}

    @Post('${primaryKey.name}')
    create(@Body() create${this.table.name}Dto: Create${this.table.name}Dto) {
        return this.${this.table.name}Service.create(create${this.table.name}Dto);
    }

    @Get()
    findAll() {
        return this.${this.table.name}Service.findAll();
    }

    @Get('${primaryKey.name}')
    findOne(@Param('${primaryKey.name}', new ParseUUIDPipe({ version: '4' })) ${primaryKey.name}: ${primaryKeyType}) {
        try {
            return this.${this.table.name}Service.findOne(${primaryKey.name});
        } catch(e) {
            throw new NotFoundException(e.message);
        }
    }

    @Put('${primaryKey.name}')
    update(@Param('${primaryKey.name}', new ParseUUIDPipe({ version: '4' })) ${primaryKey.name}: ${primaryKeyType}, @Body() update${this.table.name}Dto: Update${this.table.name}Dto) {
        try {
            return this.${this.table.name}Service.update(${primaryKey.name}, update${this.table.name}Dto);
        } catch(e) {
            throw new NotFoundException(e.message);
        }
    }

    @Delete('${primaryKey.name}')
    delete(@Param('${primaryKey.name}', new ParseUUIDPipe({ version: '4' })) ${primaryKey.name}: ${primaryKeyType}) {
        try {
            return this.${this.table.name}Service.delete(${primaryKey.name});
        } catch(e) {
            throw new NotFoundException(e.message);
        }
    }

}`;
  }
}
