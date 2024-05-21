import { Injectable } from '@nestjs/common';
import { SchemaService } from 'src/schema/services';
import { Schema } from 'src/schema/entities';
import { Importable, externalModules } from '../entities/dependency';
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
import { GenerateCodeDto } from '../dto/request.dto';

@Injectable()
export class CodeGeneratorService {
  constructor(
    private schemaService: SchemaService,
    private fileService: FileService,
    @InjectQueue(CODE_GENERATION) private queue: Queue,
  ) {}

  async generate(
    schemas: Schema[],
    pathMap: { [key: string]: { type: string; path: string } },
  ): Promise<string> {
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

    const files: { [key: string]: Importable[] } = {};

    for (const importable of importables) {
      const path = this.resolvePath(importable, pathMap);
      files[path] = files[path] ? [...files[path], importable] : [importable];
    }

    for (const [path, importables] of Object.entries(files)) {
      const importStmts = new Set(
        importables.flatMap((importable) =>
          importable.dependency.map((dependency) => {
            const depPath = this.resolvePath(dependency, pathMap);

            if (depPath !== path)
              return importTemplate({
                name: dependency.name,
                path: depPath,
              });
            else return '';
          }),
        ),
      );

      await this.fileService.createFile(
        workingDir,
        path,
        fileTemplate({
          imports: Array.from(importStmts.values()),
          content: this.topologicalSort(importables, path, pathMap)
            .map((importable) => importable.code())
            .join('\n\n'),
        }),
      );
    }

    return await this.fileService.archive(workingDir);
  }

  private topologicalSort(
    importables: Importable[],
    filePath: string,
    pathMap: { [key: string]: { type: string; path: string } },
  ): Importable[] {
    const graph: { [key: string]: Importable[] } = {};

    for (const importable of importables) {
      if (!graph[importable.name]) graph[importable.name] = [];

      importable.dependency
        .filter((dep) => this.resolvePath(dep, pathMap) == filePath)
        .forEach((dep) => {
          if (graph[dep.name]) {
            graph[dep.name].push(importable);
          } else {
            graph[dep.name] = [importable];
          }
        });
    }

    const inDegree: { [key: string]: number } = {};

    for (const importable of importables) {
      inDegree[importable.name] = 0;
    }

    for (const importable of importables) {
      for (const dep of importable.dependency) {
        if (this.resolvePath(dep, pathMap) == filePath)
          inDegree[importable.name] += 1;
      }
    }

    const queue: Importable[] = [];

    for (const importable of importables) {
      if (inDegree[importable.name] == 0) {
        queue.push(importable);
      }
    }

    const sorted = [];

    while (queue.length) {
      const importable = queue.shift();
      sorted.push(importable);

      console.log(importable.name);

      for (const node of graph[importable.name]) {
        if (this.resolvePath(node, pathMap) == filePath) {
          inDegree[node.name] -= 1;
          if (inDegree[node.name] == 0) {
            queue.push(node);
          }
        }
      }
    }

    return sorted;
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

  async enqueueJob(generateCodeDto: GenerateCodeDto) {
    const schemas = await Promise.all(
      generateCodeDto.schemas.map((schemaId) =>
        this.schemaService.findOne(schemaId),
      ),
    );

    const job = await this.queue.add({
      pathMap: generateCodeDto.pathMap,
      paths: generateCodeDto.paths,
      schemas,
    });

    return job;
  }

  private resolvePath(
    importable: Importable,
    pathMap: { [key: string]: { type: string; path: string } },
  ) {
    if (externalModules.has(importable.module)) return importable.module;
    return pathMap[`${importable.module}.${importable.name}`].path;
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
