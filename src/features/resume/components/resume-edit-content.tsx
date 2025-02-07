'use client';

import { ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { EditResumeForm } from '@/features/resume/components/edit-resume-form';
import { ModeToggle } from '@/features/resume/components/mode-toggle';
import PdfRenderer from '@/features/resume/components/pdf-renderer';
import { TemplateSelection } from '@/features/resume/components/template-selection';
import { useTemplateStore } from '@/features/resume/store/use-template-store';
import {
  resumeEditFormSchema,
  TResumeEditFormValues
} from '@/features/resume/utils/form-schema';
import { Resume } from '@/server/db/schema/resumes';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

interface ResumeEditContentProps {
  resume: Resume;
}

export function ResumeEditContent({ resume }: ResumeEditContentProps) {
  const [mode, setMode] = useState<'edit' | 'template'>('edit');
  const {
    selectedTemplate,
    currentTemplate,
    setSelectedTemplate,
    applyTemplate
  } = useTemplateStore();

  useEffect(() => {
    if (mode === 'edit') {
      setSelectedTemplate(currentTemplate);
    }
  }, [mode, currentTemplate, setSelectedTemplate]);

  const initalData: TResumeEditFormValues = {
    resume_id: resume?.id || '',
    personal_details:
      resume?.personalDetails as TResumeEditFormValues['personal_details'],
    jobs: resume?.jobs as TResumeEditFormValues['jobs'],
    education: resume?.education as TResumeEditFormValues['education'],
    skills: resume?.skills as TResumeEditFormValues['skills'],
    tools: resume?.tools as TResumeEditFormValues['tools'],
    languages: resume?.languages as TResumeEditFormValues['languages']
  };

  const form = useForm<TResumeEditFormValues>({
    resolver: zodResolver(resumeEditFormSchema),
    defaultValues: initalData,
    mode: 'onChange',
    shouldFocusError: false
  });

  const formData = form.watch();

  const handleApplyTemplate = (templateId: string) => {
    applyTemplate(templateId);
    setMode('edit');
  };

  return (
    <div className='h-full p-4'>
      <ModeToggle mode={mode} onModeChange={setMode} />
      <ResizablePanelGroup
        direction='horizontal'
        className='h-full w-full rounded-lg border'
      >
        <ResizablePanel defaultSize={55}>
          <div className='h-full w-full p-8'>
            <ScrollArea className='h-[calc(100vh-200px)] pr-10'>
              {mode === 'edit' ? (
                <EditResumeForm resumeId={1} form={form} />
              ) : (
                <TemplateSelection
                  selectedTemplate={selectedTemplate}
                  onTemplateSelect={setSelectedTemplate}
                  onApplyTemplate={handleApplyTemplate}
                  currentTemplate={currentTemplate}
                />
              )}
            </ScrollArea>
          </div>
        </ResizablePanel>
        <ResizablePanel defaultSize={45} minSize={45}>
          <div className='relative flex h-full justify-center bg-[#D9D9D9]'>
            <div className='absolute left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2 scale-90'>
              <PdfRenderer
                key={JSON.stringify(formData)}
                formData={formData}
                templateId={selectedTemplate}
              />
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
