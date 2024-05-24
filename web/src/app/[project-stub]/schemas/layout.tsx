'use client';

import { cacheKeys, getSchemas } from '@/api';
import { SchemaExplorer } from '@/features/schema-builder/components';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import React from 'react';

export default function SchemaLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const params = useParams();

  const {
    isPending,
    error,
    data: schemas,
    isFetching,
  } = useQuery({
    queryKey: [cacheKeys.schemas],
    queryFn: () => getSchemas(params['project-stub']! as string),
  });

  return (
    <section className="flex gap-5 sticky top-10 overflow-clip">
      <div className="w-1/5 overflow-auto">
        {schemas && <SchemaExplorer schemas={schemas} />}
      </div>
      <div
        className="w-full overflow-auto"
        style={{
          maxHeight: 'calc(100vh - 36px)',
        }}
      >
        {children}
      </div>
    </section>
  );
}
