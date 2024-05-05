import { Button, Checkbox, TextInput } from '@mantine/core';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useEffect, useMemo } from 'react';
import { Table } from '@/lib/model/table';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

export interface TableFormProps {
  table?: Table;
  onSubmit: SubmitHandler<TableFormData>;
}

export type TableFormData = {
  name: string;
  isAggregate?: 'true' | 'false';
};

const tableFormData = yup
  .object({
    name: yup.string().required(),
    isAggregate: yup.mixed(),
  })
  .required();

const tableToForm = (table: Table | undefined): TableFormData => ({
  name: table?.name ?? '',
  isAggregate: table?.isAggregate ? 'true' : 'false',
});

export default function TableForm({ table, onSubmit }: TableFormProps) {
  const {
    control,
    reset,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<TableFormData>({
    resolver: yupResolver(tableFormData),
    defaultValues: useMemo(() => tableToForm(table), [table]),
  });

  useEffect(() => {
    reset(tableToForm(table));
  }, [table]);

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <TextInput label="Name" placeholder="Name" {...field} required />
        )}
      />

      <Controller
        name="isAggregate"
        control={control}
        render={({ field }) => (
          <Checkbox
            checked={field.value === 'true'}
            label="Aggregate"
            placeholder="Aggregate"
            {...field}
            onChange={(event) => {
              setValue('isAggregate', event.target.checked ? 'true' : 'false');
            }}
          />
        )}
      />

      <Button type="submit" mt="sm">
        Save
      </Button>
    </form>
  );
}
