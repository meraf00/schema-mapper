import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button, MultiSelect } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { cacheKeys, getSchemas } from '@/api';
import { Schema } from '@/lib/model/schema';

export interface GeneratorFormProps {
  onSubmit: (data: GenerateCodeFormData) => void;
}

export interface GenerateCodeFormData {
  schemas: string[];
}

export default function GeneratorForm({ onSubmit }: GeneratorFormProps) {
  const { data: schemas, isLoading } = useQuery({
    queryKey: [cacheKeys.schemas],
    queryFn: getSchemas,
  });

  const { control, handleSubmit } = useForm<GenerateCodeFormData>();

  return (
    <form
      className="flex flex-col gap-4 w-1/3"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Controller
        name="schemas"
        control={control}
        render={({ field }) => (
          <MultiSelect
            data={
              schemas &&
              schemas.map((schema: Schema) => ({
                value: schema.id,
                label: schema.name,
              }))
            }
            placeholder={isLoading ? 'Loading...' : 'You can select multiple'}
            label="Select schemas"
            {...field}
            required
          />
        )}
      />

      <Button type="submit" mt="sm">
        Generate
      </Button>
    </form>
  );
}
