'use client';

import { cacheKeys, getSchemas } from '@/api';
import { SchemaExplorer } from '@/features/schema-builder/components';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

export default function SchemaLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { isPending, error, data, isFetching } = useQuery({
    queryKey: [cacheKeys.schemas],
    queryFn: getSchemas,
  });

  return (
    <section className="flex gap-5">
      <div className="w-1/5">{data && <SchemaExplorer schemas={data} />}</div>
      <div className="w-full">{children}</div>
    </section>
  );
}
