'use client';

import TemplateForm from '@/features/template-builder/components/Forms/TemplateForm';

export default function Page() {
  return (
    <div className="flex items-center justify-center w-full h-screen outline">
      <div className="w-1/3">
        <TemplateForm onSubmit={() => {}} />
      </div>
    </div>
  );
}
