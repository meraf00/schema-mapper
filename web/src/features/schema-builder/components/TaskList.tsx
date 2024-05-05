'use client';

import { cacheKeys, getTasks } from '@/api';
import { Schema } from '@/lib/model/schema';
import { LoadingOverlay, Table } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

export const TaskList = () => {
  const route = usePathname();
  const {
    isFetching,
    isLoading,

    data: tasks,
  } = useQuery({
    queryKey: [cacheKeys.tasks],
    queryFn: getTasks,
  });

  console.log(tasks);

  return (
    <div className="relative overflow-auto max-h-80">
      <LoadingOverlay visible={isLoading || isFetching} />

      <Table stickyHeader striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Time</Table.Th>
            <Table.Th>Schemas</Table.Th>
            <Table.Th>Status</Table.Th>
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {tasks &&
            tasks
              .sort((a: any, b: any) => b.timestamp - a.timestamp)
              .map((task: any) => (
                <Table.Tr key={task.id}>
                  <Table.Td>
                    {`${new Date(task.timestamp).toLocaleTimeString()}
                      ${new Date(task.timestamp).toLocaleDateString()}`}
                  </Table.Td>
                  <Table.Td>
                    {task.data
                      .map((schema: Schema) => (
                        <Link
                          className="text-blue-500 hover:underline"
                          href={`${route}/${schema.id}`}
                        >
                          {schema.name}
                        </Link>
                      ))
                      .reduce((prev: any, curr: any) => [prev, ', ', curr])}
                  </Table.Td>
                  <Table.Td>
                    {task.failedReason ? (
                      <span className="text-red-500">Failed</span>
                    ) : task.returnvalue === null ? (
                      'Pending'
                    ) : (
                      <Link
                        href={`http://localhost:3001/generator/${task.id}/download`}
                        target="_blank"
                        className="text-blue-500 hover:underline"
                      >
                        Download
                      </Link>
                    )}
                  </Table.Td>
                </Table.Tr>
              ))}
        </Table.Tbody>
      </Table>
    </div>
  );
};
