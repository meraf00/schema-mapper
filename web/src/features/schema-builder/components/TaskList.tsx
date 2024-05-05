'use client';

import { cacheKeys, getTasks } from '@/api';
import { Schema } from '@/lib/model/schema';
import { LoadingOverlay, Table } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useMemo, useRef, useState } from 'react';

export const TaskList = () => {
  const route = usePathname();
  const { isFetching, isLoading, data } = useQuery({
    queryKey: [cacheKeys.tasks],
    queryFn: getTasks,
  });

  const [completedJob, setCompletedJob] = useState<any>(null);
  const [tasks, setTasks] = useState<any>(null);

  const [ws, setWS] = useState<WebSocket | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!wsRef.current || wsRef.current.readyState === WebSocket.CLOSED) {
      const ws = new WebSocket('ws://localhost:8080');
      ws.onopen = () => {
        console.log('WebSocket Client Connected');
      };

      ws.onmessage = (message) => {
        setCompletedJob(JSON.parse(message.data));
      };

      ws.onclose = () => {
        console.log('WebSocket Client Disconnected');
      };

      wsRef.current = ws;
      setWS(ws);
    }

    return () => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    setTasks(data);
  }, [data]);

  useEffect(() => {
    if (completedJob) {
      setTasks((prevTasks: any) => {
        const newTasks = [...prevTasks];
        const index = newTasks.findIndex(
          (task: any) => task.id === completedJob.id
        );
        newTasks[index] = completedJob;
        return newTasks;
      });
    }
  }, [completedJob]);

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
              .map((task: any) => {
                return (
                  <Table.Tr key={task.id}>
                    <Table.Td>
                      {`${new Date(task.timestamp).toLocaleTimeString()}
                      ${new Date(task.timestamp).toLocaleDateString()}`}
                    </Table.Td>
                    <Table.Td>
                      {task.data
                        .map((schema: Schema) => (
                          <Link
                            key={schema.id}
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
                );
              })}
        </Table.Tbody>
      </Table>
    </div>
  );
};
