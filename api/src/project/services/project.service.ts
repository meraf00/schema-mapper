import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from '../entities/project.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { CreateProjectDto, UpdateProjectDto } from '../dto/request.dto';
import { PostgresErrorCodes } from '../exceptions/exceptions';
import { Case } from 'change-case-all';
import { randomUUID } from 'crypto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    let project = this.projectRepository.create({
      name: createProjectDto.name,
      stub: Case.kebab(createProjectDto.name),
    });

    let retries = 0;

    do {
      try {
        return this.projectRepository.save(project);
      } catch (err) {
        if (err instanceof QueryFailedError) {
          if ((err as any).code !== PostgresErrorCodes.unique_violation) {
            throw err;
          }

          // retry with other id
          project = this.projectRepository.create({
            name: createProjectDto.name,
            stub: Case.kebab(createProjectDto.name + '-' + randomUUID()),
          });

          retries++;
        }
      }
    } while (retries < Number(process.env.MAX_INSERT_RETRIES));

    throw { message: 'create_project_failed' };
  }

  async findAll(): Promise<Project[]> {
    return this.projectRepository.find({
      relations: { schemas: true },
    });
  }

  async findOne(stub: string): Promise<Project> {
    return this.projectRepository.findOne({
      where: { stub },
      relations: {
        schemas: true,
      },
    });
  }

  async update(
    stub: string,
    updateProjectDto: UpdateProjectDto,
  ): Promise<Project> {
    await this.projectRepository.update(stub, updateProjectDto);
    return { stub, ...updateProjectDto } as Project;
  }

  async delete(stub: string): Promise<void> {
    await this.projectRepository.delete(stub);
  }
}
