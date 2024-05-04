import { Button, TextInput } from '@mantine/core';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useEffect, useMemo } from 'react';
import { Schema } from '@/lib/model/schema';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

export interface SchemaFormProps {
  schema?: Schema;
  onSubmit: SubmitHandler<SchemaFormData>;
}

export type SchemaFormData = {
  name: string;
};

const schemaFormData = yup
  .object({
    name: yup.string().required(),
  })
  .required();

const schemaToForm = (schema: Schema | undefined): SchemaFormData => ({
  name: schema?.name ?? '',
});

export default function SchemaForm({ schema, onSubmit }: SchemaFormProps) {
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<SchemaFormData>({
    resolver: yupResolver(schemaFormData),
    defaultValues: useMemo(() => schemaToForm(schema), [schema]),
  });

  useEffect(() => {
    reset(schemaToForm(schema));
  }, [schema]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <TextInput label="Name" placeholder="Name" {...field} required />
        )}
      />

      <Button type="submit" mt="sm">
        Save
      </Button>
    </form>
  );
}
