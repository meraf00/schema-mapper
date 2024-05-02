import { decoratorTemplate } from './common.templates';
import { Importable } from './types';

export class NestInjectable implements Importable {
  name = 'Injectable';
  module = '@nestjs/common';
  dependency = [];

  code(): string {
    return decoratorTemplate({ name: this.name, params: [] });
  }
}

export class NestController implements Importable {
  readonly name = 'Controller';
  readonly module = '@nestjs/common';
  readonly dependency = [];

  constructor(readonly route: string = '') {}

  code(): string {
    return decoratorTemplate({ name: this.name, params: [`'${this.route}'`] });
  }
}

export class NestPost implements Importable {
  readonly name = 'Post';
  readonly module = '@nestjs/common';
  readonly dependency = [];

  constructor(readonly route: string = '') {}

  code(): string {
    return decoratorTemplate({ name: this.name, params: [`'${this.route}'`] });
  }
}

export class NestGet implements Importable {
  readonly name = 'Get';
  readonly module = '@nestjs/common';
  readonly dependency = [];

  constructor(readonly route: string = '') {}

  code(): string {
    return decoratorTemplate({ name: this.name, params: [`'${this.route}'`] });
  }
}

export class NestPut implements Importable {
  readonly name = 'Put';
  readonly module = '@nestjs/common';
  readonly dependency = [];

  constructor(readonly route: string = '') {}

  code(): string {
    return decoratorTemplate({ name: this.name, params: [`'${this.route}'`] });
  }
}

export class NestDelete implements Importable {
  readonly name = 'Delete';
  readonly module = '@nestjs/common';
  readonly dependency = [];

  constructor(readonly route: string = '') {}

  code(): string {
    return decoratorTemplate({ name: this.name, params: [`'${this.route}'`] });
  }
}

export class NestParam implements Importable {
  readonly name = 'Param';
  readonly module = '@nestjs/common';
  readonly dependency = [];

  code(): string {
    return decoratorTemplate({
      name: this.name,
      params: [],
    });
  }
}

export class NestQuery implements Importable {
  readonly name = 'Query';
  readonly module = '@nestjs/common';
  readonly dependency = [];

  code(): string {
    return decoratorTemplate({
      name: this.name,
      params: [],
    });
  }
}

export class NestBody implements Importable {
  readonly name = 'Body';
  readonly module = '@nestjs/common';
  readonly dependency = [];

  code(): string {
    return decoratorTemplate({ name: this.name, params: [] });
  }
}

export class NestParseUUIDPipe implements Importable {
  readonly name = 'ParseUUIDPipe';
  readonly module = '@nestjs/common';
  readonly dependency = [];

  code(): string {
    return `new ${this.name}({ version: '4' })`;
  }
}

export class NestParseIntPipe implements Importable {
  readonly name = 'ParseIntPipe';
  readonly module = '@nestjs/common';
  readonly dependency = [];

  code(): string {
    return `new ${this.name}()`;
  }
}

export class NestNotFoundException implements Importable {
  readonly name = 'NotFoundException';
  readonly module = '@nestjs/common';
  readonly dependency = [];

  code(): string {
    return decoratorTemplate({ name: this.name, params: [] });
  }
}

export class NestInjectRepository implements Importable {
  readonly name = 'InjectRepository';
  readonly module = '@nestjs/typeorm';
  readonly dependency = [];

  constructor(readonly entity: string) {}

  code(): string {
    return decoratorTemplate({ name: this.name, params: [this.entity] });
  }
}
