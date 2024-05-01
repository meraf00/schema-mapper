import Handlebars from 'handlebars';

interface AttributeProps {
  decorators: string[];
  name: string;
  type: string;
}

const attribute = `{{#each decorators}}{{this}}{{/each}}
{{name}}: {{type}};
`;

export const attributeTemplate = Handlebars.compile<AttributeProps>(attribute);
