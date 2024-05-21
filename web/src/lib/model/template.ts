import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Schema } from './schema';
import { Case } from 'change-case-all';

export enum FileType {
  FOLDER = 'folder',
  FILE = 'file',
}

export enum InternalType {
  MODULE = 'module',
  CONTROLLER = 'controller',
  SERVICE = 'service',
  ENTITIES = 'entity',
  DTO = 'dto',
  NORMAL = 'normal',
}

export class GeneratedContent {
  constructor(
    public name: string,
    public module: string = ''
  ) {}

  get id() {
    return `${this.module}.${this.name}`;
  }
}

export class FileSystemNode {
  public readonly id: string;
  private _internalType: InternalType;

  constructor(
    public name: string,
    public type: FileType,
    public children: FileSystemNode[],
    public contents: GeneratedContent[] = [],
    internalType: InternalType = InternalType.NORMAL
  ) {
    this.id = uuidv4();

    if (type === FileType.FOLDER) {
      this._internalType = InternalType.NORMAL;
    } else {
      this._internalType = internalType;
    }
  }

  get internalType() {
    if (this.type === FileType.FOLDER) {
      const childrenType = new Set<InternalType>();

      for (const child of this.children) {
        if (child.type === FileType.FILE) {
          if (child.internalType === InternalType.MODULE)
            return InternalType.MODULE;
          else if (child.internalType !== InternalType.NORMAL) {
            childrenType.add(child.internalType);
          }
        }
      }
      const types = Array.from(childrenType);
      if (types.length != 1) return InternalType.NORMAL;
      return types[0];
    }

    return this._internalType;
  }

  set internalType(value: InternalType) {
    if (this.type === FileType.FOLDER)
      throw Error("Folder type can't be set directly");

    this._internalType = value;
  }
}

export class Template {
  constructor(
    readonly id: string,
    public schemas: Schema[],
    public structure: { [key: string]: string }
  ) {}
}

export const fileSystemNodeToJSON = (
  node: FileSystemNode
): [
  { [key: string]: { type: FileType; path: string } },
  { type: FileType; path: string }[],
] => {
  const pathMap = {} as { [key: string]: { type: FileType; path: string } };
  const paths = [] as { type: FileType; path: string }[];

  const traverse = (node: FileSystemNode, parentLocation: string): any => {
    const location = path.join(parentLocation, node.name);

    paths.push({
      type: node.type,
      path: location,
    });

    if (node.type === FileType.FOLDER) {
      node.children.forEach((child) => {
        traverse(child, location);
      });
    }

    for (const content of node.contents) {
      pathMap[content.id] = { type: node.type, path: location };
    }
  };

  traverse(node, '/');

  return [pathMap, paths];
};

export const _fileSystemNodeToJSON = (node: FileSystemNode): any => {
  const dynamicPathMap = {} as { [key: string]: string };
  const staticPathMap = {} as { [key: string]: string };

  const pathMap = {
    dynamic: dynamicPathMap,
    static: staticPathMap,
  };

  const traverse = (
    node: FileSystemNode,
    parentLocation: string,
    pathType: 'static' | 'dynamic'
  ): any => {
    let name = '';

    if (node.internalType === InternalType.NORMAL) {
      name = node.name;
    } else {
      name = `{{{${node.internalType}}}}`;
      pathType = 'dynamic';
    }

    const location = path.join(parentLocation, name);

    if (node.type === FileType.FOLDER) {
      node.children.forEach((child) => {
        traverse(child, location, pathType);
      });
    }

    pathMap[pathType][name] = location;
  };
  traverse(node, '/', 'static');

  return pathMap;
};

export const getGeneratedContents = (schemas: Schema[]) => {
  const contents: GeneratedContent[] = [
    new GeneratedContent('AppModule', 'App'),
  ];

  schemas.forEach((schema) => {
    const moduleName = Case.pascal(schema.name);

    contents.push(new GeneratedContent(moduleName + 'Module', moduleName));

    schema.tables.forEach((table) => {
      contents.push(
        new GeneratedContent(Case.pascal(table.name + 'Entity'), moduleName)
      );

      if (table.isAggregate) {
        contents.push(
          new GeneratedContent(
            Case.pascal('Create' + table.name + 'Dto'),
            moduleName
          ),
          new GeneratedContent(
            Case.pascal('Update' + table.name + 'Dto'),
            moduleName
          ),
          new GeneratedContent(Case.pascal(table.name + 'Service'), moduleName),
          new GeneratedContent(
            Case.pascal(table.name + 'Controller'),
            moduleName
          )
        );
      }
    });
  });

  return contents;
};
