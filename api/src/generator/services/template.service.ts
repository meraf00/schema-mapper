import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Template } from '../entities/template.entity';
import { CreateTemplateDto, UpdateTemplateDto } from '../dto/request.dto';

@Injectable()
export class TemplateService {
  constructor(
    @InjectRepository(Template)
    private templateRepository: Repository<Template>,
  ) {}

  async create(createTemplateDto: CreateTemplateDto): Promise<Template> {
    const template = this.templateRepository.create(createTemplateDto);
    return this.templateRepository.save(template);
  }

  async findAll(): Promise<Template[]> {
    return this.templateRepository.find();
  }

  async findOne(id: string): Promise<Template> {
    return this.templateRepository.findOne({
      where: { id },
    });
  }

  async update(
    id: string,
    updateTemplateDto: UpdateTemplateDto,
  ): Promise<Template> {
    await this.templateRepository.update(id, updateTemplateDto);
    return { id, ...updateTemplateDto } as Template;
  }

  async delete(id: string): Promise<void> {
    await this.templateRepository.delete(id);
  }

  async reset(): Promise<void> {
    await this.templateRepository.delete({});
    await this.populateDefaultTemplates();
  }

  async populateDefaultTemplates(): Promise<void> {
    const templateOne = this.templateRepository.create({
      name: 'Module Folder',
      description: 'Everything contained in module folder',
      content: `
            {{#each modules}}
            {{{this}}}: {
              Controller: '/src/{{{this}}}/controllers',
              Service: '/src/{{{this}}}/services',
              Entity: '/src/{{{this}}}/entities',
              Dto: '/src/{{{this}}}/dto',
              Module: '/src/{{{this}}}',
            },
            {{/each}}
    
            App: {
              Controller: '/src/controllers',
              Service: '/src/services',
              Entity: '/src/entities',
              Dto: '/src/dto',
              Module: 'src',
            }
            `,
    });

    const templateTwo = this.templateRepository.create({
      name: 'Entity Outside',
      description: 'Entities are outside of module folder',
      content: `
            {{#each modules}}
            {{{this}}}: {
              Controller: '/src/{{{this}}}/controllers',
              Service: '/src/{{{this}}}/services',
              Entity: '/src/entities/{{{this}}}',
              Dto: '/src/{{{this}}}/dto',
              Module: '/src/{{{this}}}',
            },
            {{/each}}
    
            App: {
              Controller: '/src/controllers',
              Service: '/src/services',
              Entity: '/src/entities',
              Dto: '/src/dto',
              Module: 'src',
            }
            `,
    });

    await this.templateRepository.save([templateOne, templateTwo]);
  }
}
