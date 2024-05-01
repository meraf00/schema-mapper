export interface Importable {
  name: string;
  module: string | null;
  dependency: Importable[];
  code: () => string;
}
