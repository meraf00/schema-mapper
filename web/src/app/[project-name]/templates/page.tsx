'use client';

import TemplateForm from '@/features/template-builder/components/Forms/TemplateForm';
import { Tabs } from '@mantine/core';
import { useState } from 'react';

export default function Page() {
  const [activeTab, setActiveTab] = useState<string | null>('second');

  return (
    <main className="p-3">
      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="first">All</Tabs.Tab>
          <Tabs.Tab value="second">Create new</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="first" className="mt-3">
          test
        </Tabs.Panel>
        <Tabs.Panel value="second" className="mt-3">
          <TemplateForm onSubmit={() => {}} />
        </Tabs.Panel>
      </Tabs>
      {/* <div className="flex items-center justify-center w-full h-screen outline">
        <div className="w-1/3">
          <TemplateForm onSubmit={() => {}} />
        </div>
      </div> */}
    </main>
  );
}
