import { Module } from '@nestjs/common';

import { SchemaModule } from 'src/schema/schema.module';
import { GeneratorController } from './controllers/generator.controller';
import { BullModule } from '@nestjs/bull';
import { CODE_GENERATION } from './injectionKeys';
import { GeneratorWorker } from './services/generator.worker';
import { CodeGeneratorService } from './services/generator.service';
import { FileService } from './services/file.service';
import { GeneratorGateway } from './controllers/generator.gateway';

@Module({
  imports: [
    SchemaModule,
    BullModule.registerQueue({
      name: CODE_GENERATION,
    }),
  ],
  controllers: [GeneratorController],
  providers: [
    GeneratorWorker,
    CodeGeneratorService,
    FileService,
    GeneratorGateway,
  ],
})
export class GeneratorModule {}
