'use client';

import { cacheKeys, getSchema, updateSchema } from '@/api';
import { useAppSelector } from '@/lib/hooks';
import { Button, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react';

export interface UpdateSchemaFormProps {
  close: () => void;
}

export const UpdateSchemaForm = ({ close }: UpdateSchemaFormProps) => {
  const queryClient = useQueryClient();

  const { schema } = useAppSelector((state) => state.entity);

  const { isPending, error, data, isFetching } = useQuery({
    queryKey: [cacheKeys.schemas, schema!],
    queryFn: () => getSchema(schema!),
  });

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: { name: data?.name ?? '' },

    validate: {
      name: (value) =>
        value.length < 1 ? 'Schema name must have at least 1 letter' : null,
    },
  });

  const mutation = useMutation({
    mutationFn: (schema: { id: string; name: string }) =>
      updateSchema(schema.id, schema.name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [cacheKeys.schemas] });
      close();
    },
  });

  form.setFieldValue('name', data?.name);

  return (
    <form
      onSubmit={form.onSubmit((data) =>
        mutation.mutate({ id: schema!, name: data.name })
      )}
    >
      <TextInput
        label="Name"
        placeholder="Name"
        {...form.getInputProps('name')}
        key={'name'}
        required
      />

      <Button type="submit" mt="sm">
        Save
      </Button>
    </form>
  );
};
