import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ProjectService } from '../services/project.service';
import { CreateProjectDto, UpdateProjectDto } from '../dto/request.dto';
import { ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('projects')
@Controller('projects')
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  @Post()
  async create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectService.create(createProjectDto);
  }

  @Get()
  async findAll() {
    return this.projectService.findAll();
  }

  @ApiParam({
    name: 'stub',
    type: String,
    required: true,
    description: 'Project stub',
  })
  @Get(':stub')
  async findOne(@Param('stub') stub: string) {
    try {
      return await this.projectService.findOne(stub);
    } catch (e) {
      throw new NotFoundException(e.message);
    }
  }

  @ApiParam({
    name: 'stub',
    type: String,
    required: true,
    description: 'Project stub',
  })
  @Put(':stub')
  async update(
    @Param('stub') stub: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    try {
      return await this.projectService.update(stub, updateProjectDto);
    } catch (e) {
      throw new NotFoundException(e.message);
    }
  }

  @ApiParam({
    name: 'stub',
    type: String,
    required: true,
    description: 'Project stub',
  })
  @Delete(':stub')
  async delete(@Param('stub') stub: string) {
    try {
      return await this.projectService.delete(stub);
    } catch (e) {
      throw new NotFoundException(e.message);
    }
  }
}
