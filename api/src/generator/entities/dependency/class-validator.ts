import { decoratorTemplate } from './common.templates';
import { Importable } from './types';
import { IsUUID } from 'class-validator';

export class ValidatorIsString implements Importable {
  name = 'IsString';
  module = 'class-validator';
  dependency = [];

  code(): string {
    return decoratorTemplate({ name: this.name, params: [] });
  }
}

export class ValidatorIsBoolean implements Importable {
  name = 'IsBoolean';
  module = 'class-validator';
  dependency = [];

  code(): string {
    return decoratorTemplate({ name: this.name, params: [] });
  }
}

export class ValidatorIsNumber implements Importable {
  name = 'IsNumber';
  module = 'class-validator';
  dependency = [];

  code(): string {
    return decoratorTemplate({ name: this.name, params: [] });
  }
}

export class ValidatorIsUUID implements Importable {
  name = 'IsUUID';
  module = 'class-validator';
  dependency = [];

  constructor(readonly version: '1' | '2' | '3' | '4' | '5' = '4') {}

  code(): string {
    return decoratorTemplate({
      name: this.name,
      params: [`'${this.version}'`],
    });
  }
}

export class ValidatorIsOptional implements Importable {
  name = 'IsOptional';
  module = 'class-validator';
  dependency = [];

  code(): string {
    return decoratorTemplate({ name: this.name, params: [] });
  }
}
