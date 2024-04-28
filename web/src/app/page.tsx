'use client';

import {
  cacheKeys,
  deleteAttribute,
  deleteSchema,
  deleteTable,
  getSchemas,
} from '@/api';
import { Explorer } from '@/components/Explorer';
import { UpdateAttributeForm } from '@/components/Forms/UpdateAttributeForm';

import { UpdateTableForm } from '@/components/Forms/UpdateTableForm';
import { UpdateSchemaForm } from '@/components/Forms/UpdateSchemaForm';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { Schema } from '@/lib/model/schema';
import { Button, LoadingOverlay } from '@mantine/core';
import { notifications } from '@mantine/notifications';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { setActive } from '@/lib/store/entity/slice';

export default function Home() {
  const queryClient = useQueryClient();

  const { isPending, error, data, isFetching } = useQuery({
    queryKey: [cacheKeys.schemas],
    queryFn: getSchemas,
  });

  const active = useAppSelector((state) => state.entity);
  const dispatch = useAppDispatch();

  const onSuccess = () => {
    notifications.show({
      title: 'Success',
      message: 'Deleted successfully',
      color: 'green',
    });
    queryClient.invalidateQueries({ queryKey: [cacheKeys.attributes] });
    queryClient.invalidateQueries({ queryKey: [cacheKeys.tables] });
    queryClient.invalidateQueries({ queryKey: [cacheKeys.schemas] });
    dispatch(
      setActive({ id: null, schema: null, table: null, attribute: null })
    );
  };

  const onError = (error: Error) => {
    notifications.show({
      title: 'Error',
      message: error.message,
      color: 'red',
    });
  };

  const deleteSchemaMutation = useMutation({
    mutationFn: (id: string) => deleteSchema(id),
    onSuccess: onSuccess,
    onError: onError,
  });
  const deleteTableMutation = useMutation({
    mutationFn: (id: string) => deleteTable(id),
    onSuccess: onSuccess,
    onError: onError,
  });
  const deleteAttributeMutation = useMutation({
    mutationFn: (id: string) => deleteAttribute(id),
    onSuccess: onSuccess,
    onError: onError,
  });

  let form, title;

  let schemas: Schema[] = data ?? [];

  if (active.id === null) {
    title = '';
    form = null;
  } else if (active.schema === active.id) {
    title = 'Update Schema';
    form = <UpdateSchemaForm />;
  } else if (active.id === active.table) {
    title = 'Update Table';
    form = <UpdateTableForm tableId={active.table!} />;
  } else if (active.attribute === active.id) {
    title = 'Update Attribute';
    form = (
      <UpdateAttributeForm
        attributeId={active.attribute!}
        schema={schemas.find((s) => s.id === active.schema)!}
        tableId={active.table!}
      />
    );
  }

  return (
    <main className="h-screen relative flex gap-3 overflow-auto">
      <LoadingOverlay
        visible={isPending || isFetching}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 2 }}
        loaderProps={{ type: 'bars' }}
      />
      <Explorer
        className="w-1/4 px-2 border-r h-full sticky top-0"
        schemas={schemas}
      />
      <div className="flex flex-col gap-5 p-2 pt-0 w-full ">
        <div className="flex justify-between items-center sticky top-0 z-[10] bg-white ">
          <h1 className="text-2xl font-bold">{title}</h1>
          {active.id && (
            <Button
              color="red"
              mt="sm"
              onClick={() => {
                if (active.id === active.schema) {
                  deleteSchemaMutation.mutate(active.id!);
                }
                if (active.id === active.table) {
                  deleteTableMutation.mutate(active.id!);
                }
                if (active.id === active.attribute) {
                  deleteAttributeMutation.mutate(active.id!);
                }
              }}
            >
              Delete
            </Button>
          )}
        </div>

        <div className="w-1/3 pb-10">{form}</div>
      </div>
    </main>
  );
}
