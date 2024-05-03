import { Case } from 'change-case-all';
import { Importable } from '../dependency';
import { moduleNameTemplate, moduleTemplate } from './module.template';
import { NestModule, NestTypeOrmModule } from '../dependency/nestjs';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Module } from './module';

export class App extends Module {
  name: string;
  dependency: Importable[] = [];

  constructor(
    public module: string,
    readonly options: TypeOrmModuleOptions,
  ) {
    super(module, null);

    this.name = moduleNameTemplate({ name: Case.pascal(this.module) });

    this.dependency.push(
      new NestTypeOrmModule({
        type: 'forRoot',
        options,
      }),
      new NestModule(),
    );
  }

  code(): string {
    return moduleTemplate({
      name: this.name,
      imports: [
        new NestTypeOrmModule({
          type: 'forRoot',
          options: this.options,
        }).code(),
      ],
      providers: [],
      controllers: [],
    });
  }
}
