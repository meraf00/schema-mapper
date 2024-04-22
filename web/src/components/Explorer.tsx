'use client';

import React from 'react';

import { Schema } from '@/model/schema';
import { IconPlus, IconReload } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { Modal } from '@mantine/core';
import { Hierarchy } from './Hierarchy';

import { CreateSchemaForm } from './Forms/CreateSchemaForm';
import { CreateTableForm } from './Forms/CreateTableForm';
import { CreateAttributeForm } from './Forms/CreateAttributeForm';

export interface ExplorerProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  schemas: Schema[];
}

export const Explorer = ({ schemas, ...props }: ExplorerProps) => {
  const [opened, { open, close }] = useDisclosure(false);

  const [active, setActive] = React.useState<{
    schema: string | null;
    table: string | null;
    attribute: string | null;
    id: string | null;
  }>({
    schema: null,
    table: null,
    attribute: null,
    id: null,
  });

  let form, title;

  if (active.id === null) {
    title = 'Create Schema';
    form = <CreateSchemaForm close={close} />;
  } else if (active.schema !== null && active.schema === active.id) {
    title = 'Create Table';
    form = <CreateTableForm schemaId={active.schema} close={close} />;
  } else if (active.table !== null) {
    title = 'Create Attribute';
    form = (
      <CreateAttributeForm
        schema={schemas.find((s) => s.id === active.schema)!}
        tableId={active.table}
        close={close}
      />
    );
  }

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
          <span
            className="font-bold"
            onClick={() =>
              setActive({
                schema: null,
                table: null,
                attribute: null,
                id: null,
              })
            }
          >
            Explorer
          </span>
          <div className="flex gap-2 items-center">
            <IconReload
              size={16}
              className="cursor-pointer hover:text-blue-700"
            />
            <IconPlus
              size={16}
              className="cursor-pointer hover:text-blue-700"
              onClick={open}
            />
          </div>
        </div>

        <Hierarchy schemas={schemas} active={active} setActive={setActive} />
      </div>
    </>
  );
};
