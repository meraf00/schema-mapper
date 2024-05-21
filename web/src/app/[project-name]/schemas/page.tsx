'use client';

import { cacheKeys, generateCode } from '@/api';
import GeneratorForm, {
  GenerateCodeFormData,
} from '@/features/schema-builder/components/Forms/GeneratorForm';
import { TaskList } from '@/features/schema-builder/components/TaskList';

import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react';

export default function GenerateCodePage() {
  const queryClient = useQueryClient();

  const generateCodeMutation = useMutation({
    mutationFn: generateCode,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [cacheKeys.tasks] });
      notifications.show({
        title: 'Success',
        message: 'Code generation task added successfully',
      });
    },
  });

  const handleGenerateCode = (data: GenerateCodeFormData) => {
    if (data.schemas) {
      generateCodeMutation.mutate(data.schemas);
    } else {
      notifications.show({
        title: 'Error',
        color: 'red',
        message: 'Please select at least one schema',
      });
    }
  };

  return (
    <div className="flex flex-col gap-10 mb-10">
      <div>
        <h1 className="font-bold text-xl pb-3 pt-1">Generate Code</h1>
        {/* <GeneratorForm onSubmit={handleGenerateCode} /> */}
      </div>

      <div>
        <h1 className="font-bold text-xl pb-3 pt-1">Generated</h1>
        <TaskList />
      </div>
    </div>
  );
}
