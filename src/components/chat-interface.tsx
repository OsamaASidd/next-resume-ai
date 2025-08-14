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
import { Icons } from '@/components/icons';
import {
  validateResumeChanges,
  ResumeChange,
  summarizeChanges
} from '@/utils/resume-changes';

export default function ChatInterface() {
  const [guestResume, setGuestResume] = useState<any>({});
  const [mode, setMode] = useState<'edit' | 'template' | 'preview' | 'zen'>(
    'preview'
  );
  const [showPreview, setShowPreview] = useState(true);

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
      if (!isGuest) {
        applyTemplate(currentResume.templateId ?? 'template-one');
      }
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

  const handleApplyChanges = useCallback(
    (changes: any[]) => {
      console.log('Applying changes:', changes);

      // Validate changes using utility function
      const validChanges = validateResumeChanges(changes);

      if (validChanges.length === 0) {
        console.warn('No valid changes to apply');
        return;
      }

      if (validChanges.length !== changes.length) {
        console.warn(
          `${changes.length - validChanges.length} invalid changes were filtered out`
        );
      }

      let hasChanges = false;

      validChanges.forEach((change: ResumeChange, changeIndex) => {
        try {
          const { section, action, index, data } = change;

          switch (action) {
            case 'update':
              if (section === 'personal_details') {
                // Handle personal details update
                const currentPersonalDetails =
                  form.getValues('personal_details') || {};
                const updatedPersonalDetails = {
                  ...currentPersonalDetails,
                  ...data
                };
                form.setValue('personal_details', updatedPersonalDetails);
                hasChanges = true;
              } else {
                // Handle array sections (jobs, educations, skills, tools, languages)
                const currentArray =
                  (form.getValues(
                    section as keyof TResumeEditFormValues
                  ) as any[]) || [];

                if (typeof index === 'number') {
                  // Update specific array item
                  if (index >= 0 && index < currentArray.length) {
                    const updatedArray = [...currentArray];
                    updatedArray[index] = { ...updatedArray[index], ...data };
                    form.setValue(
                      section as keyof TResumeEditFormValues,
                      updatedArray as any
                    );
                    hasChanges = true;
                  } else {
                    console.warn(
                      `Invalid index ${index} for section ${section} with length ${currentArray.length}`
                    );
                  }
                } else {
                  // Replace entire array
                  form.setValue(
                    section as keyof TResumeEditFormValues,
                    data as any
                  );
                  hasChanges = true;
                }
              }
              break;

            case 'add':
              if (section === 'personal_details') {
                console.warn('Cannot add to personal_details section');
                return;
              }

              // Handle adding to array sections
              const currentArray =
                (form.getValues(
                  section as keyof TResumeEditFormValues
                ) as any[]) || [];
              const updatedArray = [...currentArray, data];
              form.setValue(
                section as keyof TResumeEditFormValues,
                updatedArray as any
              );
              hasChanges = true;
              break;

            case 'remove':
              if (section === 'personal_details') {
                console.warn('Cannot remove from personal_details section');
                return;
              }

              // Handle removing from array sections
              const arrayToRemoveFrom =
                (form.getValues(
                  section as keyof TResumeEditFormValues
                ) as any[]) || [];

              if (typeof index === 'number') {
                // Remove specific item by index
                if (index >= 0 && index < arrayToRemoveFrom.length) {
                  const updatedArray = arrayToRemoveFrom.filter(
                    (_, i) => i !== index
                  );
                  form.setValue(
                    section as keyof TResumeEditFormValues,
                    updatedArray as any
                  );
                  hasChanges = true;
                } else {
                  console.warn(
                    `Invalid remove index ${index} for section ${section} with length ${arrayToRemoveFrom.length}`
                  );
                }
              } else if (data) {
                // Remove item by matching criteria
                const updatedArray = arrayToRemoveFrom.filter((item) => {
                  return !Object.keys(data).every(
                    (key) => item[key] === data[key]
                  );
                });
                if (updatedArray.length !== arrayToRemoveFrom.length) {
                  form.setValue(
                    section as keyof TResumeEditFormValues,
                    updatedArray as any
                  );
                  hasChanges = true;
                } else {
                  console.warn('No matching items found to remove');
                }
              } else {
                console.warn(
                  'Remove action requires either index or data criteria'
                );
              }
              break;

            default:
              console.warn(`Unknown action: ${action}`);
          }
        } catch (error) {
          console.error(
            `Error applying change at index ${changeIndex}:`,
            error,
            change
          );
        }
      });

      // Trigger form validation and re-render
      if (hasChanges) {
        form.trigger();

        // If guest user, also update localStorage
        if (isGuest) {
          try {
            const updatedGuestResume = form.getValues();
            localStorage.setItem(
              'guestResume',
              JSON.stringify(updatedGuestResume)
            );
            setGuestResume(updatedGuestResume);
          } catch (error) {
            console.error('Error updating localStorage:', error);
          }
        }
      }
    },
    [form, isGuest, setGuestResume]
  );

  // Handle applying AI suggestions to the form
  // const handleApplyChanges = useCallback(
  //   (changes: any[]) => {
  //     console.log('Applying changes:', changes);

  //     changes.forEach((change) => {
  //       const { section, action, index, data } = change;

  //       switch (action) {
  //         case 'update':
  //           if (
  //             typeof index === 'number' &&
  //             Array.isArray(formData[section as keyof typeof formData])
  //           ) {
  //             // Update specific array item
  //             const currentArray =
  //               (form.getValues(
  //                 section as keyof TResumeEditFormValues
  //               ) as any[]) || [];
  //             if (currentArray[index]) {
  //               currentArray[index] = { ...currentArray[index], ...data };
  //               form.setValue(
  //                 section as keyof TResumeEditFormValues,
  //                 currentArray as any
  //               );
  //             }
  //           } else {
  //             // Update entire section or object property
  //             if (section === 'personal_details') {
  //               const currentPersonalDetails =
  //                 form.getValues('personal_details') || {};
  //               form.setValue('personal_details', {
  //                 ...currentPersonalDetails,
  //                 ...data
  //               });
  //             } else {
  //               form.setValue(section as keyof TResumeEditFormValues, data);
  //             }
  //           }
  //           break;

  //         case 'add':
  //           if (Array.isArray(formData[section as keyof typeof formData])) {
  //             const currentArray =
  //               (form.getValues(
  //                 section as keyof TResumeEditFormValues
  //               ) as any[]) || [];
  //             form.setValue(
  //               section as keyof TResumeEditFormValues,
  //               [...currentArray, data] as any
  //             );
  //           }
  //           break;

  //         default:
  //           console.warn('Unknown action:', action);
  //       }
  //     });

  //     // If guest user, also update localStorage
  //     if (isGuest) {
  //       const updatedGuestResume = form.getValues();
  //       localStorage.setItem('guestResume', JSON.stringify(updatedGuestResume));
  //       setGuestResume(updatedGuestResume);
  //     }
  //   },
  //   [form, formData, isGuest]
  // );

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
        <div className='relative mx-auto flex h-screen w-[90vw] justify-center bg-accent py-4 md:w-full'>
          <div className='origin-top scale-[47%] md:scale-75'>
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
    <div className='flex h-full w-full flex-col md:flex-row'>
      <PreChatModal setIsOpen={setIsOpen} isOpen={isOpen} />

      {/* Chat/Messaging Section - Primary on mobile */}
      <div
        className={`h-full w-full px-3 ${showPreview ? 'hidden md:block md:w-1/2' : 'md:w-1/2'}`}
      >
        {/* Add top padding and safe area for mobile */}
        <div className='mb-2 mt-4 flex items-center justify-end md:mt-0 md:hidden'>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className='rounded-md bg-primary px-3 py-2 text-xs text-primary-foreground'
          >
            Preview
          </button>
        </div>
        <Messages formData={formData} onApplyChanges={handleApplyChanges} />
      </div>

      {/* Preview Section - Secondary on mobile */}
      <div
        className={`h-full w-full md:w-1/2 ${showPreview ? 'block' : 'hidden md:block'}`}
      >
        {/* Add top padding and safe area for mobile */}
        <div className='mx-2 mb-2 mt-4 flex items-center justify-between'>
          <ModeToggle
            mode={mode}
            onModeChange={setMode}
            isMobile={true}
            showExit={false}
          />
          <button
            onClick={() => setShowPreview(!showPreview)}
            className='mb-4 flex items-center rounded-md bg-secondary px-3 py-2 text-sm text-secondary-foreground md:hidden'
          >
            <Icons.chevronLeft className='mr-2 h-4 w-4' />
            <div>Exit</div>
          </button>
        </div>

        <div className='block h-full px-2'>
          <div className='h-full w-full rounded-lg border'>
            <div className='h-full w-full p-2 md:p-4'>
              {/* Adjust ScrollArea height to account for the button spacing */}
              <ScrollArea className='h-[calc(100vh-140px)] md:h-[calc(100vh-150px)] md:pe-2'>
                {!currentIsLoading && !isOpen && renderContent()}
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
