import Handlebars from 'handlebars';

interface EntityContext {
  name: string;
  attributes: string[];
}

const entity = `@Entity()
export class {{name}} {
    {{#each attributes}}
    {{this}}    
    {{/each}}    
}`;

export const entityTemplate = Handlebars.compile<EntityContext>(entity);
