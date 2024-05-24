import Handlebars from 'handlebars';

interface EntityNameContext {
  name: string;
}

interface EntityContext {
  name: string;
  attributes: string[];
}

const entityName = '{{{name}}}Entity';

const entity = `@Entity()
export class {{{name}}} {
    {{#each attributes}}
    {{{this}}}    
    {{/each}}    
}`;

export const entityNameTemplate =
  Handlebars.compile<EntityNameContext>(entityName);
export const entityTemplate = Handlebars.compile<EntityContext>(entity);
