// src/components/chat-interface.tsx
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
import { useForm, UseFormReturn } from 'react-hook-form';
import Messages from './messages';
import { TemplateSelection } from '@/features/resume/components/template-selection';
import { EditResumeForm } from '@/features/resume/components/edit-resume-form';
import { ModeToggle } from '@/features/resume/components/mode-toggle';

export default function ChatInterface() {
  const [guestResume, setGuestResume] = useState<any>({});
  const [mode, setMode] = useState<'edit' | 'template' | 'preview' | 'zen'>(
    'preview'
  );

  const params = useParams<{ id: string }>();
  const resumeId = params?.id;
  const isGuest = resumeId === 'guest';

  // Only call API if not guest
  const { data: resume, isLoading } = useGetResume(resumeId || '');

  const {
    selectedTemplate,
    currentTemplate,
    setSelectedTemplate,
    applyTemplate
  } = useTemplateStore();

  // Load guest resume from localStorage
  useEffect(() => {
    if (isGuest) {
      try {
        const storedGuestResume = localStorage.getItem('guestResume');
        if (storedGuestResume) {
          setGuestResume(JSON.parse(storedGuestResume));
        }
      } catch (error) {
        console.error('Error loading guest resume from localStorage:', error);
      }
    }
  }, [isGuest]);

  const handleApplyTemplate = useCallback(
    (templateId: string) => {
      applyTemplate(templateId);
      setMode('preview');
    },
    [applyTemplate]
  );

  const [isOpen, setIsOpen] = useState(resumeId === '0');

  // Form control
  const createInitialData = useCallback(
    (resumeData: any): TResumeEditFormValues => ({
      resume_id: resumeData?.id || '',
      personal_details: resumeData?.personalDetails || {
        resume_job_title: '',
        fname: '',
        lname: '',
        email: '',
        phone: '',
        country: '',
        city: '',
        summary: ''
      },
      jobs: resumeData?.jobs || [],
      educations: resumeData?.education || [],
      skills: resumeData?.skills || [],
      tools: resumeData?.tools || [],
      languages: resumeData?.languages || []
    }),
    []
  );

  const form: UseFormReturn<TResumeEditFormValues> =
    useForm<TResumeEditFormValues>({
      resolver: zodResolver(resumeEditFormSchema),
      defaultValues: createInitialData(null),
      mode: 'onChange',
      shouldFocusError: false
    });

  // Get the appropriate resume data based on whether it's guest or not
  const currentResume = isGuest ? guestResume : resume;
  const currentIsLoading = isGuest ? false : isLoading;

  // Reset form when resume data is loaded
  useEffect(() => {
    if (currentResume && !currentIsLoading) {
      const newData = isGuest
        ? (guestResume as TResumeEditFormValues)
        : createInitialData(currentResume);

      console.log('Resetting form with resume data:', currentResume);
      console.log('New form data:', newData);
      form.reset(newData);
    }
  }, [
    currentResume,
    currentIsLoading,
    form,
    guestResume,
    isGuest,
    createInitialData
  ]);

  const formData = form.watch();

  // Handle applying AI suggestions to the form
  const handleApplyChanges = useCallback(
    (changes: any[]) => {
      console.log('Applying changes:', changes);

      changes.forEach((change) => {
        const { section, action, index, data } = change;

        switch (action) {
          case 'update':
            if (
              typeof index === 'number' &&
              Array.isArray(formData[section as keyof typeof formData])
            ) {
              // Update specific array item
              const currentArray =
                (form.getValues(
                  section as keyof TResumeEditFormValues
                ) as any[]) || [];
              if (currentArray[index]) {
                currentArray[index] = { ...currentArray[index], ...data };
                form.setValue(
                  section as keyof TResumeEditFormValues,
                  currentArray as any
                );
              }
            } else {
              // Update entire section or object property
              if (section === 'personal_details') {
                const currentPersonalDetails =
                  form.getValues('personal_details') || {};
                form.setValue('personal_details', {
                  ...currentPersonalDetails,
                  ...data
                });
              } else {
                form.setValue(section as keyof TResumeEditFormValues, data);
              }
            }
            break;

          case 'add':
            if (Array.isArray(formData[section as keyof typeof formData])) {
              const currentArray =
                (form.getValues(
                  section as keyof TResumeEditFormValues
                ) as any[]) || [];
              form.setValue(
                section as keyof TResumeEditFormValues,
                [...currentArray, data] as any
              );
            }
            break;

          default:
            console.warn('Unknown action:', action);
        }
      });

      // If guest user, also update localStorage
      if (isGuest) {
        const updatedGuestResume = form.getValues();
        localStorage.setItem('guestResume', JSON.stringify(updatedGuestResume));
        setGuestResume(updatedGuestResume);
      }
    },
    [form, formData, isGuest]
  );

  const renderContent = useCallback(() => {
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
    return null;
  }, [
    mode,
    form,
    selectedTemplate,
    handleApplyTemplate,
    currentTemplate,
    formData
  ]);

  return (
    <div className='flex h-full w-full flex-row'>
      <PreChatModal setIsOpen={setIsOpen} isOpen={isOpen} />

      <div className='h-full w-1/2 px-3'>
        <Messages formData={formData} onApplyChanges={handleApplyChanges} />
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

        <div className='block h-full px-2'>
          <div className='h-full w-full rounded-lg border'>
            <div className='h-full w-full p-4'>
              <ScrollArea className='h-[calc(100vh-150px)] pe-2'>
                {!currentIsLoading && !isOpen && renderContent()}
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
