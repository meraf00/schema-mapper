import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export enum FileType {
  FOLDER = 'folder',
  FILE = 'file',
}

export enum InternalType {
  MODULE = 'module',
  CONTROLLER = 'controller',
  SERVICE = 'service',
  ENTITIES = 'entity',
  NORMAL = 'normal',
}

export class FileSystemNode {
  public readonly id: string;
  private _internalType: InternalType;

  constructor(
    public name: string,
    public type: FileType,
    public children: FileSystemNode[],
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
  id: string;

  name: string;

  description: string;

  content: string;

  constructor(id: string, name: string, description: string, content: string) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.content = content;
  }
}

export const fileSystemNodeToJSON = (node: FileSystemNode): any => {
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
