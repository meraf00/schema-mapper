import Handlebars from 'handlebars';

interface AttributeProps {
  decorators: string[];
  name: string;
  type: string;
}

const attribute = `{{#each decorators}}{{{this}}}{{/each}}
{{{name}}}: {{{type}}};
`;

const backrefOneToOne = `{{#each decorators}}{{{this}}}{{/each}}
{{{name}}}: {{{type}}};
`;

const backrefOneToMany = `{{#each decorators}}{{{this}}}{{/each}}
{{{name}}}: {{{type}}}[];
`;

export const attributeTemplate = Handlebars.compile<AttributeProps>(attribute);

export const backrefOneToOneTemplate =
  Handlebars.compile<AttributeProps>(backrefOneToOne);

export const backrefOneToManyTemplate =
  Handlebars.compile<AttributeProps>(backrefOneToMany);
