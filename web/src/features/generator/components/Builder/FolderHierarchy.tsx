import { Node } from '@/components/Node';
import {
  FileSystemNode,
  FileType,
  GeneratedContent,
  InternalType,
} from '@/lib/model/template';
import {
  IconCrane,
  IconFolder,
  IconMail,
  IconMan,
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
    [InternalType.ENTITIES]: <IconMan size={16} color="blue" />,
    [InternalType.DTO]: <IconMail size={16} color="orange" />,
    [InternalType.NORMAL]: <></>,
  } as {
    [key: string]: React.ReactNode;
  };

  const getIcon = (content: GeneratedContent) => {
    if (content.name.endsWith('Module')) return icons[InternalType.MODULE];
    if (content.name.endsWith('Controller'))
      return icons[InternalType.CONTROLLER];
    if (content.name.endsWith('Service')) return icons[InternalType.SERVICE];
    if (content.name.endsWith('Entity')) return icons[InternalType.ENTITIES];
    if (content.name.endsWith('Dto')) return icons[InternalType.DTO];
    return icons[InternalType.NORMAL];
  };

  return (
    <Node
      key={file.id}
      title={<span className="flex gap-2">{file.name}</span>}
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
                {child.contents.length ? getIcon(child.contents[0]) : ''}
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
