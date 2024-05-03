export interface Importable {
  name: string;
  module: string | null;
  dependency: Importable[];
  code: () => string;
}

export type ImportableTypes =
  | 'Controller'
  | 'Service'
  | 'Entity'
  | 'Dto'
  | 'Module';

export interface FolderStructure {
  // module: {
  //   Controller: '/src/{module}/controllers',
  //   Service: '/src/{module}/controllers',
  //   Entity: '/src/{module}/entities',
  //   Dto: '/src/{module}/dto',
  //   Module: '/src/{module}',
  // },
  [key: string]: {
    [key in ImportableTypes]: string;
  };
}
