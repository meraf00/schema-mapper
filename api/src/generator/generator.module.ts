import { Module } from '@nestjs/common';
import { GeneratorService } from './services/generator.service';
import { SchemaModule } from 'src/schema/schema.module';
import { GeneratorController } from './controllers/generator.controller';
import { BullModule } from '@nestjs/bull';
import { CODE_GENERATION } from './injectionKeys';
import { GeneratorWorker } from './services/generator.worker';

@Module({
  imports: [
    SchemaModule,
    BullModule.registerQueue({
      name: CODE_GENERATION,
    }),
  ],
  providers: [GeneratorService, GeneratorWorker],
  controllers: [GeneratorController],
})
export class GeneratorModule {}
