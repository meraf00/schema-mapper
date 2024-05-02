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

export class NestInjectRepository implements Importable {
  readonly name = 'InjectRepository';
  readonly module = '@nestjs/typeorm';
  readonly dependency = [];

  constructor(readonly entity: string) {}

  code(): string {
    return decoratorTemplate({ name: this.name, params: [this.entity] });
  }
}
