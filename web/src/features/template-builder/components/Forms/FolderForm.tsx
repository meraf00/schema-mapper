import { Button, Select, TextInput } from '@mantine/core';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useEffect, useMemo } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FileSystemNode, FileType, InternalType } from '@/lib/model/template';

export interface FolderFormProps {
  file?: FileSystemNode;
  allowedInternalTypes: InternalType[];
  onSubmit: SubmitHandler<FolderFormData>;
}

export type FolderFormData = {
  name: string;
  type: FileType;
  internalType: InternalType;
};

const templateFormData = yup
  .object({
    name: yup.string().required(),
    type: yup.mixed<FileType>().oneOf(Object.values(FileType)).required(),
    internalType: yup
      .mixed<InternalType>()
      .oneOf(Object.values(InternalType))
      .required(),
  })
  .required();

const templateToForm = (file: FileSystemNode | undefined): FolderFormData => ({
  name: file?.name ?? '',
  type: file?.type ?? FileType.FOLDER,
  internalType: file?.internalType ?? InternalType.NORMAL,
});

export default function FolderForm({
  file,
  allowedInternalTypes,
  onSubmit,
}: FolderFormProps) {
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<FolderFormData>({
    resolver: yupResolver(templateFormData),
    defaultValues: useMemo(() => templateToForm(file), [name]),
  });

  useEffect(() => {
    reset(templateToForm(file));
  }, [file]);

  let showType = true;

  if (file && file.type === FileType.FOLDER && file.children.length > 0) {
    showType = false;
  }

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
            />
          )}
        />
      )}

      <Controller
        name="internalType"
        control={control}
        render={({ field }) => (
          <Select
            searchable
            data={
              file && file.internalType !== InternalType.NORMAL
                ? [file.internalType, ...allowedInternalTypes]
                : allowedInternalTypes
            }
            nothingFoundMessage="Nothing found..."
            label="Internal Type"
            placeholder=""
            {...field}
            required
          />
        )}
      />

      <Button type="submit" mt="sm">
        Save
      </Button>
    </form>
  );
}
