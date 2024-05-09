'use client';

import { Button, TextInput } from '@mantine/core';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useEffect, useMemo } from 'react';
import { Template } from '@/lib/model/template';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import FolderBuilder from '../Builder/FolderBuilder';

export interface TemplateFormProps {
  template?: Template;
  onSubmit: SubmitHandler<TemplateFormData>;
}

export type TemplateFormData = {
  name: string;
  description: string;
  content: string;
};

const templateFormData = yup
  .object({
    name: yup.string().required(),
    description: yup.string().required(),
    content: yup.string().required(),
  })
  .required();

const templateToForm = (template: Template | undefined): TemplateFormData => ({
  name: template?.name ?? '',
  description: template?.description ?? '',
  content: template?.content ?? '',
});

export default function TemplateForm({
  template,
  onSubmit,
}: TemplateFormProps) {
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<TemplateFormData>({
    resolver: yupResolver(templateFormData),
    defaultValues: useMemo(() => templateToForm(template), [template]),
  });

  useEffect(() => {
    reset(templateToForm(template));
  }, [template]);

  return (
    <form
      className="flex flex-col gap-3 w-full"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <TextInput label="Name" placeholder="Name" {...field} required />
        )}
      />

      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <TextInput
            label="Description"
            placeholder="Description"
            {...field}
            required
          />
        )}
      />

      <Controller
        name="content"
        control={control}
        render={({ field }) => (
          <TextInput
            className="hidden"
            label="Folder structure"
            placeholder="Folder structure"
            {...field}
            required
          />
        )}
      />

      <FolderBuilder />

      <Button type="submit" mt="sm">
        Save
      </Button>
    </form>
  );
}
