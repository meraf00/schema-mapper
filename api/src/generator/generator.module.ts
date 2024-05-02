import { Module } from '@nestjs/common';
import { GeneratorService } from './services/generator.service';
import { SchemaModule } from 'src/schema/schema.module';
import { GeneratorController } from './controllers/generator.controller';
import { BullModule } from '@nestjs/bull';
import { CODE_GENERATION } from './injectionKeys';
import { GeneratorWorker } from './services/generator.worker';
import { CodeGeneratorService } from './services/generator.svc';

@Module({
  imports: [
    SchemaModule,
    BullModule.registerQueue({
      name: CODE_GENERATION,
    }),
  ],
  controllers: [GeneratorController],
  providers: [GeneratorService, GeneratorWorker, CodeGeneratorService],
})
export class GeneratorModule {}
