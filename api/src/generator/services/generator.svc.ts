import { Injectable } from '@nestjs/common';
import { SchemaService } from 'src/schema/services';
import { Schema } from 'src/schema/entities';
import {
  FolderStructure,
  Importable,
  ImportableTypes,
  externalModules,
} from '../entities/dependency';
import { Module } from '../entities/module/module';
import { Case } from 'change-case-all';
import { FileService } from './file.service';
import {
  fileTemplate,
  importTemplate,
} from '../entities/dependency/common.templates';
import { App } from '../entities/module/app-module';

@Injectable()
export class CodeGeneratorService {
  constructor(
    private schemaService: SchemaService,
    private fileService: FileService,
  ) {}

  async generate(schemas: Schema[]): Promise<string> {
    const modules = this.createModules(schemas);

    const importables = [
      ...modules,

      ...modules.flatMap((module) => {
        return [
          ...module.entities,
          ...module.providers,
          ...module.controllers,
          ...module.dtos,
        ];
      }),
    ];

    const workingDir = await this.fileService.createScaffoldDir();

    const folderTemplate = this.template(modules.map((m) => m.module));

    for (const importable of importables) {
      const path = this.resolvePath(importable, folderTemplate);

      const importStmts = importable.dependency.map((dependency) =>
        importTemplate({
          name: dependency.name,
          path: this.resolvePath(dependency, folderTemplate),
        }),
      );

      await this.fileService.createFile(
        workingDir,
        path,
        fileTemplate({
          imports: importStmts,
          content: importable.code(),
        }),
      );
    }

    return await this.fileService.archive(workingDir);
  }

  template(modules: string[]): FolderStructure {
    const structure: FolderStructure = {};

    for (const module of modules) {
      structure[Case.pascal(module)] = {
        Controller: `/src/${Case.kebab(module)}/controllers`,
        Service: `/src/${Case.kebab(module)}/services`,
        Entity: `/src/${Case.kebab(module)}/entities`,
        Dto: `/src/${Case.kebab(module)}/dto`,
        Module: `/src/${Case.kebab(module)}`,
      };
    }

    structure['App'] = {
      Controller: `/src/controllers`,
      Service: `/src/services`,
      Entity: `/src/entities`,
      Dto: `/src/dto`,
      Module: '/src',
    };

    console.log(structure);

    return structure;
  }

  resolvePath(importable: Importable, template: FolderStructure): string {
    if (externalModules.has(importable.module)) return importable.module;

    const module = template[importable.module];

    let type = importable.constructor.name as ImportableTypes;

    if (importable.constructor.name.endsWith('Dto')) type = 'Dto';
    if (importable.constructor.name.endsWith('App')) type = 'Module';

    return `${module[type]}/${Case.dot(importable.name)}`;
  }

  createModules(schema: Schema[]): Module[] {
    const modules = [
      ...schema.map((schema) => new Module(Case.pascal(schema.name), schema)),
      new App('App', {}),
    ];
    return modules;
  }
}
