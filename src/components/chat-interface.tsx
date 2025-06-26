'use client';
import 'animate.css';
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo
} from 'react';
import PreChatModal from '@/app/chatbot/[id]/preChatModal';
import { useParams } from 'next/navigation';
import { useGetResume } from '@/features/resume/api';
import { ScrollArea } from '@/components/ui/scroll-area';
import PdfRenderer from '@/features/resume/components/pdf-renderer';
import {
  resumeEditFormSchema,
  TResumeEditFormValues
} from '@/features/resume/utils/form-schema';
import { useTemplateStore } from '@/features/resume/store/use-template-store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import Messages from './messages';
import { TemplateSelection } from '@/features/resume/components/template-selection';
import { EditResumeForm } from '@/features/resume/components/edit-resume-form';
import { ModeToggle } from '@/features/resume/components/mode-toggle';

export default function ChatInterface() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );

  const [mode, setMode] = useState<'edit' | 'template' | 'preview' | 'zen'>(
    'preview'
  );
  const params = useParams<{ id: string }>();
  const resumeId = params?.id;
  const { data: resume, isLoading } = useGetResume(resumeId);
  const {
    selectedTemplate,
    currentTemplate,
    setSelectedTemplate,
    applyTemplate
  } = useTemplateStore();

  const handleApplyTemplate = (templateId: string) => {
    applyTemplate(templateId);
    setMode('preview');
  };
  const [isOpen, setIsOpen] = useState(resumeId === '0' ? true : false);

  //form control
  const createInitialData = (resumeData: any): TResumeEditFormValues => ({
    resume_id: resumeData?.id || '',
    personal_details:
      resumeData?.personalDetails as TResumeEditFormValues['personal_details'],
    jobs: resumeData?.jobs as TResumeEditFormValues['jobs'],
    educations: resumeData?.education as TResumeEditFormValues['educations'],
    skills: resumeData?.skills as TResumeEditFormValues['skills'],
    tools: resumeData?.tools as TResumeEditFormValues['tools'],
    languages: resumeData?.languages as TResumeEditFormValues['languages']
  });

  const form = useForm<TResumeEditFormValues>({
    resolver: zodResolver(resumeEditFormSchema),
    defaultValues: createInitialData(null), // Start with empty defaults
    mode: 'onChange',
    shouldFocusError: false
  });

  // Reset form when resume data is loaded
  useEffect(() => {
    if (resume && !isLoading) {
      const newData = createInitialData(resume);
      console.log('Resetting form with resume data:', resume);
      console.log('New form data:', newData);
      form.reset(newData);
    }
  }, [resume, isLoading, form]);

  const formData = form.watch();

  const renderContent = () => {
    if (mode === 'edit') {
      return <EditResumeForm form={form} />;
    }
    if (mode === 'template') {
      return (
        <TemplateSelection
          selectedTemplate={selectedTemplate}
          onTemplateSelect={setSelectedTemplate}
          onApplyTemplate={handleApplyTemplate}
          currentTemplate={currentTemplate}
        />
      );
    }
    if (mode === 'preview') {
      return (
        <div className='relative flex h-full justify-center bg-accent pt-4'>
          <div className='origin-top scale-75'>
            <PdfRenderer formData={formData} templateId={selectedTemplate} />
          </div>
        </div>
      );
    }
  };
  return (
    <div className='flex h-full w-full flex-row'>
      <PreChatModal setIsOpen={setIsOpen} isOpen={isOpen} />

      <div className='h-full w-1/2 px-3'>
        <Messages />
      </div>
      <div className='h-full w-1/2'>
        <div>
          <ModeToggle
            mode={mode}
            onModeChange={setMode}
            isMobile={true}
            showExit={false}
          />
        </div>
        {/* <ScrollArea className='h-[calc(100vh)]'>
          <div className='relative flex h-full justify-center bg-accent pb-8'>
            <div className='scale-90'>
              {!isLoading && !isOpen && (
                <PdfRenderer
                  formData={formData}
                  templateId={selectedTemplate}
                />
              )}
            </div>
          </div> 
        </ScrollArea> */}

        <div className='block h-full px-2'>
          <div className='h-full w-full rounded-lg border'>
            <div className='h-full w-full p-4'>
              <ScrollArea className='h-[calc(100vh-150px)] pe-2'>
                {renderContent()}
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
