'use client';

import { Button, Modal, Tabs } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import React, { useMemo, useState } from 'react';
import FolderForm, { FolderFormData } from '../Forms/FolderForm';
import { FileSystemNode, FileType, InternalType } from '@/lib/model/template';
import { drawFolder } from './FolderHierarchy';

const cloneTree = (file: FileSystemNode): FileSystemNode => {
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

const deleteNode = (
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

const findUsedInternalTypes = (file: FileSystemNode): InternalType[] => {
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

const findUnusedInternalTypes = (file: FileSystemNode): InternalType[] => {
  const used = findUsedInternalTypes(file);
  return Object.values(InternalType).filter((t) => !used.includes(t));
};

export default function FolderBuilder() {
  const [hierarchy, setHierarchy] = useState<FileSystemNode>(
    new FileSystemNode('src', FileType.FOLDER, [
      new FileSystemNode('app.module.ts', FileType.FILE, []),
      new FileSystemNode(
        'app.component.ts',
        FileType.FILE,
        [],
        InternalType.NORMAL
      ),
      new FileSystemNode(
        'entities',
        FileType.FOLDER,
        [],
        InternalType.ENTITIES
      ),
      new FileSystemNode(
        'module',
        FileType.FOLDER,
        [
          new FileSystemNode(
            'controller',
            FileType.FOLDER,
            [],
            InternalType.CONTROLLER
          ),
          new FileSystemNode(
            'service',
            FileType.FOLDER,
            [],
            InternalType.SERVICE
          ),
        ],
        InternalType.MODULE
      ),
    ])
  );

  const [opened, { open, close }] = useDisclosure(true);
  const [folder, setFolder] = useState<FileSystemNode>(hierarchy);
  const allowedInternalTypes = useMemo<InternalType[]>(
    () => findUnusedInternalTypes(hierarchy),
    [hierarchy]
  );

  const [activeTab, setActiveTab] = useState<string | null>('first');

  const handleRightClick = (e: any, folder: FileSystemNode) => {
    e.preventDefault();
    setFolder(folder);
    open();
  };

  const handleEdit = (folder: FileSystemNode, formResponse: FolderFormData) => {
    folder.name = formResponse.name;
    folder.type = formResponse.type;
    folder.internalType = formResponse.internalType;

    setHierarchy(cloneTree(hierarchy));
    close();
  };

  const handleDelete = (folder: FileSystemNode) => {
    setHierarchy(deleteNode(hierarchy, folder));
    close();
  };

  const handleCreate = (
    folder: FileSystemNode,
    formResponse: FolderFormData
  ) => {
    folder.children.push(
      new FileSystemNode(
        formResponse.name,
        FileType.FOLDER,
        [],
        formResponse.internalType
      )
    );
    setHierarchy(cloneTree(hierarchy));
    close();
  };

  let showDelete = true;

  if (
    folder === hierarchy || // if root folder
    (folder && folder.type === FileType.FOLDER && folder.children.length > 0) // if folder has children
  ) {
    showDelete = false;
  }

  return (
    <div className="bg-slate-50 bg-opacity-70 p-3">
      <Modal
        opened={opened}
        onClose={close}
        title="Menu"
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab value="first">Edit</Tabs.Tab>
            {folder.type === FileType.FOLDER && (
              <Tabs.Tab value="second">Create</Tabs.Tab>
            )}
          </Tabs.List>

          <Tabs.Panel value="first" className="mt-3">
            <div className="flex flex-col gap-5">
              <FolderForm
                file={folder}
                allowedInternalTypes={allowedInternalTypes}
                onSubmit={(formResponse) => {
                  handleEdit(folder, formResponse);
                }}
              />
              {showDelete && (
                <Button color="red" onClick={(e) => handleDelete(folder)}>
                  Delete
                </Button>
              )}
            </div>
          </Tabs.Panel>
          <Tabs.Panel value="second" className="mt-3">
            <FolderForm
              allowedInternalTypes={allowedInternalTypes}
              onSubmit={(formResponse) => {
                handleCreate(folder, formResponse);
              }}
            />
          </Tabs.Panel>
        </Tabs>
      </Modal>

      {drawFolder(hierarchy, handleRightClick)}
    </div>
  );
}
