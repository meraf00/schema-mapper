'use client';


import { cacheKeys, getSchema, updateSchema, generateCode } from '@/api';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { SchemaTable } from '../SchemaTable';
import { load, set } from '@/lib/store/codegeneration/slice';
import { Button, TextInput } from '@mantine/core';
import { TaskList } from '../TaskList';

export const UpdateSchemaForm = () => {
  const queryClient = useQueryClient();

  const { schema } = useAppSelector((state) => state.entity);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (schema) {
      dispatch(load());
    }
  }, []);

  const { isPending, error, data, isFetching } = useQuery({
    queryKey: [cacheKeys.schemas, schema!],
    queryFn: () => getSchema(schema!),
  });

  const [name, setName] = React.useState('');

  const form = useForm({
    mode: 'uncontrolled',

    validate: {
      name: (value) =>
        name.length < 1 ? 'Schema name must have at least 1 letter' : null,
    },
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

  const codeGeneration = useMutation({
    mutationFn: (schemaId: string) => generateCode(schemaId),
    onSuccess: (data) => {
      dispatch(
        set({
          id: data.id,
          timestamp: new Date().getTime(),
          status: 'Pending',
        })
      );
      notifications.show({
        title: 'Success',
        message: 'Code generation task added.',
        color: 'blue',
      });
    },
  });

  useEffect(() => {
    if (data) {
      setName(data.name);
    }
  }, [data]);

  return (
    <>
      <form
        className="w-1/3"
        onSubmit={form.onSubmit((data) =>
          mutation.mutate({ id: schema!, name: name })
        )}
      >
        <TextInput
          label="Name"
          placeholder="Name"
          value={name}
          {...form.getInputProps('name')}
          key={'schema-name'}
          onChange={(event) => setName(event.currentTarget.value)}
          required
        />

        <Button type="submit" mt="sm">
          Save
        </Button>
      </form>

      {data && (
        <div className="flex flex-col gap-5">
          <SchemaTable schema={data} />
          <TaskList schemaId={data.id} />
        </div>
      )}
    </>
  );
};
