'use client';

import { Button, TextInput } from '@mantine/core';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useEffect, useMemo, useState } from 'react';
import {
  FileSystemNode,
  FileType,
  Template,
  fileSystemNodeToJSON,
} from '@/lib/model/template';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import FolderBuilder from '../Builder/FolderBuilder';
import { CodeHighlight } from '@mantine/code-highlight';
import * as prettier from 'prettier';
import parserBabel from 'prettier/plugins/babel';
import * as prettierPluginEstree from 'prettier/plugins/estree';

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

  const [code, setCode] = useState<string>('');

  const defaultHierarchy = new FileSystemNode('src', FileType.FOLDER, []);
  const [hierarchy, setHierarchy] = useState<FileSystemNode>(defaultHierarchy);

  useEffect(() => {
    reset(templateToForm(template));
  }, [template]);

  useEffect(() => {
    const content = JSON.stringify(fileSystemNodeToJSON(hierarchy), null, 2);
    const fn = async () => {
      try {
        const formatted = await prettier.format(content, {
          parser: 'json',
          plugins: [parserBabel, prettierPluginEstree],
        });

        setCode(formatted);
      } catch (e) {
        setCode(content);
      }
    };

    fn();
  }, [hierarchy]);

  return (
    <form className="flex gap-10 w-full" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-3 w-1/2">
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
        <FolderBuilder
          defaultHierarchy={defaultHierarchy}
          onChange={(hierarchy) => setHierarchy(hierarchy)}
        />
        <Button type="submit" mt="sm">
          Save
        </Button>
      </div>

      <div className="flex w-1/2">
        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <TextInput
              className="hidden w-full"
              label="Folder structure"
              placeholder="Folder structure"
              {...field}
              required
            />
          )}
        />

        <CodeHighlight
          className="w-full"
          code={code}
          language="json"
          withCopyButton={false}
        />
      </div>
    </form>
  );
}
