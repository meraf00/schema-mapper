import { IImportable } from './Code';

const optionsToCode = (options: { [key: string]: any }): string => {
  const code = [];

  for (let key in options) {
    code.push(`${key}: ${options[key]}`);
  }

  if (code.length > 0) {
    return `{ ${code.join(', ')} }`;
  }

  return '';
};

export class TypeOrmModuleImport implements IImportable {
  readonly name = 'TypeOrmModule';
  readonly path = '@nestjs/typeorm';

  getCode(): string {
    return `import { ${this.name} } from '${this.path}';`;
  }
}

export class EntityDecorator implements IImportable {
  readonly name = 'Entity';
  readonly path = 'typeorm';

  getCode(): string {
    return `@${this.name}()`;
  }
}

export class ColumnDecorator implements IImportable {
  readonly name = 'Column';
  readonly path = 'typeorm';

  constructor(
    readonly options: {
      nullable?: boolean;
      unique?: boolean;
    },
  ) {}

  getCode(): string {
    return `@${this.name}(${optionsToCode(this.options)})`;
  }
}

export class PrimaryGeneratedColumnDecorator implements IImportable {
  readonly name = 'PrimaryGeneratedColumn';
  readonly path = 'typeorm';

  getCode(): string {
    return `@${this.name}()`;
  }
}

export class PrimaryColumnDecorator implements IImportable {
  readonly name = 'PrimaryColumn';
  readonly path = 'typeorm';

  getCode(): string {
    return `@${this.name}()`;
  }
}

export class OneToManyDecorator implements IImportable {
  readonly name = 'OneToMany';
  readonly path = 'typeorm';

  constructor(
    readonly referencedTable: string,
    readonly attributeTable: string,
    readonly backref: string | null,
    readonly options: { [key: string]: any },
  ) {}

  getCode(): string {
    const attrs = [`() => ${this.referencedTable}`];

    if (this.backref) {
      attrs.push(
        `(${this.referencedTable.toLocaleLowerCase()}) => ${this.referencedTable.toLocaleLowerCase()}.${this.backref}`,
      );
    }

    const ops = optionsToCode(this.options);

    if (ops) {
      attrs.push(ops);
    }

    return `@${this.name}(${attrs.join(', ')})`;
  }
}

export class ManyToOneDecorator implements IImportable {
  readonly name = 'ManyToOne';
  readonly path = 'typeorm';

  constructor(
    readonly referencedTable: string,
    readonly attributeTable: string,
    readonly backref: string | null,
    readonly options: { [key: string]: any },
  ) {}

  getCode(): string {
    const attrs = [`() => ${this.referencedTable}`];

    if (this.backref) {
      attrs.push(
        `(${this.referencedTable.toLocaleLowerCase()}) => ${this.referencedTable.toLocaleLowerCase()}.${this.backref}`,
      );
    }

    const ops = optionsToCode(this.options);

    if (ops) {
      attrs.push(ops);
    }

    return `@${this.name}(${attrs.join(', ')})`;
  }
}

export class OneToOneDecorator implements IImportable {
  readonly name = 'OneToOne';
  readonly path = 'typeorm';

  constructor(
    readonly referencedTable: string,
    readonly attributeTable: string,
    readonly backref: string | null,
    readonly options: { [key: string]: any },
  ) {}

  getCode(): string {
    const attrs = [`() => ${this.referencedTable}`];

    if (this.backref) {
      attrs.push(
        `(${this.referencedTable.toLocaleLowerCase()}) => ${this.referencedTable.toLocaleLowerCase()}.${this.backref}`,
      );
    }

    const ops = optionsToCode(this.options);

    if (ops) {
      attrs.push(ops);
    }

    return `@${this.name}(${attrs.join(', ')})`;
  }
}

export class GeneratedDecorator implements IImportable {
  readonly name = 'Generated';
  readonly path = 'typeorm';

  getCode(): string {
    return `@${this.name}()`;
  }
}

export class UniqueDecorator implements IImportable {
  readonly name = 'Unique';
  readonly path = 'typeorm';

  getCode(): string {
    return `@${this.name}()`;
  }
}

export class JoinColumnDecorator implements IImportable {
  readonly name = 'JoinColumn';
  readonly path = 'typeorm';

  getCode(): string {
    return `@${this.name}()`;
  }
}

export class InjectableDecorator implements IImportable {
  readonly name = 'Injectable';
  readonly path = '@nestjs/common';

  getCode(): string {
    return `@${this.name}()`;
  }
}

export class ModuleDecorator implements IImportable {
  readonly name = 'Module';
  readonly path = '@nestjs/common';

  getCode(): string {
    return `@${this.name}({})`;
  }
}

