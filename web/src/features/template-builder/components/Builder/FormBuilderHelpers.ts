import {
  GeneratedContent,
  FileSystemNode,
  FileType,
  InternalType,
} from '@/lib/model/template';

export const cloneTree = (file: FileSystemNode): FileSystemNode => {
  const children = file.children.map((child) => {
    if (child.type === FileType.FOLDER) {
      return cloneTree(child);
    }

    return new FileSystemNode(
      child.name,
      FileType.FILE,
      [],
      child.contents,
      child.internalType
    );
  });

  return new FileSystemNode(
    file.name,
    file.type,
    children,
    file.contents,
    file.internalType
  );
};

export const deleteNode = (
  file: FileSystemNode,
  nodeToDelete: FileSystemNode
): FileSystemNode => {
  const children = file.children
    .filter((child) => child.id !== nodeToDelete.id)
    .map((child) => {
      if (child.type === FileType.FOLDER) {
        return deleteNode(child, nodeToDelete);
      }

      return new FileSystemNode(
        child.name,
        FileType.FILE,
        child.children,
        child.contents,
        child.internalType
      );
    });

  return new FileSystemNode(
    file.name,
    file.type,
    children,
    file.contents,
    file.internalType
  );
};

export const findMappedGeneratedContents = (
  file: FileSystemNode,
  generated: GeneratedContent[]
): string[] => {
  if (file.type === FileType.FOLDER) {
    const generatedContent = new Set<string>();

    for (const child of file.children) {
      findMappedGeneratedContents(child, generated).forEach(
        (gid) => generatedContent.add(gid),
        generated
      );
    }

    return Array.from(generatedContent);
  }

  return file.contents.map((g) => g.id);
};

export const findUnmappedGeneratedContents = (
  file: FileSystemNode,
  generated: GeneratedContent[]
): GeneratedContent[] => {
  const used = findMappedGeneratedContents(file, generated);

  return generated.filter((g) => !used.includes(g.id));
};
