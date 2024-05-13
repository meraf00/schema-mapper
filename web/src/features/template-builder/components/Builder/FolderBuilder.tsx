'use client';

import { Button, Modal, Tabs } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import React, { useMemo, useState } from 'react';
import FolderForm, { FolderFormData } from '../Forms/FolderForm';
import { FileSystemNode, FileType, InternalType } from '@/lib/model/template';
import { drawFolder } from './FolderHierarchy';
import {
  cloneTree,
  deleteNode,
  findUnusedInternalTypes,
} from './FormBuilderHelpers';

export interface FolderBuilderProps {
  defaultHierarchy: FileSystemNode;
  onChange?: (hierarchy: FileSystemNode) => void;
}

export default function FolderBuilder({
  defaultHierarchy,
  onChange,
}: FolderBuilderProps) {
  const [hierarchy, setHierarchy] = useState<FileSystemNode>(defaultHierarchy);

  const [opened, { open, close }] = useDisclosure(false);
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

    setHierarchy((hierarchy) => {
      const newHierarchy = cloneTree(hierarchy);
      onChange && onChange(newHierarchy);
      return newHierarchy;
    });

    close();
  };

  const handleDelete = (folder: FileSystemNode) => {
    setHierarchy((hierarchy) => {
      const newHierarchy = deleteNode(hierarchy, folder);
      onChange && onChange(newHierarchy);
      return newHierarchy;
    });
    close();
  };

  const handleCreate = (
    folder: FileSystemNode,
    formResponse: FolderFormData
  ) => {
    folder.children.push(
      new FileSystemNode(
        formResponse.name,
        formResponse.type,
        [],
        formResponse.internalType
      )
    );

    setHierarchy((hierarchy) => {
      const newHierarchy = cloneTree(hierarchy);
      onChange && onChange(newHierarchy);
      return newHierarchy;
    });
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
