'use client';

import { cacheKeys, createAttribute } from '@/api';
import { Attribute } from '@/lib/model/attribute';
import { Schema } from '@/lib/model/schema';

import { Table } from '@/lib/model/table';
import { Button, Checkbox, Grid, Select, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';

export interface CreateAttributeFormProps {
  schema: Schema;
  tableId: string;
  close: () => void;
}

export const CreateAttributeForm = ({
  tableId,
  schema,
  close,
}: CreateAttributeFormProps) => {
  const queryClient = useQueryClient();

  const form = useForm({
    mode: 'uncontrolled',

    validate: {
      name: (value) =>
        value.length < 1 ? 'Attribute name must have at least 1 letter' : null,
      type: (value) => {
        if (!value) {
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

  const [attributeDataTypes, setAttributeDataTypes] = useState('');
  const [relationTypes, setRelationTypes] = useState('');
  const [referenceTable, setReferenceTable] = useState('');
  const [referenceAttribute, setReferenceAttribute] = useState('');
  const [attribs, setAttribs] = useState<Attribute[]>([]);

  const [showRelation, setShowRelation] = useState(false);

  const mutation = useMutation({
    mutationFn: createAttribute,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [cacheKeys.schemas] });
      close();
    },
  });

  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={form.onSubmit((data) =>
        mutation.mutate({
          name: data.name,
          type: data.type,
          isPrimary: data.primary ?? false,
          isNullable: data.nullable ?? false,
          isGenerated: data.generated ?? false,
          isUnique: data.unique ?? data.primary ?? false,
          isForeign: data.foreign ?? false,
          tableId,
          references: data['referenced-table'],
        })
      )}
    >
      <TextInput
        label="Name"
        placeholder="Name"
        {...form.getInputProps('name')}
      />

      <Select
        searchable
        searchValue={attributeDataTypes}
        onSearchChange={setAttributeDataTypes}
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
      />

      {showRelation && (
        <>
          <Select
            searchable
            searchValue={referenceTable}
            onSearchChange={setReferenceTable}
            data={tables.map((table: Table) => ({
              value: table.id,
              label: table.name,
            }))}
            nothingFoundMessage="Nothing found..."
            label="Referenced table"
            placeholder="Referenced table"
            {...form.getInputProps('referenced-table')}
            onChange={(event) => {
              setAttribs(
                tables.find((table) => table.name === event)?.attributes || []
              );
            }}
          />

          <Select
            searchable
            searchValue={referenceAttribute}
            onSearchChange={setReferenceAttribute}
            data={attribs.map((attrib: Attribute) => ({
              value: attrib.id,
              label: attrib.name,
            }))}
            nothingFoundMessage="Nothing found..."
            label="Referenced attribute"
            placeholder="Referenced attribute"
            {...form.getInputProps('referenced-attribute')}
          />

          <Select
            searchable
            searchValue={relationTypes}
            onSearchChange={setRelationTypes}
            data={['ONE_TO_ONE', 'MANY_TO_ONE']}
            nothingFoundMessage="Nothing found..."
            label="Relation type"
            placeholder="Relation type"
            {...form.getInputProps('relation-type')}
          />
        </>
      )}

      <Grid>
        <Grid.Col span={6} className="flex flex-col gap-2">
          <Checkbox
            label="Primary"
            placeholder="Primary"
            {...form.getInputProps('primary')}
          />
          <Checkbox
            label="Nullable"
            placeholder="Nullable"
            {...form.getInputProps('nullable')}
          />
          <Checkbox
            label="Generated"
            placeholder="Generated"
            {...form.getInputProps('generated')}
          />
        </Grid.Col>
        <Grid.Col span={6} className="flex flex-col gap-2">
          <Checkbox
            label="Unique"
            placeholder="Unique"
            {...form.getInputProps('unique')}
          />
          <Checkbox
            label="Foreign"
            placeholder="Foreign"
            {...form.getInputProps('foreign')}
            onChange={(event) => {
              setShowRelation((showRelation) => !showRelation);
              if (form.getInputProps('foreign').onChange) {
                form.getInputProps('foreign').onChange(event);
              }
            }}
          />
        </Grid.Col>
      </Grid>

      <Button type="submit" mt="sm">
        Save
      </Button>
    </form>
  );
};
