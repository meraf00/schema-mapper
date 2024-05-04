'use client';

import { cacheKeys, getSchema, updateSchema } from '@/api';
import SchemaForm, {
  SchemaFormData,
} from '@/features/schema-builder/components/Forms/SchemaForm';
import { LoadingOverlay } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import React from 'react';

export default function SchemaPage() {
  const queryClient = useQueryClient();
  const params = useParams();

  const { isLoading, error, data } = useQuery({
    queryKey: [cacheKeys.schemas, params['schema-id']],
    queryFn: () => getSchema(params['schema-id'] as string),
  });

  const mutation = useMutation({
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

  const handleSchemaUpdate = (data: SchemaFormData) => {
    mutation.mutate({ id: params['schema-id'] as string, name: data.name });
  };

  return (
    <div className="relative w-full px-3 pt-1">
      {isLoading && <LoadingOverlay visible loaderProps={{ type: 'bars' }} />}
      <h1 className="font-bold text-xl pb-3">Update Schema</h1>
      <div className="w-1/3">
        {data && <SchemaForm schema={data} onSubmit={handleSchemaUpdate} />}
      </div>
    </div>
  );
}
