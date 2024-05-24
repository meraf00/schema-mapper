import Handlebars from 'handlebars';

interface NameContext {
  name: string;
}

const controllerName = '{{name}}Controller';

interface ControllerContext {
  name: string;

  route: string;

  entity: {
    name: string;
    primaryKey: string;
    primaryKeyType: string;
    primaryKeyPipe: string;
  };

  service: string;
  serviceClass: string;

  createDtoClass: string;
  updateDtoClass: string;
}

const controller = `@Controller('/{{route}}s')
  export class {{name}} {
  
      constructor(private readonly {{service}}: {{serviceClass}}) {}
  
      @Post()
      async create(@Body() dto: {{createDtoClass}}) {
          return await this.{{service}}.create(dto);
      }
  
      @Get()
      async findAll() {
          return await this.{{service}}.findAll();
      }
  
      @Get(':{{entity.primaryKey}}')
      async findOne(@Param('{{{entity.primaryKey}}}', {{entity.primaryKeyPipe}}) {{{entity.primaryKey}}}: {{entity.primaryKeyType}}) {
          try {
              return await this.{{service}}.findOne({{{entity.primaryKey}}});
          } catch(e) {
              throw new NotFoundException(e.message);
          }
      }
  
      @Put(':{{{entity.primaryKey}}}')
      async update(@Param('{{{entity.primaryKey}}}', {{entity.primaryKeyPipe}}) {{{entity.primaryKey}}}: {{entity.primaryKeyType}}, @Body() dto: {{updateDtoClass}}) {
          try {
              return await this.{{service}}.update({{{entity.primaryKey}}}, dto);
          } catch(e) {
              throw new NotFoundException(e.message);
          }
      }
  
      @Delete(':{{{entity.primaryKey}}}')
      async delete(@Param('{{{entity.primaryKey}}}', {{entity.primaryKeyPipe}}) {{{entity.primaryKey}}}: {{entity.primaryKeyType}}) {
          try {
              return await this.{{service}}.delete({{{entity.primaryKey}}});
          } catch(e) {
              throw new NotFoundException(e.message);
          }
      }
  
  }`;

export const controllerNameTemplate = Handlebars.compile<NameContext>(
  controllerName,
  { noEscape: true },
);
export const controllerTemplate = Handlebars.compile<ControllerContext>(
  controller,
  { noEscape: true },
);
