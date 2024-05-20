import { useState } from 'react';
import { Stepper, Button, Group } from '@mantine/core';
import GeneratorForm, {
  GenerateCodeFormData,
} from '@/features/schema-builder/components/Forms/GeneratorForm';
import StructureBuilder from '../Builder/StructureBuilder';
import { GeneratedContent, getGeneratedContents } from '@/lib/model/template';
import { notifications } from '@mantine/notifications';
import { Schema } from '@/lib/model/schema';

export function GeneratorStepper() {
  const [active, setActive] = useState(0);
  const nextStep = () =>
    setActive((current) => (current < 2 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const [generatedContents, setGeneratedContents] = useState<
    GeneratedContent[]
  >([]);

  const handleGeneratorSubmit = (schemas: Schema[]) => {
    if (schemas?.length === 0) {
      return notifications.show({
        title: 'Error',
        message: 'At least one schema must be selected.',
        color: 'red',
      });
    }

    setGeneratedContents(getGeneratedContents(schemas));

    nextStep();
  };

  console.log(generatedContents);

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
          <GeneratorForm onSubmit={handleGeneratorSubmit} />
        </div>
      )}
      {active === 1 && (
        <div className="w-full my-10">
          <StructureBuilder generated={generatedContents} />
        </div>
      )}

      <Group justify="center" mt="xl">
        {active === 1 && (
          <>
            <Button variant="default" onClick={prevStep}>
              Back
            </Button>

            <Button onClick={nextStep}>Generate!</Button>
          </>
        )}
      </Group>
    </div>
  );
}
