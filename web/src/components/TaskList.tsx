'use client';

import { cacheKeys, getTasks } from '@/api';
import { Table } from '@mantine/core';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import React, { useEffect } from 'react';

export interface TaskListProps {
  schemaId: string;
}

export const TaskList = ({ schemaId }: TaskListProps) => {
  const queryClient = useQueryClient();
  const { isPending, error, data, isFetching } = useQuery({
    queryKey: [cacheKeys.tasks, schemaId],
    queryFn: () => getTasks(),
  });

  useEffect(() => {
    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: [cacheKeys.tasks, schemaId] });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (data) {
    return (
      <div className="w-1/3">
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Timestamp</Table.Th>
              <Table.Th>Status</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {data
              .filter((job: any) => job.data.id === schemaId)
              .sort((a: any, b: any) => b.timestamp - a.timestamp)
              .slice(0, 1)
              .map((task: any) => (
                <Table.Tr key={task.id}>
                  <Table.Td>{task.timestamp}</Table.Td>
                  <Table.Td>
                    {task.returnvalue === null ? (
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
  } else {
    return <div>Loading...</div>;
  }
};
