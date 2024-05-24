'use client';

import { TabButton } from '@/components/TabButton';
import type { Metadata } from 'next';
import { useParams, usePathname } from 'next/navigation';
import { Case } from 'change-case-all';
import Link from 'next/link';

const metadata: Metadata = {
  title: 'Schema Map',
  description: 'Generate Functioning NestJS Server!',
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
        <Link href={`/${params['project-stub']}/schemas`}>
          <h1 className="text-xl text-white font-bold px-2">
            {Case.title((params['project-stub'] as string) || '')}
          </h1>
        </Link>
        <div className="flex mt-2 gap-3 pb-0">
          <TabButton
            isActive={pathname.startsWith(`/${params['project-stub']}/schemas`)}
            href={`/${params['project-stub']}/schemas`}
          >
            Schemas
          </TabButton>
          <TabButton
            isActive={pathname.startsWith(
              `/${params['project-stub']}/generator`
            )}
            href={`/${params['project-stub']}/generator`}
          >
            Code Generator
          </TabButton>
        </div>
      </nav>
      <main>{children}</main>
    </section>
  );
}
