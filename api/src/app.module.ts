// docker run -d --name redis-stack -p 6379:6379 -p 8001:8001 redis/redis-stack:latest
import { Module } from '@nestjs/common';
import { SchemaModule } from './schema/schema.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from './common/common.module';
import { GeneratorModule } from './generator/generator.module';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'root',
      database: 'schema_mapper',
      entities: [__dirname + '/**/*.entity{.ts}'],
      synchronize: true,
      autoLoadEntities: true,
    }),

    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),

    SchemaModule,

    CommonModule,

    GeneratorModule,
  ],
})
export class AppModule {}
