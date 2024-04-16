import { Module } from '@nestjs/common';
import { SchemaModule } from './schema/schema.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from './common/common.module';

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

    SchemaModule,

    CommonModule,
  ],
})
export class AppModule {}
