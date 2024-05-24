import { Case } from 'change-case-all';
import { Importable } from '../dependency';
import { Table, mapAttributeType } from 'src/project/entities';
import { createDtoTemplate, updateDtoTemplate } from '../dto/dto.template';
import {
  controllerNameTemplate,
  controllerTemplate,
} from './controller.template';
import { serviceNameTemplate } from '../service/service.template';
import {
  NestBody,
  NestController,
  NestDelete,
  NestGet,
  NestNotFoundException,
  NestParam,
  NestParseIntPipe,
  NestParseUUIDPipe,
  NestPost,
  NestPut,
} from '../dependency/nestjs';
import { Service } from '../service/service';
import { CreateDto, UpdateDto } from '../dto/dto';

export class Controller implements Importable {
  name: string;
  dependency: Importable[] = [];

  constructor(
    readonly module: string,
    readonly table: Table,
  ) {
    this.name = controllerNameTemplate({ name: Case.pascal(this.table.name) });

    this.dependency.push(
      ...[
        new NestController(),
        new NestPost(),
        new NestGet(),
        new NestDelete(),
        new NestPut(),
        new NestBody(),
        new NestParam(),
        new NestNotFoundException(),

        new CreateDto(this.module, this.table),
        new UpdateDto(this.module, this.table),
        new Service(this.module, this.table),
      ],
    );

    const primaryAttribute = this.table.attributes.find(
      (attr) => attr.isPrimary,
    );

    const attribType = primaryAttribute
      ? mapAttributeType(primaryAttribute.type)
      : 'string';

    if (attribType === 'string') {
      this.dependency.push(new NestParseUUIDPipe());
    } else if (attribType == 'number') {
      this.dependency.push(new NestParseIntPipe());
    }
  }

  code(): string {
    const primaryAttribute = this.table.attributes.find(
      (attr) => attr.isPrimary,
    );

    const attribType = primaryAttribute
      ? mapAttributeType(primaryAttribute.type)
      : 'string';

    let pipe: Importable;

    if (attribType === 'string') {
      pipe = new NestParseUUIDPipe();
      this.dependency.push(pipe);
    } else if (attribType == 'number') {
      pipe = new NestParseIntPipe();
      this.dependency.push(pipe);
    }

    const serviceName = serviceNameTemplate({
      name: Case.camel(this.table.name),
    });

    const createDto = createDtoTemplate({ name: Case.pascal(this.table.name) });
    const updateDto = updateDtoTemplate({ name: Case.pascal(this.table.name) });

    return controllerTemplate({
      name: this.name,

      route: Case.kebab(this.table.name),

      entity: {
        name: Case.pascal(this.table.name),
        primaryKey: Case.camel(primaryAttribute.name),
        primaryKeyType: attribType,
        primaryKeyPipe: pipe?.code() || '',
      },

      service: Case.camel(serviceName),
      serviceClass: Case.pascal(serviceName),

      createDtoClass: createDto,
      updateDtoClass: updateDto,
    });
  }
}
