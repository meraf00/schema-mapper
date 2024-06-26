import Handlebars from 'handlebars';

interface NameContext {
  name: string;
}

const repositoryName = '{{name}}Repository';
const serviceName = '{{name}}Service';

interface ServiceContext {
  name: string;

  entity: {
    name: string;
    primaryKey: string;
    primaryKeyType: string;
  };

  createDto: string;
  updateDto: string;

  repository: string;
}

const service = `@Injectable()
export class {{name}} {
    constructor(@InjectRepository({{entity.name}}) private readonly {{repository}}: Repository<{{entity.name}}>) {}

    async findAll(): Promise<{{entity.name}}[]> {
        return await this.{{repository}}.find();
    }

    async findOne({{entity.primaryKey}}: {{entity.primaryKeyType}}): Promise<{{entity.name}}> {
        return await this.{{repository}}.findOne({where: { {{entity.primaryKey}} }});
    }

    async create(data: {{createDto}}): Promise<{{entity.name}}> {
        const entity = this.{{repository}}.create(data);
        return await this.{{repository}}.save(entity);
    }

    async update({{entity.primaryKey}}: {{entity.primaryKeyType}}, data: {{updateDto}}): Promise<{{entity.name}}> {
        await this.{{repository}}.update({{entity.primaryKey}}, data);
        return await this.findOne({{entity.primaryKey}});
    }

    async delete({{entity.primaryKey}}: {{entity.primaryKeyType}}): Promise<void> {
        await this.{{repository}}.delete({{entity.primaryKey}});
    }
}`;

export const repositoryNameTemplate =
  Handlebars.compile<NameContext>(repositoryName);
export const serviceNameTemplate = Handlebars.compile<NameContext>(serviceName);
export const serviceTemplate = Handlebars.compile<ServiceContext>(service);
