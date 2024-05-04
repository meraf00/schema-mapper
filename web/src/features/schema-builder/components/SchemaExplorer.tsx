'use client';

import React from 'react';

import { Schema } from '@/lib/model/schema';
import { IconPlus, IconReload } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { Modal } from '@mantine/core';
import { Hierarchy } from './Hierarchy';

export interface SchemaExplorerProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  schemas: Schema[];
}

export const SchemaExplorer = ({ schemas, ...props }: SchemaExplorerProps) => {
  const [opened, { open, close }] = useDisclosure(false);

  let form, title;

  return (
    <>
      <div {...props}>
        <Modal
          opened={opened}
          onClose={close}
          title={title}
          overlayProps={{
            backgroundOpacity: 0.55,
            blur: 3,
          }}
        >
          {form}
        </Modal>

        <div className="flex text-sm justify-between p-2 items-center mb-2">
          <span className="font-bold" onClick={() => {}}>
            Explorer
          </span>
          <div className="flex gap-2 items-center">
            <IconPlus
              size={16}
              className="cursor-pointer hover:text-blue-700"
              onClick={open}
            />
          </div>
        </div>

        <Hierarchy schemas={schemas} />
      </div>
    </>
  );
};
