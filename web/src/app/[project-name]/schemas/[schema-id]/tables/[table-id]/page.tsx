'use client';

import { cacheKeys, getTable, updateTable } from '@/api';
import TableForm, {
  TableFormData,
} from '@/features/schema-builder/components/Forms/TableForm';
import { LoadingOverlay } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import React from 'react';

export default function TablePage() {
  const queryClient = useQueryClient();
  const params = useParams();

  const { isLoading, error, data } = useQuery({
    queryKey: [cacheKeys.tables, params['table-id']],
    queryFn: () => getTable(params['table-id'] as string),
  });

  const mutation = useMutation({
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

  const handleTableUpdate = (data: TableFormData) => {
    mutation.mutate({
      id: params['table-id'] as string,
      name: data.name,
      isAggregate: data.isAggregate === 'true',
    });
  };

  return (
    <div className="relative w-full">
      {isLoading && <LoadingOverlay visible loaderProps={{ type: 'bars' }} />}
      <h1 className="font-bold text-xl pb-3">Update Schema</h1>
      <div className="w-1/3">
        {data && <TableForm table={data} onSubmit={handleTableUpdate} />}
      </div>
    </div>
  );
}
