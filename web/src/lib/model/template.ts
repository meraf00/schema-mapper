import { v4 as uuidv4 } from 'uuid';

export enum FileType {
  FOLDER = 'folder',
  FILE = 'file',
}

export enum InternalType {
  MODULE = 'module',
  CONTROLLER = 'controller',
  SERVICE = 'service',
  ENTITIES = 'entities',
  NORMAL = 'normal',
}

export class FileSystemNode {
  public readonly id: string;

  constructor(
    public name: string,
    public type: FileType,
    public children: FileSystemNode[],
    public internalType: InternalType = InternalType.NORMAL
  ) {
    this.id = uuidv4();
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
