import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import Handlebars from 'handlebars';

interface ForRootContext {
  options: TypeOrmModuleOptions;
}

const typeormForRoot = `TypeOrmModule.forRoot({
    {{#each options}}
    {{{@key}}}:{{{this}}}
    {{/each}}
})`;

interface ForFeatureContext {
  entities: string[];
}

const typeormForFeature = `TypeOrmModule.forFeature([
    {{#each entities}}
    {{{this}}},
    {{/each}}
])`;

export const forRootTemplate =
  Handlebars.compile<ForRootContext>(typeormForRoot);
export const forFeatureTemplate =
  Handlebars.compile<ForFeatureContext>(typeormForFeature);
