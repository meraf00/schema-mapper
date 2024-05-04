'use client';

import { cacheKeys, getAttribute } from '@/api';
import { LoadingOverlay } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import React from 'react';

export default function AttributePage() {
  const params = useParams();

  const { isLoading, error, data } = useQuery({
    queryKey: [cacheKeys.attributes, params['attribute-id']],
    queryFn: () => getAttribute(params['attribute-id'] as string),
  });

  return (
    <div className="relative w-full">
      {isLoading && <LoadingOverlay visible loaderProps={{ type: 'bars' }} />}
      {data && <>{data.name}</>}
    </div>
  );
}
