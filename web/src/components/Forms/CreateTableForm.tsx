import { cacheKeys, createSchema, createTable } from '@/api';
import { Button, Checkbox, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
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
    initialValues: { name: '', aggregate: false },

    validate: {
      name: (value) =>
        value.length < 1 ? 'Table name must have at least 1 letter' : null,
      aggregate: (value) => {
        return null;
      },
    },
  });

  const mutation = useMutation({
    mutationFn: (data: any) => createTable(schemaId, data.name, data.aggregate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [cacheKeys.schemas] });
      notifications.show({
        title: 'Success',
        message: 'Table created successfully',
        color: 'blue',
      });
      close();
    },
  });

  return (
    <form onSubmit={form.onSubmit((data) => mutation.mutate(data))}>
      <TextInput
        label="Name"
        placeholder="Name"
        {...form.getInputProps('name')}
        key={'name'}
        required
      />

      <Checkbox
        label="Aggregate"
        placeholder="Aggregate"
        {...form.getInputProps('aggregate')}
        key="aggregate"
      />

      <Button type="submit" mt="sm">
        Save
      </Button>
    </form>
  );
};
