'use client';

import { cacheKeys, getSchema, updateSchema, getSchemaCode } from '@/api';
import { useAppSelector } from '@/lib/hooks';
import { CodeHighlightTabs } from '@mantine/code-highlight';
import { Button, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect } from 'react';

export const UpdateSchemaForm = () => {
  const queryClient = useQueryClient();

  const { schema } = useAppSelector((state) => state.entity);

  const { isPending, error, data, isFetching } = useQuery({
    queryKey: [cacheKeys.schemas, schema!],
    queryFn: () => getSchema(schema!),
  });

  const schemaCode = useQuery({
    queryKey: [cacheKeys.schemas, schema!, 'code'],
    queryFn: () => getSchemaCode(schema!),
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

  useEffect(() => {
    if (data) {
      setName(data.name);
    }
  }, [data]);

  return (
    <>
      <form
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

      <div className="mt-5 flex w-full">
        <CodeHighlightTabs
          code={[
            { fileName: name, code: schemaCode.data ?? '', language: 'ts' },
          ]}
        />
      </div>
    </>
  );
};
