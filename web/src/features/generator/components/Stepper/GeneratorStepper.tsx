'use client';
import { useState } from 'react';
import { Stepper } from '@mantine/core';
import GeneratorForm from '@/features/schema-builder/components/Forms/GeneratorForm';
import StructureBuilder from '../Builder/StructureBuilder';
import {
  FileType,
  GeneratedContent,
  getGeneratedContents,
} from '@/lib/model/template';
import { notifications } from '@mantine/notifications';
import { Schema } from '@/lib/model/schema';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cacheKeys, createGenerateCodeTask } from '@/api';
import { useParams } from 'next/navigation';

export function GeneratorStepper() {
  const params = useParams();

  const [active, setActive] = useState(0);
  const nextStep = () =>
    setActive((current) => (current < 2 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const [generatedContents, setGeneratedContents] = useState<
    GeneratedContent[]
  >([]);

  const [schemaIds, setSchemaIds] = useState<string[]>([]);

  const queryClient = useQueryClient();

  const generateCodeMutation = useMutation({
    mutationFn: (data: any) => {
      return createGenerateCodeTask(data.schemas, data.pathMaps, data.paths);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [cacheKeys.tasks] });
      notifications.show({
        title: 'Success',
        message: 'Code generation task added successfully',
      });
      nextStep();
    },
  });

  const handleSchemaSelect = (schemas: Schema[]) => {
    if (schemas?.length === 0) {
      return notifications.show({
        title: 'Error',
        message: 'At least one schema must be selected.',
        color: 'red',
      });
    }

    setGeneratedContents(getGeneratedContents(schemas));
    setSchemaIds(schemas.map((schema) => schema.id));

    nextStep();
  };

  const handleGenerate = (
    pathMap: {
      [key: string]: {
        type: FileType;
        path: string;
      };
    },
    paths: {
      type: FileType;
      path: string;
    }[]
  ) => {
    generateCodeMutation.mutate({
      schemas: schemaIds,
      pathMaps: pathMap,
      paths,
    });
  };

  return (
    <div className="py-5 w-full">
      <div className="mx-auto w-1/2">
        <Stepper active={active} onStepClick={setActive}>
          <Stepper.Step label="First step" description="Select schemas" />

          <Stepper.Step label="Second step" description="Folder structure" />

          <Stepper.Completed>
            <div className="w-full flex justify-center m-auto p-10">
              Task added successfully.
            </div>
          </Stepper.Completed>
        </Stepper>
      </div>

      {active === 0 && (
        <div className="w-full flex justify-center my-10">
          <GeneratorForm
            projectStub={params['project-stub'] as string}
            onSubmit={handleSchemaSelect}
          />
        </div>
      )}
      {active === 1 && (
        <div className="w-full my-10">
          <StructureBuilder
            generated={generatedContents}
            prevStep={prevStep}
            onSubmit={handleGenerate}
          />
        </div>
      )}
    </div>
  );
}