export class ControllerDecorator implements IImportable {
  readonly name = 'Controller';
  readonly path = '@nestjs/common';

  constructor(readonly route: string = '') {}

  getCode(): string {
    return `@${this.name}('${this.route}')`;
  }
}

export class InjectRepositoryDecorator implements IImportable {
  readonly name = 'InjectRepository';
  readonly path = '@nestjs/typeorm';

  constructor(readonly entity: string) {}

  getCode(): string {
    return `@${this.name}(${this.entity})`;
  }
}

export class RepositoryType implements IImportable {
  readonly name = 'Repository';
  readonly path = 'typeorm';

  constructor(readonly entity: string) {}

  getCode(): string {
    return `${this.name}<${this.entity}>`;
  }
}

export class ApiPropertyDecorator implements IImportable {
  readonly name = 'ApiProperty';
  readonly path = '@nestjs/swagger';

  constructor(readonly options: { [key: string]: any }) {}

  getCode(): string {
    return `@${this.name}(${optionsToCode(this.options)})`;
  }
}

export class IsBooleanDecorator implements IImportable {
  readonly name = 'IsBoolean';
  readonly path = 'class-validator';

  getCode(): string {
    return `@${this.name}()`;
  }
}

export class IsOptionalDecorator implements IImportable {
  readonly name = 'IsOptional';
  readonly path = 'class-validator';

  getCode(): string {
    return `@${this.name}()`;
  }
}

export class IsStringDecorator implements IImportable {
  readonly name = 'IsString';
  readonly path = 'class-validator';

  getCode(): string {
    return `@${this.name}()`;
  }
}

export class IsUUIDDecorator implements IImportable {
  readonly name = 'IsUUID';
  readonly path = 'class-validator';

  getCode(): string {
    return `@${this.name}()`;
  }
}

export class IsEnumDecorator implements IImportable {
  readonly name = 'IsEnum';
  readonly path = 'class-validator';

  constructor(readonly enumName: string) {}

  getCode(): string {
    return `@${this.name}(${this.enumName})`;
  }
}

export class IsNumberDecorator implements IImportable {
  readonly name = 'IsNumber';
  readonly path = 'class-validator';

  getCode(): string {
    return `@${this.name}()`;
  }
}

export class PostDecorator implements IImportable {
  readonly name = 'Post';
  readonly path = '@nestjs/common';

  constructor(readonly route: string = '') {}

  getCode(): string {
    if (this.route) return `@${this.name}('${this.route}')`;
    return `@${this.name}()`;
  }
}

export class GetDecorator implements IImportable {
  readonly name = 'Get';
  readonly path = '@nestjs/common';

  constructor(readonly route: string = '') {}

  getCode(): string {
    if (this.route) return `@${this.name}('${this.route}')`;
    return `@${this.name}()`;
  }
}

export class PutDecorator implements IImportable {
  readonly name = 'Put';
  readonly path = '@nestjs/common';

  constructor(readonly route: string = '') {}

  getCode(): string {
    if (this.route) return `@${this.name}('${this.route}')`;
    return `@${this.name}()`;
  }
}

export class DeleteDecorator implements IImportable {
  readonly name = 'Delete';
  readonly path = '@nestjs/common';

  constructor(readonly route: string = '') {}

  getCode(): string {
    if (this.route) return `@${this.name}('${this.route}')`;
    return `@${this.name}()`;
  }
}

export class ParamDecorator implements IImportable {
  readonly name = 'Param';
  readonly path = '@nestjs/common';

  constructor(
    readonly param: string,
    readonly pipe: string,
  ) {}

  getCode(): string {
    return `@${this.name}('${this.param}', new ${this.pipe}())`;
  }
}

export class BodyDecorator implements IImportable {
  readonly name = 'Body';
  readonly path = '@nestjs/common';

  getCode(): string {
    return `@${this.name}()`;
  }
}

export class ParseUUIDPipeDecorator implements IImportable {
  readonly name = 'ParseUUIDPipe';
  readonly path = '@nestjs/common';

  constructor(readonly options: { [key: string]: any }) {}

  getCode(): string {
    return `@${this.name}(${optionsToCode(this.options)})`;
  }
}

export class ParseIntPipeDecorator implements IImportable {
  readonly name = 'ParseIntPipe';
  readonly path = '@nestjs/common';

  constructor(readonly options: { [key: string]: any }) {}

  getCode(): string {
    return `@${this.name}(${optionsToCode(this.options)})`;
  }
}

export class NotFoundExceptionImport implements IImportable {
  readonly name = 'NotFoundException';
  readonly path = '@nestjs/common';

  getCode(): string {
    return `new ${this.name}()`;
  }
}
