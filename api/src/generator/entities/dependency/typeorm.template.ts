import Handlebars from 'handlebars';

interface RefTableContext {
  table: string;
}

interface BackRefContext {
  refTable: string;
  backRef: string;
}

const refTable = '() => {{table}}';

const backRef = '({{refTable}}) => ({{refTable}}.{{backRef}})';

export const refTableTemplate = Handlebars.compile<RefTableContext>(refTable);
export const backRefTemplate = Handlebars.compile<BackRefContext>(backRef);
