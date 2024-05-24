import { TaskList } from '@/features/schema-builder/components/TaskList';

import React from 'react';

export default function GenerateCodePage() {
  return (
    <div className="flex flex-col gap-10 mb-10">
      <div>
        <h1 className="font-bold text-xl pb-3 pt-1">Generated Codes</h1>

        <TaskList />
      </div>
    </div>
  );
}
