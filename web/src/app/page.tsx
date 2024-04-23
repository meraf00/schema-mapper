'use client';

import { cacheKeys, getSchemas } from '@/api';
import { Explorer } from '@/components/Explorer';
import { UpdateAttributeForm } from '@/components/Forms/UpdateAttributeForm';

import { UpdateTableForm } from '@/components/Forms/UpdateTableForm';
import { UpdateSchemaForm } from '@/components/Forms/UpdateSchemaForm';
import { useAppSelector } from '@/lib/hooks';
import { Schema } from '@/lib/model/schema';
import { LoadingOverlay } from '@mantine/core';

import { useQuery } from '@tanstack/react-query';

export default function Home() {
  const { isPending, error, data, isFetching } = useQuery({
    queryKey: [cacheKeys.schemas],
    queryFn: getSchemas,
  });

  const active = useAppSelector((state) => state.entity);

  let form, title;

  let schemas: Schema[] = data ?? [];

  if (active.id === null) {
    title = 'Welcome to your database!';
    form = null;
  } else if (active.schema === active.id) {
    title = 'Update Schema';
    form = <UpdateSchemaForm close={close} />;
  } else if (active.id === active.table) {
    title = 'Update Table';
    form = <UpdateTableForm tableId={active.table!} close={close} />;
  } else if (active.attribute === active.id) {
    title = 'Update Attribute';
    form = (
      <UpdateAttributeForm
        attributeId={active.attribute!}
        schema={schemas.find((s) => s.id === active.schema)!}
        tableId={active.table!}
        close={close}
      />
    );
  }

  return (
    <main className="h-screen relative flex gap-3">
      <LoadingOverlay
        visible={isPending || isFetching}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 2 }}
        loaderProps={{ type: 'bars' }}
      />
      <Explorer className="w-1/4 px-2 border-r h-full" schemas={schemas} />
      <div className="flex flex-col gap-5 p-2 w-full">
        <h1 className="text-2xl font-bold">{title}</h1>

        <div className="w-1/3">{form}</div>
      </div>
    </main>
  );
}
