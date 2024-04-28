export interface IImportable {
  name: string;
  path: string;
  getCode(): string;
}

export interface ICodeFile {
  location: string;
  imports: IImportable[];
  exports: string[];
  getCode(): string;
}

export interface ICodeFolder {
  getFiles(): ICodeFile[];
}
