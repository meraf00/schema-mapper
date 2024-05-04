'use client';

import { TabButton } from '@/components/TabButton';
import type { Metadata } from 'next';
import { useParams, usePathname } from 'next/navigation';
import { Case } from 'change-case-all';

const metadata: Metadata = {
  title: 'Schema Map',
  description: 'Generated typeorm from ER',
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const params = useParams();

  return (
    <section className="h-screen relative gap-3 overflow-auto">
      <nav className="flex items-center text-sm bg-blue-500 p-0 justify-between sticky top-0 z-30">
        <h1 className="text-xl text-white font-bold px-2">
          {Case.title((params['project-name'] as string) || '')}
        </h1>
        <div className="flex mt-2 gap-3 pb-0">
          <TabButton
            isActive={pathname.startsWith('/project/schemas')}
            href="/project/schemas"
          >
            Schemas
          </TabButton>
          <TabButton
            isActive={pathname.startsWith('/project/templates')}
            href="/project/templates"
          >
            Templates
          </TabButton>
        </div>
      </nav>
      <main>{children}</main>
    </section>
  );
}
