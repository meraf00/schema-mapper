'use client';

import StructureBuilder from '@/features/generator/components/Builder/StructureBuilder';
import { GeneratorStepper } from '@/features/generator/components/Stepper/GeneratorStepper';
import { GeneratedContent } from '@/lib/model/template';
import { Tabs } from '@mantine/core';
import { useState } from 'react';

export default function Page() {
  const [activeTab, setActiveTab] = useState<string | null>('new');

  return (
    <main className="p-3">
      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="tasks">Tasks</Tabs.Tab>
          <Tabs.Tab value="new">Generate new</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="tasks" className="mt-3">
          <StructureBuilder
            generated={[new GeneratedContent('TodoEntity', 'todo')]}
          />
        </Tabs.Panel>
        <Tabs.Panel value="new" className="mt-3">
          <GeneratorStepper />
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
