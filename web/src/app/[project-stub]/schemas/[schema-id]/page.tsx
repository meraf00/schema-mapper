'use client';

import {
  cacheKeys,
  createTable,
  deleteSchema,
  getSchema,
  updateSchema,
} from '@/api';
import SchemaForm, {
  SchemaFormData,
} from '@/features/schema-builder/components/Forms/SchemaForm';
import TableForm, {
  TableFormData,
} from '@/features/schema-builder/components/Forms/TableForm';
import { Button, LoadingOverlay, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import React from 'react';

export default function SchemaPage() {
  const queryClient = useQueryClient();
  const params = useParams();
  const [opened, { open, close }] = useDisclosure(false);

  const { isLoading, error, data } = useQuery({
    queryKey: [cacheKeys.schemas, params['schema-id']],
    queryFn: () => getSchema(params['schema-id'] as string),
  });

  const onError = (error: Error) => {
    notifications.show({
      title: 'Error',
      message: error.message,
      color: 'red',
    });
  };

  const updateSchemaMutation = useMutation({
    mutationFn: (schema: { id: string; name: string }) =>
      updateSchema(schema.id, schema.name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [cacheKeys.schemas] });
      notifications.show({
        title: 'Success',
        message: 'Schema updated successfully',
        color: 'blue',
      });
    },
  });

  const deleteSchemaMutation = useMutation({
    mutationFn: (schema: { id: string }) => deleteSchema(schema.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [cacheKeys.schemas] });
      notifications.show({
        title: 'Success',
        message: 'Schema deleted successfully',
        color: 'blue',
      });
    },
  });

  const createTableMutation = useMutation({
    mutationFn: (table: {
      schemaId: string;
      name: string;
      isAggregate: boolean;
    }) => createTable(table.schemaId, table.name, table.isAggregate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [cacheKeys.schemas] });
      notifications.show({
        title: 'Success',
        message: 'New table created successfully',
        color: 'blue',
      });
    },
  });

  const handleSchemaUpdate = (data: SchemaFormData) => {
    updateSchemaMutation.mutate({
      id: params['schema-id'] as string,
      name: data.name,
    });
  };

  const handleSchemaDelete = () => {
    deleteSchemaMutation.mutate({ id: params['schema-id'] as string });
  };

  const handleCreateTable = (data: TableFormData) => {
    createTableMutation.mutate({
      schemaId: params['schema-id'] as string,
      name: data.name,
      isAggregate: data.isAggregate === 'true',
    });
    close();
  };

  return (
    <div className="relative w-full px-3 py-5">
      <Modal
        opened={opened}
        onClose={close}
        title="Create Table"
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        <TableForm onSubmit={handleCreateTable} />
      </Modal>

      {isLoading && <LoadingOverlay visible loaderProps={{ type: 'bars' }} />}
      <div className="flex justify-between">
        <h1 className="font-bold text-xl pb-3 pt-1">Update Schema</h1>
        <div className="flex gap-3">
          <Button onClick={open}>Create Table</Button>
          <Button bg="red" onClick={handleSchemaDelete}>
            Delete Schema
          </Button>
        </div>
      </div>
      <div className="w-1/3">
        {data && <SchemaForm schema={data} onSubmit={handleSchemaUpdate} />}
      </div>
    </div>
  );
}
