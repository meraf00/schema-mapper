'use client';

import {
  cacheKeys,
  createAttribute,
  deleteTable,
  getSchema,
  getTable,
  updateTable,
} from '@/api';
import AttributeForm, {
  AttributeFormData,
} from '@/features/schema-builder/components/Forms/AttributeForm';
import TableForm, {
  TableFormData,
} from '@/features/schema-builder/components/Forms/TableForm';
import { Button, LoadingOverlay, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import React from 'react';

export default function TablePage() {
  const queryClient = useQueryClient();
  const params = useParams();
  const [opened, { open, close }] = useDisclosure(false);

  const { isLoading, error, data } = useQuery({
    queryKey: [cacheKeys.tables, params['table-id']],
    queryFn: () => getTable(params['table-id'] as string),
  });

  const { data: schema } = useQuery({
    queryKey: [cacheKeys.schemas, params['schema-id']],
    queryFn: () => getSchema(params['schema-id'] as string),
  });

  const updateTableMutation = useMutation({
    mutationFn: (table: { id: string; name: string; isAggregate: boolean }) =>
      updateTable(table.id, table.name, table.isAggregate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [cacheKeys.schemas] });
      notifications.show({
        title: 'Success',
        message: 'Schema updated successfully',
        color: 'blue',
      });
    },
  });

  const deleteTableMutation = useMutation({
    mutationFn: (table: { id: string }) => deleteTable(table.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [cacheKeys.schemas] });
      notifications.show({
        title: 'Success',
        message: 'Table deleted successfully',
        color: 'blue',
      });
    },
  });

  const createAttributeMutation = useMutation({
    mutationFn: createAttribute,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [cacheKeys.schemas, cacheKeys.attributes],
      });
      queryClient.invalidateQueries({
        queryKey: [cacheKeys.schemas],
      });
      notifications.show({
        title: 'Success',
        message: 'Attribute created successfully',
        color: 'blue',
      });
      close();
    },
  });

  const handleTableUpdate = (data: TableFormData) => {
    updateTableMutation.mutate({
      id: params['table-id'] as string,
      name: data.name,
      isAggregate: data.isAggregate === 'true',
    });
  };

  const handleTableDelete = () => {
    deleteTableMutation.mutate({ id: params['table-id'] as string });
  };

  const handleAttributeCreate = (data: AttributeFormData) => {
    createAttributeMutation.mutate({
      tableId: params['table-id'] as string,
      name: data.name,
      type: data.type,
      isNullable: data.isNullable === 'true',
      isUnique: data.isUnique === 'true',
      isPrimary: data.isPrimary === 'true',
      isForeign: data.isForeign === 'true',
      isGenerated: data.isGenerated === 'true',
      relationType: data.relationType ?? undefined,
      references: data.references ?? undefined,
      backref: data.backref ?? undefined,
    });
  };

  return (
    <div className="relative w-full px-3 py-5">
      {schema && (
        <Modal
          opened={opened}
          onClose={close}
          title="Create Attribute"
          overlayProps={{
            backgroundOpacity: 0.55,
            blur: 3,
          }}
        >
          <AttributeForm
            tables={schema.tables}
            onSubmit={handleAttributeCreate}
          />
        </Modal>
      )}

      {isLoading && <LoadingOverlay visible loaderProps={{ type: 'bars' }} />}
      <div className="flex justify-between">
        <h1 className="font-bold text-xl pb-3 pt-1">Update Table</h1>

        <div className="flex gap-3">
          <Button onClick={open}>Create Attribute</Button>
          <Button bg="red" onClick={handleTableDelete}>
            Delete Table
          </Button>
        </div>
      </div>
      <div className="w-1/3">
        {data && <TableForm table={data} onSubmit={handleTableUpdate} />}
      </div>
    </div>
  );
}
