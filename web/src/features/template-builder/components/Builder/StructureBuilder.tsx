'use client';

import { Button, Modal, Tabs } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import React, { useEffect, useMemo, useState } from 'react';
import NodeForm, { NodeFormData } from '../Forms/NodeForm';
import {
  GeneratedContent,
  FileSystemNode,
  FileType,
  fileSystemNodeToJSON,
  Template,
} from '@/lib/model/template';
import { drawFolder } from './FolderHierarchy';
import {
  cloneTree,
  deleteNode,
  findUnmappedGeneratedContents,
} from './FormBuilderHelpers';
import { CodeHighlight } from '@mantine/code-highlight';
import * as prettier from 'prettier';
import parserBabel from 'prettier/plugins/babel';
import * as prettierPluginEstree from 'prettier/plugins/estree';

export interface FolderBuilderProps {
  generated: GeneratedContent[];
  template?: Template;
  onChange?: (structure: { [key: string]: string }) => void;
}

export default function FolderBuilder({
  generated,
  onChange,
}: FolderBuilderProps) {
  const [hierarchy, setHierarchy] = useState<FileSystemNode>(
    new FileSystemNode('src', FileType.FOLDER, [])
  );

  const [opened, { open, close }] = useDisclosure(false);
  const [node, setNode] = useState<FileSystemNode>(hierarchy);
  const contents = useMemo<GeneratedContent[]>(
    () => findUnmappedGeneratedContents(hierarchy, generated),
    [hierarchy, generated]
  );

  const [activeTab, setActiveTab] = useState<string | null>('first');
  const [code, setCode] = useState<string>('');

  useEffect(() => {
    const content = JSON.stringify(fileSystemNodeToJSON(hierarchy), null, 2);
    const fn = async () => {
      try {
        const formatted = await prettier.format(content, {
          parser: 'json',
          plugins: [parserBabel, prettierPluginEstree],
        });

        setCode(formatted);
      } catch (e) {
        setCode(content);
      }
    };

    fn();
  }, [hierarchy]);

  const handleRightClick = (e: any, node: FileSystemNode) => {
    e.preventDefault();
    setNode(node);
    open();
  };

  const handleEdit = (node: FileSystemNode, formResponse: NodeFormData) => {
    node.name = formResponse.name;
    node.type = formResponse.type;
    node.contents = formResponse.contents.map(
      (name) => new GeneratedContent(name)
    );

    setHierarchy((hierarchy) => {
      const newHierarchy = cloneTree(hierarchy);
      return newHierarchy;
    });

    close();
  };

  const handleDelete = (node: FileSystemNode) => {
    setHierarchy((hierarchy) => {
      const newHierarchy = deleteNode(hierarchy, node);
      return newHierarchy;
    });
    close();
  };

  const handleCreate = (node: FileSystemNode, formResponse: NodeFormData) => {
    node.children.push(
      new FileSystemNode(
        formResponse.name,
        formResponse.type,
        [],
        formResponse.contents.map((name) => new GeneratedContent(name))
      )
    );

    setHierarchy((hierarchy) => {
      const newHierarchy = cloneTree(hierarchy);
      return newHierarchy;
    });
    close();
  };

  let showDelete = true;

  if (
    node === hierarchy || // if root folder
    (node && node.type === FileType.FOLDER && node.children.length > 0) // if folder has children
  ) {
    showDelete = false;
  }

  return (
    <div className="flex gap-3 w-full">
      <div className="flex flex-col gap-3 w-1/2">
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
                {node.type === FileType.FOLDER && (
                  <Tabs.Tab value="second">Create</Tabs.Tab>
                )}
              </Tabs.List>

              <Tabs.Panel value="first" className="mt-3">
                <div className="flex flex-col gap-5">
                  <NodeForm
                    node={node}
                    defaultContents={contents}
                    onSubmit={(formResponse) => {
                      handleEdit(node, formResponse);
                    }}
                  />
                  {showDelete && (
                    <Button color="red" onClick={(e) => handleDelete(node)}>
                      Delete
                    </Button>
                  )}
                </div>
              </Tabs.Panel>
              <Tabs.Panel value="second" className="mt-3">
                <NodeForm
                  defaultContents={contents}
                  onSubmit={(formResponse) => {
                    handleCreate(node, formResponse);
                  }}
                />
              </Tabs.Panel>
            </Tabs>
          </Modal>

          {drawFolder(hierarchy, handleRightClick)}
        </div>
      </div>

      <div className="flex w-1/2">
        <CodeHighlight
          className="w-full"
          code={code}
          language="json"
          withCopyButton={false}
        />
      </div>
    </div>
  );
}
