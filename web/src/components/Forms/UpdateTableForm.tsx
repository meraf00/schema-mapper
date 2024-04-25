import { cacheKeys, getTable, updateTable } from '@/api';
import { Button, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect } from 'react';

export interface UpdateTableFormProps {
  tableId: string;
}

export const UpdateTableForm = ({ tableId }: UpdateTableFormProps) => {
  const queryClient = useQueryClient();

  const { isPending, error, data, isFetching } = useQuery({
    queryKey: [cacheKeys.tables, tableId],
    queryFn: () => getTable(tableId),
  });

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: { name: data?.name ?? '' },

    validate: {
      name: (value) =>
        value.length < 1 ? 'Table name must have at least 1 letter' : null,
    },
  });

  const mutation = useMutation({
    mutationFn: (name: string) => updateTable(tableId, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [cacheKeys.schemas] });
    },
  });

  const [name, setName] = React.useState('');

  useEffect(() => {
    if (data) {
      setName(data.name);
    }
  }, [data]);

  return (
    <form onSubmit={form.onSubmit((data) => mutation.mutate(name))}>
      <TextInput
        label="Name"
        placeholder="Name"
        value={name}
        key={'table-name'}
        onChange={(event) => setName(event.currentTarget.value)}
        required
      />

      <Button type="submit" mt="sm">
        Save
      </Button>
    </form>
  );
};
