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

const controller = `@Controller('{{route}}')
  export class {{name}} {
  
      constructor(private readonly {{service}}: {{serviceClass}}) {}
  
      @Post('{{entity.primaryKey}}')
      async create(@Body() dto: {{createDtoClass}}) {
          return await this.{{service}}.create(dto);
      }
  
      @Get()
      async findAll() {
          return await this.{{service}}.findAll();
      }
  
      @Get('{{primaryKey}}')
      async findOne(@Param('{{primaryKey}}', {{primaryKeyPipe}}) {{primaryKey}}: {{primaryKeyType}}) {
          try {
              return await this.{{service}}.findOne({{primaryKey}});
          } catch(e) {
              throw new NotFoundException(e.message);
          }
      }
  
      @Put('{{primaryKey}}')
      async update(@Param('{{primaryKey}}', {{primaryKeyPipe}}) {{primaryKey}}: {{primaryKeyType}}, @Body() dto: {{updateDtoClass}}) {
          try {
              return await this.{{service}}.update({{primaryKey}}, dto);
          } catch(e) {
              throw new NotFoundException(e.message);
          }
      }
  
      @Delete('{{primaryKey}}')
      async delete(@Param('{{primaryKey}}', {{primaryKeyPipe}}) {{primaryKey}}: {{primaryKeyType}}) {
          try {
              return await this.{{service}}.delete({{primaryKey}});
          } catch(e) {
              throw new NotFoundException(e.message);
          }
      }
  
  }`;

export const controllerNameTemplate =
  Handlebars.compile<NameContext>(controllerName);
export const controllerTemplate =
  Handlebars.compile<ControllerContext>(controller);
