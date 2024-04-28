import { cacheKeys, createSchema } from '@/api';
import { Button, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react';

export interface CreateSchemaFormProps {
  close: () => void;
}

export const CreateSchemaForm = ({ close }: CreateSchemaFormProps) => {
  const queryClient = useQueryClient();

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: { name: '' },

    validate: {
      name: (value) =>
        value.length < 1 ? 'Schema name must have at least 1 letter' : null,
    },
  });

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

  return (
    <form onSubmit={form.onSubmit((data) => mutation.mutate(data.name))}>
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
