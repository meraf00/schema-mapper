import { cacheKeys, getTable, updateTable } from '@/api';
import { Button, Checkbox, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
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
    mutationFn: (data: any) => updateTable(tableId, data.name, data.aggregate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [cacheKeys.schemas] });
      notifications.show({
        title: 'Success',
        message: 'Table updated successfully',
        color: 'blue',
      });
    },
  });

  const [name, setName] = React.useState('');
  const [aggregate, setAggregate] = React.useState(false);

  useEffect(() => {
    if (data) {
      setName(data.name);
      setAggregate(data.isAggregate);
    }
  }, [data]);

  // console.log(data, aggregate);

  return (
    <form
      className="w-1/3"
      onSubmit={() => {
        mutation.mutate({
          name,
          aggregate,
        });
      }}
    >
      <TextInput
        label="Name"
        placeholder="Name"
        value={name}
        key={'table-name'}
        onChange={(event) => setName(event.currentTarget.value)}
        required
        className="mb-3"
      />

      <Checkbox
        checked={aggregate}
        label="Aggregate"
        placeholder="Aggregate"
        {...form.getInputProps('aggregate', { type: 'checkbox' })}
        key="primary"
        onChange={(event) => {
          setAggregate((value: boolean) => !value);
        }}
      />

      <Button type="submit" mt="lg">
        Save
      </Button>
    </form>
  );
};
