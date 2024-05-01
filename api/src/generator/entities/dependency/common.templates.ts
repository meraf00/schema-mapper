import Handlebars from 'handlebars';

interface DecoratorContext {
  name: string;
  params: string[];
}

const decorator = '@{{name}}({{#each params}}{{this}},{{/each}})';

export const decoratorTemplate =
  Handlebars.compile<DecoratorContext>(decorator);
