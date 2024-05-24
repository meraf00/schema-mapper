import Handlebars from 'handlebars';

interface DecoratorContext {
  name: string;
  params: string[];
}

const decorator = '@{{name}}({{#each params}}{{{this}}},{{/each}})';

interface ImportContext {
  name: string;
  path: string;
}

const importStmt = `import { {{name}} } from '{{stripImport path}}';`;

interface FileContext {
  imports: string[];
  content: string;
}

const file = `{{#each imports}}{{{this}}}
{{/each}}


{{{content}}}`;

export const decoratorTemplate =
  Handlebars.compile<DecoratorContext>(decorator);

export const importTemplate = Handlebars.compile<ImportContext>(importStmt);

export const fileTemplate = Handlebars.compile<FileContext>(file);

Handlebars.registerHelper('stripImport', (path: string) => {
  if (path.endsWith('.ts')) path = path.slice(0, -3);
  if (path.startsWith('/')) path = path.slice(1);
  return path;
});
