'use client';

import { Button, Select, TextInput } from '@mantine/core';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useEffect, useMemo, useState } from 'react';
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
    setValue,
    formState: { errors },
  } = useForm<FolderFormData>({
    resolver: yupResolver(templateFormData),
    defaultValues: useMemo(() => templateToForm(file), [name]),
  });

  const [internalTypes, setInternalTypes] =
    useState<InternalType[]>(allowedInternalTypes);
  const [showInternalTypes, setShowInternalTypes] = useState(false);

  useEffect(() => {
    reset(templateToForm(file));
  }, [file]);

  let showType = true;

  if (file && file.type === FileType.FOLDER && file.children.length > 0) {
    showType = false;
  }

  if (file && file.type === FileType.FILE) {
    setShowInternalTypes(true);
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
              onChange={(e) => {
                if (e === 'file') {
                  setValue('type', FileType.FILE);
                  setInternalTypes(allowedInternalTypes);
                  setShowInternalTypes(true);
                }
                if (e === 'folder') {
                  setValue('type', FileType.FOLDER);
                  setInternalTypes([InternalType.NORMAL]);
                  setShowInternalTypes(false);
                }
              }}
            />
          )}
        />
      )}

      {showInternalTypes && (
        <Controller
          name="internalType"
          control={control}
          render={({ field }) => (
            <Select
              searchable
              data={internalTypes}
              nothingFoundMessage="Nothing found..."
              label="Internal Type"
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
