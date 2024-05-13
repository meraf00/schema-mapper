import { FileSystemNode, FileType, InternalType } from '@/lib/model/template';

export const cloneTree = (file: FileSystemNode): FileSystemNode => {
  const children = file.children.map((child) => {
    if (child.type === FileType.FOLDER) {
      return cloneTree(child);
    }

    return new FileSystemNode(
      child.name,
      FileType.FILE,
      [],
      child.internalType
    );
  });

  return new FileSystemNode(file.name, file.type, children, file.internalType);
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
        [],
        child.internalType
      );
    });

  return new FileSystemNode(file.name, file.type, children, file.internalType);
};

export const findUsedInternalTypes = (file: FileSystemNode): InternalType[] => {
  if (file.type === FileType.FOLDER) {
    const types = new Set<InternalType>([file.internalType]);

    for (const child of file.children) {
      findUsedInternalTypes(child).forEach((type) => types.add(type));
    }

    types.delete(InternalType.NORMAL);

    return Array.from(types);
  }

  if (file.internalType === InternalType.NORMAL) {
    return [];
  }
  return [file.internalType];
};

export const findUnusedInternalTypes = (
  file: FileSystemNode
): InternalType[] => {
  const used = findUsedInternalTypes(file);
  return Object.values(InternalType).filter((t) => !used.includes(t));
};
