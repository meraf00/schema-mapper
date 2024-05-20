import { Button, Checkbox, Grid, Select, TextInput } from '@mantine/core';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useEffect, useMemo, useState } from 'react';
import { Attribute, AttributeType, RelationType } from '@/lib/model/attribute';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Table } from '@/lib/model/table';

export interface AttributeFormProps {
  tables: Table[];
  attribute?: Attribute;
  onSubmit: SubmitHandler<AttributeFormData>;
}

type Boolean = 'true' | 'false';

export type AttributeFormData = {
  name: string;
  type: AttributeType;
  isNullable?: Boolean;
  isUnique?: Boolean;
  isPrimary?: Boolean;
  isForeign?: Boolean;
  isGenerated?: Boolean;
  relationType?: RelationType;
  references?: string;
  backref?: string;
  referencedTable?: string;
};

const attributeFormData = yup
  .object({
    name: yup.string().required(),
    type: yup
      .mixed<AttributeType>()
      .oneOf(Object.values(AttributeType))
      .required(),
    isNullable: yup.mixed<Boolean>().oneOf(['true', 'false']),
    isUnique: yup.mixed<Boolean>().oneOf(['true', 'false']),
    isPrimary: yup.mixed<Boolean>().oneOf(['true', 'false']),
    isForeign: yup.mixed<Boolean>().oneOf(['true', 'false']),
    isGenerated: yup.mixed<Boolean>().oneOf(['true', 'false']),
    relationType: yup.mixed<RelationType>().oneOf(Object.values(RelationType)),
    references: yup.string(),
    backref: yup.string(),
    referencedTable: yup.string(),
  })
  .required();

const attributeToForm = (
  attribute: Attribute | undefined
): AttributeFormData => ({
  name: attribute?.name ?? '',
  type: attribute?.type ?? AttributeType.VARCHAR,
  isNullable: attribute?.isNullable ? 'true' : 'false',
  isUnique: attribute?.isUnique ? 'true' : 'false',
  isPrimary: attribute?.isPrimary ? 'true' : 'false',
  isForeign: attribute?.isForeign ? 'true' : 'false',
  isGenerated: attribute?.isGenerated ? 'true' : 'false',
  relationType: attribute?.relationType,
  references: attribute?.references?.id,
  backref: attribute?.backref,
  referencedTable: attribute?.references?.tableId,
});

export default function AttributeForm({
  attribute,
  tables,
  onSubmit,
}: AttributeFormProps) {
  const {
    control,
    reset,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<AttributeFormData>({
    resolver: yupResolver(attributeFormData),
    defaultValues: useMemo(() => attributeToForm(attribute), [attribute]),
  });

  const [isForeign, setIsForeign] = useState(false);

  const getTableAttribs = (tableId: string) => {
    return tables
      .filter((table: Table) => table.id === tableId)
      .flatMap((table: Table) => table.attributes)
      .map((attribute: Attribute) => ({
        value: attribute.id,
        label: attribute.name,
      }));
  };

  const [referencedTableAttributes, setReferencedTableAttributes] = useState(
    getTableAttribs(getValues().referencedTable ?? '')
  );

  useEffect(() => {
    reset(attributeToForm(attribute));
    setIsForeign(attribute?.isForeign ?? false);
  }, [attribute, reset]);

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <TextInput label="Name" placeholder="Name" {...field} required />
        )}
      />

      <Controller
        name="type"
        control={control}
        render={({ field }) => (
          <Select
            searchable
            data={Object.values(AttributeType)}
            nothingFoundMessage="Nothing found..."
            label="Data type"
            placeholder="Data type"
            {...field}
            required
          />
        )}
      />

      {isForeign && (
        <>
          <Controller
            name="referencedTable"
            control={control}
            render={({ field }) => (
              <Select
                searchable
                data={tables.map((table: Table) => ({
                  value: table.id,
                  label: table.name,
                }))}
                nothingFoundMessage="Nothing found..."
                label="Referenced table"
                placeholder="Referenced table"
                {...field}
                onChange={(event) => {
                  setValue('referencedTable', event ?? '');
                  setReferencedTableAttributes(getTableAttribs(event ?? ''));
                }}
                required
              />
            )}
          />

          <Controller
            name="references"
            control={control}
            render={({ field }) => (
              <Select
                searchable
                data={referencedTableAttributes}
                nothingFoundMessage="Nothing found..."
                label="References"
                placeholder="References"
                {...field}
                required
              />
            )}
          />

          <Controller
            name="relationType"
            control={control}
            render={({ field }) => (
              <Select
                searchable
                data={Object.values(RelationType)}
                nothingFoundMessage="Nothing found..."
                label="Relation type"
                placeholder="Relation type"
                {...field}
                required
              />
            )}
          />

          <Controller
            name="backref"
            control={control}
            render={({ field }) => (
              <TextInput label="Backref" placeholder="Backref" {...field} />
            )}
          />
        </>
      )}

      <Grid>
        <Grid.Col span={6} className="flex flex-col gap-2">
          <Controller
            name="isPrimary"
            control={control}
            render={({ field }) => (
              <Checkbox
                checked={field.value === 'true'}
                label="Primary"
                placeholder="Primary"
                {...field}
                onChange={(event) => {
                  setValue(
                    'isPrimary',
                    event.target.checked ? 'true' : 'false'
                  );
                }}
              />
            )}
          />

          <Controller
            name="isGenerated"
            control={control}
            render={({ field }) => (
              <Checkbox
                checked={field.value === 'true'}
                label="Generated"
                placeholder="Generated"
                {...field}
                onChange={(event) => {
                  setValue(
                    'isGenerated',
                    event.target.checked ? 'true' : 'false'
                  );
                }}
              />
            )}
          />

          <Controller
            name="isNullable"
            control={control}
            render={({ field }) => (
              <Checkbox
                checked={field.value === 'true'}
                label="Nullable"
                placeholder="Nullable"
                {...field}
                onChange={(event) => {
                  setValue(
                    'isNullable',
                    event.target.checked ? 'true' : 'false'
                  );
                }}
              />
            )}
          />
        </Grid.Col>

        <Grid.Col span={6} className="flex flex-col gap-2">
          <Controller
            name="isUnique"
            control={control}
            render={({ field }) => (
              <Checkbox
                checked={field.value === 'true'}
                label="Unique"
                placeholder="Unique"
                {...field}
                onChange={(event) => {
                  setValue('isUnique', event.target.checked ? 'true' : 'false');
                }}
              />
            )}
          />

          <Controller
            name="isForeign"
            control={control}
            render={({ field }) => (
              <Checkbox
                checked={field.value === 'true'}
                label="Foreign"
                placeholder="Foreign"
                {...field}
                onChange={(event) => {
                  setValue(
                    'isForeign',
                    event.target.checked ? 'true' : 'false'
                  );
                  setIsForeign(event.target.checked);
                }}
              />
            )}
          />
        </Grid.Col>
      </Grid>

      <Button type="submit" mt="sm">
        Save
      </Button>
    </form>
  );
}
