'use client';

import {
  AttributeData,
  cacheKeys,
  deleteAttribute,
  getAttribute,
  getSchema,
  updateAttribute,
} from '@/api';
import AttributeForm, {
  AttributeFormData,
} from '@/features/schema-builder/components/Forms/AttributeForm';
import { Button, LoadingOverlay } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import React from 'react';

export default function AttributePage() {
  const queryClient = useQueryClient();
  const params = useParams();

  const {
    isLoading,
    error,
    data: attribute,
  } = useQuery({
    queryKey: [cacheKeys.attributes, params['attribute-id']],
    queryFn: () => getAttribute(params['attribute-id'] as string),
  });

  const { data: schema } = useQuery({
    queryKey: [cacheKeys.schemas, params['schema-id']],
    queryFn: () => getSchema(params['schema-id'] as string),
    enabled: !!attribute,
  });

  const updateAttributeMutation = useMutation({
    mutationFn: (data: { id: string; attribute: AttributeData }) =>
      updateAttribute(data.id, data.attribute),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [cacheKeys.attributes] });
      queryClient.invalidateQueries({ queryKey: [cacheKeys.tables] });
      queryClient.invalidateQueries({ queryKey: [cacheKeys.schemas] });

      notifications.show({
        title: 'Success',
        message: 'Attribute updated successfully',
        color: 'blue',
      });
    },
  });

  const deleteAttributeMutation = useMutation({
    mutationFn: deleteAttribute,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [cacheKeys.schemas] });
      notifications.show({
        title: 'Success',
        message: 'Attribute deleted successfully',
        color: 'blue',
      });
    },
  });

  const handleAttributeUpdate = (data: AttributeFormData) => {
    console.log(data);
    updateAttributeMutation.mutate({
      id: params['attribute-id'] as string,
      attribute: {
        name: data.name,
        type: data.type,
        isNullable: data.isNullable === 'true',
        isUnique: data.isUnique === 'true',
        isPrimary: data.isPrimary === 'true',
        isForeign: data.isForeign === 'true',
        isGenerated: data.isGenerated === 'true',
        relationType: data.relationType ?? undefined,
        references: data.references ?? undefined,
        backref: data.backref ?? undefined,
      },
    });
  };

  const handleAttributeDelete = () => {
    deleteAttributeMutation.mutate(params['attribute-id'] as string);
  };

  return (
    <div className="relative w-full px-3 py-5">
      {isLoading && <LoadingOverlay visible loaderProps={{ type: 'bars' }} />}
      <div className="flex justify-between">
        <h1 className="font-bold text-xl pb-3 pt-1">Update Attribute</h1>
        <div className="flex gap-3">
          <Button bg="red" onClick={handleAttributeDelete}>
            Delete Attribute
          </Button>
        </div>
      </div>
      <div className="w-1/3 pb-5">
        {schema && attribute && (
          <AttributeForm
            tables={schema.tables}
            attribute={attribute}
            onSubmit={handleAttributeUpdate}
          />
        )}
      </div>
    </div>
  );
}
