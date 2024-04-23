'use client';

import { AppStore, makeStore } from '@/lib/store';
import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { Provider } from 'react-redux';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  const storeRef = useRef<AppStore>();

  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return (
    <MantineProvider>
      <QueryClientProvider client={queryClient}>
        <Provider store={storeRef.current}>{children}</Provider>
      </QueryClientProvider>
    </MantineProvider>
  );
}
