import { cacheKeys, createSchema, createTable } from '@/api';
import { Button, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react';

export interface CreateTableFormProps {
  schemaId: string;
  close: () => void;
}

export const CreateTableForm = ({ schemaId, close }: CreateTableFormProps) => {
  const queryClient = useQueryClient();

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: { name: '' },

    validate: {
      name: (value) =>
        value.length < 1 ? 'Table name must have at least 1 letter' : null,
    },
  });

  const mutation = useMutation({
    mutationFn: (name: string) => createTable(schemaId, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [cacheKeys.schemas] });
      close();
    },
  });

  return (
    <form onSubmit={form.onSubmit((data) => mutation.mutate(data.name))}>
      <TextInput
        label="Name"
        placeholder="Name"
        {...form.getInputProps('name')}
      />

      <Button type="submit" mt="sm">
        Save
      </Button>
    </form>
  );
};
