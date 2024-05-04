'use client';

import React from 'react';

import { Schema } from '@/lib/model/schema';
import { IconPlus, IconReload } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { Modal } from '@mantine/core';
import { Hierarchy } from './Hierarchy';
import SchemaForm from './Forms/SchemaForm';
import { cacheKeys, createSchema } from '@/api';
import {
  QueryClient,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';

export interface SchemaExplorerProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  schemas: Schema[];
}

export const SchemaExplorer = ({ schemas, ...props }: SchemaExplorerProps) => {
  const queryClient = useQueryClient();
  const [opened, { open, close }] = useDisclosure(false);

  const mutation = useMutation({
    mutationFn: createSchema,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [cacheKeys.schemas] });
      notifications.show({
        title: 'Success',
        message: 'Schema created successfully',
        color: 'blue',
      });
      close();
    },
  });

  const handleCreateSchema = (data: { name: string }) => {
    mutation.mutate(data.name);
    close();
  };

  return (
    <>
      <div {...props}>
        <Modal
          opened={opened}
          onClose={close}
          title={'Create Schema'}
          overlayProps={{
            backgroundOpacity: 0.55,
            blur: 3,
          }}
        >
          <SchemaForm onSubmit={handleCreateSchema} />
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
