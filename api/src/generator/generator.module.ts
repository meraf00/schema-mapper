import { Module } from '@nestjs/common';

import { ProjectModule } from 'src/project/project.module';
import { GeneratorController } from './controllers/generator.controller';
import { BullModule } from '@nestjs/bull';
import { CODE_GENERATION } from './injectionKeys';
import { GeneratorWorker } from './services/generator.worker';
import { CodeGeneratorService } from './services/generator.service';
import { FileService } from './services/file.service';
import { GeneratorGateway } from './controllers/generator.gateway';
import { TemplateService } from './services/template.service';
import { TemplateController } from './controllers/template.controller';
import { Template } from './entities/template.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Template]),
    ProjectModule,
    BullModule.registerQueue({
      name: CODE_GENERATION,
    }),
  ],
  controllers: [GeneratorController, TemplateController],
  providers: [
    GeneratorWorker,
    CodeGeneratorService,
    FileService,
    GeneratorGateway,
    TemplateService,
  ],
})
export class GeneratorModule {}
