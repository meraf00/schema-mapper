'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { cacheKeys, getAttribute, getTable, updateAttribute } from '@/api';
import { Button, Checkbox, Grid, Select, TextInput } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { Attribute } from '@/lib/model/attribute';
import { Schema } from '@/lib/model/schema';
import { Table } from '@/lib/model/table';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';

export interface UpdateAttributeFormProps {
  attributeId: string;
  schema: Schema;
  tableId: string;
}

export const UpdateAttributeForm = ({
  tableId,
  attributeId,
  schema,
}: UpdateAttributeFormProps) => {
  const queryClient = useQueryClient();

  const { isPending, error, data, isFetching } = useQuery({
    queryKey: [cacheKeys.attributes, attributeId],
    queryFn: () => getAttribute(attributeId),
  });

  const tableQuery = useQuery({
    queryKey: [cacheKeys.tables, tableId],
    queryFn: () => getTable(tableId),
  });

  const [values, setValues] = useState<any>({
    name: data?.name ?? '',
    type: data?.type ?? '',
    primary: data?.isPrimary ?? false,
    nullable: data?.isNullable ?? false,
    generated: data?.isGenerated ?? false,
    unique: data?.isUnique ?? false,
    foreign: data?.isForeign ?? false,
    'referenced-table': tableQuery.data?.id ?? '',
    'referenced-attribute': data?.references?.id ?? '',
    'relation-type': data?.relationType ?? '',
  });

  useEffect(() => {
    if (data) {
      setValues({
        name: data.name,
        type: data.type,
        primary: data.isPrimary,
        nullable: data.isNullable,
        generated: data.isGenerated,
        unique: data.isUnique,
        foreign: data.isForeign,
        'referenced-table': tableQuery.data?.id,
        'referenced-attribute': data.references?.id,
        'relation-type': data.relationType,
      });
    }
  }, [data, tableQuery.data]);

  const form = useForm({
    mode: 'uncontrolled',

    validate: {
      name: (value) =>
        values.name.length < 1
          ? 'Attribute name must have at least 1 letter'
          : null,
      type: (value) => {
        if (!values.type) {
          return 'Data type is required';
        }
      },

      primary: (value) => {},
      nullable: (value) => {},
      generated: (value) => {},
      unique: (value) => {},
      foreign: (value) => {},
      'referenced-table': (value) => {},
      'referenced-attribute': (value) => {},
      'relation-type': (value) => {},
    },
  });

  const tables = schema.tables;

  const mutation = useMutation({
    mutationFn: (attribute: any) => updateAttribute(attributeId, attribute),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [cacheKeys.schemas] });
      notifications.show({
        title: 'Success',
        message: 'Attribute updated successfully',
        color: 'blue',
      });
    },
  });

  if (isPending || isFetching) {
    return <div>Loading...</div>;
  }

  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={form.onSubmit((data) =>
        mutation.mutate({
          name: values.name,
          type: values.type,
          isPrimary: values.primary ?? false,
          isNullable: values.nullable ?? false,
          isGenerated: values.generated ?? false,
          isUnique: values.unique ?? values.primary ?? false,
          isForeign: values.foreign ?? false,
          references: values['referenced-attribute'],
          relationType: values['relation-type'],
          tableId,
        })
      )}
    >
      <TextInput
        label="Name"
        placeholder="Name"
        {...form.getInputProps('name')}
        key="name"
        value={values.name}
        onChange={(event) => {
          setValues((values: any) => ({ ...values, name: event.target.value }));
        }}
      />

      <Select
        searchable
        data={[
          'CHAR',
          'VARCHAR',
          'TEXT',
          'BOOLEAN',
          'TINYINT',
          'INTEGER',
          'BIGINT',
          'FLOAT',
          'DOUBLE',
          'DATE',
          'TIME',
          'TIMESTAMP',
        ]}
        nothingFoundMessage="Nothing found..."
        label="Data type"
        placeholder="Data type"
        {...form.getInputProps('type')}
        key="data-type"
        value={values.type}
        onChange={(event) => {
          setValues((values: any) => ({ ...values, type: event }));
        }}
      />

      {values.foreign && (
        <>
          <Select
            searchable
            data={tables.map((table: Table) => ({
              value: table.id,
              label: table.name,
            }))}
            nothingFoundMessage="Nothing found..."
            label="Referenced table"
            placeholder="Referenced table"
            {...form.getInputProps('referenced-table')}
            onChange={(event) => {
              {
                setValues((values: any) => ({
                  ...values,
                  'referenced-table': event,
                }));
              }
            }}
            key="referenced-table"
            value={values['referenced-table']}
          />

          <Select
            searchable
            data={schema.tables
              .filter((table: Table) => table.id === values['referenced-table'])
              .flatMap((table: Table) => table.attributes)
              .map((attribute: Attribute) => ({
                value: attribute.id,
                label: attribute.name,
              }))}
            nothingFoundMessage="Nothing found..."
            label="Referenced attribute"
            placeholder="Referenced attribute"
            {...form.getInputProps('referenced-attribute')}
            key="referenced-attribute"
            value={values['referenced-attribute']}
            onChange={(event) => {
              setValues((values: any) => ({
                ...values,
                'referenced-attribute': event,
              }));
            }}
          />

          <Select
            searchable
            data={['ONE_TO_ONE', 'MANY_TO_ONE']}
            nothingFoundMessage="Nothing found..."
            label="Relation type"
            placeholder="Relation type"
            {...form.getInputProps('relation-type')}
            key="relation-type"
            value={values['relation-type']}
            onChange={(event) => {
              setValues((values: any) => ({
                ...values,
                'relation-type': event,
              }));
            }}
          />
        </>
      )}

      <Grid>
        <Grid.Col span={6} className="flex flex-col gap-2">
          <Checkbox
            checked={values.primary}
            label="Primary"
            placeholder="Primary"
            {...form.getInputProps('primary', { type: 'checkbox' })}
            key="primary"
            onChange={(event) => {
              setValues((values: any) => ({
                ...values,
                primary: event.target.checked,
              }));
            }}
          />
          <Checkbox
            checked={values.nullable}
            label="Nullable"
            placeholder="Nullable"
            {...form.getInputProps('nullable', { type: 'checkbox' })}
            key="nullable"
            onChange={(event) => {
              setValues((values: any) => ({
                ...values,
                nullable: event.target.checked,
              }));
            }}
          />
          <Checkbox
            checked={values.generated}
            label="Generated"
            placeholder="Generated"
            {...form.getInputProps('generated', { type: 'checkbox' })}
            key="generated"
            onChange={(event) => {
              setValues((values: any) => ({
                ...values,
                generated: event.target.checked,
              }));
            }}
          />
        </Grid.Col>
        <Grid.Col span={6} className="flex flex-col gap-2">
          <Checkbox
            checked={values.unique}
            label="Unique"
            placeholder="Unique"
            {...form.getInputProps('unique', { type: 'checkbox' })}
            key="unique"
            onChange={(event) => {
              setValues((values: any) => ({
                ...values,
                unique: event.target.checked,
              }));
            }}
          />
          <Checkbox
            checked={values.foreign}
            label="Foreign"
            placeholder="Foreign"
            {...form.getInputProps('foreign', { type: 'checkbox' })}
            onChange={(event) => {
              setValues((values: any) => ({
                ...values,
                foreign: event.target.checked,
              }));
            }}
            key="foreign"
          />
        </Grid.Col>
      </Grid>

      <Button type="submit" mt="sm">
        Save
      </Button>
    </form>
  );
};
