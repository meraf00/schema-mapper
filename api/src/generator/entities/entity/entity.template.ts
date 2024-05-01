import Handlebars from 'handlebars';

interface EntityProps {
  name: string;
  attributes: string[];
}

const entity = `@Entity()
export class {{name}} {
    {{#each attributes}}
    {{this}}    
    {{/each}}    
}`;

export const entityTemplate = Handlebars.compile<EntityProps>(entity);
