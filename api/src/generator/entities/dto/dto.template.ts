interface NameContext {
  name: string;
}

const create = 'Create{{name}}Dto';
const update = 'Update{{name}}Dto';

export const createDtoTemplate = Handlebars.compile<NameContext>(create);
export const updateDtoTemplate = Handlebars.compile<NameContext>(update);
