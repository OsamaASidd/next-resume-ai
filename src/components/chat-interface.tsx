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

export default function ChatInterface() {
  const params = useParams<{ id: string }>();
  const resumeId = params?.id;
  const { data: resume, isLoading } = useGetResume(resumeId);
  const {
    selectedTemplate,
    currentTemplate,
    setSelectedTemplate,
    applyTemplate
  } = useTemplateStore();
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );
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

  return (
    <div className='flex h-full w-full flex-row'>
      <PreChatModal setIsOpen={setIsOpen} isOpen={isOpen} />

      <div className='border-r border-secondary'></div>
      <Messages />
      <div className='h-full w-3/6'>
        <ScrollArea className='h-[calc(100vh)]'>
          <div className='relative flex h-full justify-center bg-accent pb-8'>
            <div className='scale-90'>
              {!isLoading && (
                <PdfRenderer
                  formData={formData}
                  templateId={selectedTemplate}
                />
              )}
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
