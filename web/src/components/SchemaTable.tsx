import { cacheKeys, generateCode } from '@/api';
import { Schema } from '@/lib/model/schema';
import { Table as T } from '@/lib/model/table';
import { Button, Table } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

export interface SchemaTableProps {
  schema: Schema;
}

export const SchemaTable = ({ schema }: SchemaTableProps) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => generateCode(schema.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [cacheKeys.tasks] });
      notifications.show({
        title: 'Success',
        message: 'Task added to queue.',
        color: 'blue',
      });
    },
  });

  const attribMap = schema.tables.reduce((tacc, table) => {
    return table.attributes.reduce((acc, attrib) => {
      acc.set(attrib.id, table);
      return acc;
    }, tacc);
  }, new Map<string, T>());

  const relations = schema.tables.flatMap((table) => {
    return table.attributes
      .filter((attrib) => attrib.isForeign)
      .map((attrib) => {
        const refTable = attribMap.get(attrib.references!.id!);
        return (
          <Table.Tr key={attrib.id}>
            <Table.Td>
              {table.name} ({attrib.name})
            </Table.Td>
            <Table.Td>
              {refTable?.name} ({attrib.references!.name})
            </Table.Td>
            <Table.Td>{attrib.relationType}</Table.Td>
            <Table.Td>{attrib.type}</Table.Td>
          </Table.Tr>
        );
      });
  });

  return (
    <div className="w-2/3 flex flex-col mt-10 mb-5">
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Attrib 1</Table.Th>
            <Table.Th>Attrib 2</Table.Th>
            <Table.Th>Relation</Table.Th>
            <Table.Th>Type</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{relations}</Table.Tbody>
      </Table>

      <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
        Generate Code
      </Button>
    </div>
  );
};
