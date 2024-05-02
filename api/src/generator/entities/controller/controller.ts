import { Case } from 'change-case-all';
import { Importable } from '../dependency';
import { Table, mapAttributeType } from 'src/schema/entities';
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
  NestParam,
  NestParseIntPipe,
  NestParseUUIDPipe,
  NestPost,
  NestPut,
} from '../dependency/nestjs';

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

        {
          name: createDtoTemplate({ name: Case.pascal(this.table.name) }),
          module: this.module,
        } as Importable,

        {
          name: updateDtoTemplate({ name: Case.pascal(this.table.name) }),
          module: this.module,
        } as Importable,

        {
          name: serviceNameTemplate({ name: Case.pascal(this.table.name) }),
          module: this.module,
        } as Importable,
      ],
    );
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
