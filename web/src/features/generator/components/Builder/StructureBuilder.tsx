'use client';

import { Button, Modal, Spoiler, Tabs } from '@mantine/core';
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
import { IconCircle } from '@tabler/icons-react';

export interface StructureBuilderProps {
  generated: GeneratedContent[];
  template?: Template;
  onChange?: (structure: { [key: string]: string }) => void;
}

export default function StructureBuilder({
  generated,
  onChange,
}: StructureBuilderProps) {
  const [hierarchy, setHierarchy] = useState<FileSystemNode>(
    new FileSystemNode('src', FileType.FOLDER, [])
  );

  const [opened, { open, close }] = useDisclosure(false);
  const [node, setNode] = useState<FileSystemNode>(hierarchy);
  const contents = useMemo<GeneratedContent[]>(
    () => findUnmappedGeneratedContents(hierarchy, generated),
    [hierarchy, generated]
  );

  const [activeTab, setActiveTab] = useState<'edit' | 'create'>('edit');
  const [code, setCode] = useState<string>('');

  useEffect(() => {
    const [pathMap, paths] = fileSystemNodeToJSON(hierarchy);
    const content =
      JSON.stringify(pathMap, null, 2) +
      '\n\n' +
      paths.map((p) => `[${p.type}] ${p.path}`).join('\n');
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

  const handleRightClick = (e: any, currNode: FileSystemNode) => {
    e.preventDefault();
    setNode(currNode);
    if (currNode.type === FileType.FILE) {
      setActiveTab('edit');
    }
    open();
  };

  const handleEdit = (node: FileSystemNode, formResponse: NodeFormData) => {
    node.name = formResponse.name;
    node.type = formResponse.type;
    node.contents = formResponse.contents.map(
      (id) => new GeneratedContent(id.split('.')[1], id.split('.')[0])
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
        formResponse.contents.map(
          (name) => new GeneratedContent(name.split('.')[1], name.split('.')[0])
        )
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
          <h2 className="text-lg font-bold">Specify Structure</h2>
          <Modal
            opened={opened}
            onClose={close}
            title="Menu"
            overlayProps={{
              backgroundOpacity: 0.55,
              blur: 3,
            }}
          >
            <Tabs
              value={activeTab}
              onChange={(value) =>
                setActiveTab((value as 'edit' | 'create') ?? 'edit')
              }
            >
              <Tabs.List>
                <Tabs.Tab value="edit">Edit</Tabs.Tab>
                {node.type === FileType.FOLDER && (
                  <Tabs.Tab value="create">Create</Tabs.Tab>
                )}
              </Tabs.List>

              <Tabs.Panel value="edit" className="mt-3">
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
              <Tabs.Panel value="create" className="mt-3">
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

      <div className="flex flex-col w-1/2">
        <div className="bg-slate-50 bg-opacity-70 p-3">
          <h2 className="text-lg font-bold">Generated Contents</h2>

          <div>
            {contents.map((g) => (
              <div key={g.id} className="flex items-center gap-3">
                <IconCircle size={8} className="mr-3 ml-1" />{' '}
                <span>{g.name}</span>
              </div>
            ))}
          </div>
        </div>

        <Spoiler maxHeight={120} showLabel="Show more" hideLabel="Hide">
          <CodeHighlight
            className="w-full"
            code={code}
            language="json"
            withCopyButton={false}
          />
        </Spoiler>
      </div>
    </div>
  );
}
