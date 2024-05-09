import { Node } from '@/components/Node';
import { FileSystemNode, FileType, InternalType } from '@/lib/model/template';
import {
  IconCrane,
  IconFolder,
  IconManualGearbox,
  IconServer,
} from '@tabler/icons-react';

export const drawFolder = (
  file: FileSystemNode,
  handleRightClick: (e: any, folder: FileSystemNode) => void
) => {
  const icons = {
    [InternalType.MODULE]: <IconFolder size={16} color="red" />,
    [InternalType.CONTROLLER]: <IconServer size={16} color="green" />,
    [InternalType.SERVICE]: <IconManualGearbox size={16} color="lightblue" />,
    [InternalType.ENTITIES]: <IconCrane size={16} color="blue" />,
    [InternalType.NORMAL]: <></>,
  } as {
    [key: string]: React.ReactNode;
  };

  return (
    <Node
      key={file.id}
      title={
        <span className="flex gap-2">
          {icons[file.internalType]}
          {file.name}
        </span>
      }
      isClosed={false}
      onContextMenu={(e) => handleRightClick(e, file)}
    >
      {file.children.map((child) => {
        if (child.type === FileType.FOLDER) {
          return drawFolder(child, handleRightClick);
        }

        return (
          <Node
            key={child.id}
            title={
              <span className="flex gap-2">
                {icons[file.internalType]}
                {child.name}
              </span>
            }
            onContextMenu={(e) => handleRightClick(e, child)}
          />
        );
      })}
    </Node>
  );
};
