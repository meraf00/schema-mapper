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
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { CODE_GENERATION } from '../injectionKeys';

@Injectable()
export class CodeGeneratorService {
  constructor(
    private schemaService: SchemaService,
    private fileService: FileService,
    @InjectQueue(CODE_GENERATION) private queue: Queue,
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

    const folderStructrue = this.template(modules.map((m) => m.module));

    for (const importable of importables) {
      const path = this.resolvePath(importable, folderStructrue);

      const importStmts = new Set(
        importable.dependency.map((dependency) =>
          importTemplate({
            name: dependency.name,
            path: this.resolvePath(dependency, folderStructrue),
          }),
        ),
      );

      await this.fileService.createFile(
        workingDir,
        path,
        fileTemplate({
          imports: Array.from(importStmts.values()),
          content: importable.code(),
        }),
      );
    }

    return await this.fileService.archive(workingDir);
  }

  async getRedisStatus() {
    return this.queue.client.status;
  }

  async getJobs() {
    return await this.queue.getJobs([
      'waiting',
      'active',
      'completed',
      'failed',
      'delayed',
    ]);
  }

  async getJob(jobId: string) {
    return await this.queue.getJob(jobId);
  }

  async enqueueJob(generateCodeDto: { schemas: string[] }) {
    const schemas = await Promise.all(
      generateCodeDto.schemas.map((schemaId) =>
        this.schemaService.findOne(schemaId),
      ),
    );

    console.log(schemas);

    const job = await this.queue.add(schemas);

    return job;
  }

  private template(modules: string[]): FolderStructure {
    const structure: FolderStructure = {};

    for (const module of modules) {
      structure[Case.pascal(module)] = {
        Controller: `/src/${Case.kebab(module)}/controllers`,
        Service: `/src/${Case.kebab(module)}/services`,
        Entity: `/src/entities/${Case.kebab(module)}`,
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

    return structure;
  }

  private resolvePath(
    importable: Importable,
    template: FolderStructure,
  ): string {
    if (externalModules.has(importable.module)) return importable.module;

    const module = template[importable.module];

    let type = importable.constructor.name as ImportableTypes;

    if (importable.constructor.name.endsWith('Dto')) type = 'Dto';
    if (importable.constructor.name.endsWith('App')) type = 'Module';

    return `${module[type]}/${Case.dot(importable.name)}`;
  }

  private createModules(schemas: Schema[]): Module[] {
    const modules = [
      ...schemas.map((schema) => new Module(Case.pascal(schema.name), schema)),
      new App('App', schemas, {
        type: "'postgres'" as 'postgres',
        host: "'localhost'",
        port: 5432,
        username: "'postgres'",
        password: "''",
        database: "'database_name'",
        entities: ['[__dirname + "/**/*.entity{.ts}"]'],
        synchronize: true,
        autoLoadEntities: true,
      }),
    ];

    return modules;
  }
}
