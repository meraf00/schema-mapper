'use client';

import { Button, MultiSelect, Select, TextInput } from '@mantine/core';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useEffect, useMemo, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  GeneratedContent,
  FileSystemNode,
  FileType,
} from '@/lib/model/template';

export interface NodeFormProps {
  node?: FileSystemNode;
  defaultContents?: GeneratedContent[];
  onSubmit: SubmitHandler<NodeFormData>;
}

export type NodeFormData = {
  name: string;
  type: FileType;
  contents: string[];
};

const templateFormData = yup
  .object({
    name: yup.string().required(),
    type: yup.mixed<FileType>().oneOf(Object.values(FileType)).required(),
    contents: yup.array().of(yup.string().required()).required(),
  })
  .required();

const templateToForm = (node: FileSystemNode | undefined): NodeFormData => ({
  name: node?.name ?? '',
  type: node?.type ?? FileType.FOLDER,
  contents: node?.contents.map((c) => c.id) ?? [],
});

export default function NodeForm({
  node,
  defaultContents,
  onSubmit,
}: NodeFormProps) {
  const {
    control,
    reset,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<NodeFormData>({
    resolver: yupResolver(templateFormData),
    defaultValues: useMemo(() => templateToForm(node), [node]),
  });

  const [contents, setContents] = useState<GeneratedContent[]>(
    defaultContents ?? []
  );
  const [showContents, setShowContents] = useState(false);

  useEffect(() => {
    reset(templateToForm(node));

    if (node && node.type === FileType.FILE) {
      setContents((contents) => {
        const shouldAdd: GeneratedContent[] = [];
        const currContent = getValues()['contents'];

        currContent.forEach(
          (c) =>
            !contents.find((cnt) => cnt.id === c) &&
            shouldAdd.push(
              new GeneratedContent(c.split('.')[1], c.split('.')[0])
            )
        );
        return [...contents, ...shouldAdd];
      });

      setShowContents(true);
    }
  }, [node, reset, getValues]);

  let showType = true;

  if (node && node.type === FileType.FOLDER && node.children.length > 0) {
    showType = false;
  }

  console.log(contents, defaultContents);

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <TextInput label="Name" placeholder="Name" {...field} required />
        )}
      />

      {showType && (
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <Select
              searchable
              data={Object.values(FileType)}
              nothingFoundMessage="Nothing found..."
              label="Type"
              placeholder="File / Folder"
              {...field}
              required
              onChange={(e) => {
                if (e === 'file') {
                  setValue('type', FileType.FILE);
                  setShowContents(true);
                }
                if (e === 'folder') {
                  setValue('type', FileType.FOLDER);
                  setShowContents(false);
                }
              }}
            />
          )}
        />
      )}

      {showContents && (
        <Controller
          name="contents"
          control={control}
          render={({ field }) => (
            <MultiSelect
              searchable
              data={
                contents?.map((c) => ({ value: c.id, label: c.name })) ?? []
              }
              nothingFoundMessage="Nothing found..."
              label="Content"
              placeholder=""
              {...field}
              required
            />
          )}
        />
      )}

      <Button type="submit" mt="sm">
        Save
      </Button>
    </form>
  );
}
