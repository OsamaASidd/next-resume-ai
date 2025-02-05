'use client';
import PageContainer from '@/components/layout/page-container';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle
} from '@/components/ui/resizable';
import { EditResumeForm } from '@/features/resume/components/edit-resume-form';
import PdfRenderer from '@/features/resume/components/pdf-renderer';
import {
  resumeEditFormSchema,
  TResumeEditFormValues
} from '@/features/resume/utils/form-schema';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { TemplateSelection } from '@/features/resume/components/template-selection';
import { useState, useEffect } from 'react';
import { ModeToggle } from '@/features/resume/components/mode-toggle';
import { useTemplateStore } from '@/features/resume/store/use-template-store';

export default function EditResumePage() {
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

  const form = useForm<TResumeEditFormValues>({
    resolver: zodResolver(resumeEditFormSchema),
    defaultValues: {
      resume_id: 1,
      personal_details: {
        fname: 'John Smith',
        lname: 'Smith',
        email: 'john.smith@example.com',
        phone: '+1 (555) 123-4567',
        country: 'United States',
        city: 'New York',
        summary:
          'Passionate full-stack developer with 5 years of experience building scalable web applications. Skilled in React, Node.js, and cloud technologies.'
      },
      education: [
        {
          school: 'Massachusetts Institute of Technology',
          degree: 'Bachelor of Science in Computer Science',
          field: 'Computer Science',
          start_date: '2014-09',
          end_date: '2018-05',
          country: 'United States',
          city: 'Cambridge',
          description:
            "GPA: 3.8/4.0, Dean's List, Computer Science Club President"
        }
      ],
      skills: [
        {
          skill_name: 'JavaScript',
          proficiency_level: 'Expert'
        },
        {
          skill_name: 'TypeScript',
          proficiency_level: 'Expert'
        },
        {
          skill_name: 'React',
          proficiency_level: 'Expert'
        },
        {
          skill_name: 'Node.js',
          proficiency_level: 'Advanced'
        },
        {
          skill_name: 'Python',
          proficiency_level: 'Advanced'
        },
        {
          skill_name: 'AWS',
          proficiency_level: 'Intermediate'
        },
        {
          skill_name: 'Docker',
          proficiency_level: 'Intermediate'
        },
        {
          skill_name: 'GraphQL',
          proficiency_level: 'Intermediate'
        }
      ],
      tools: [
        {
          tool_name: 'VS Code',
          proficiency_level: 'Expert'
        },
        {
          tool_name: 'Git',
          proficiency_level: 'Expert'
        },
        {
          tool_name: 'Jira',
          proficiency_level: 'Advanced'
        },
        {
          tool_name: 'Figma',
          proficiency_level: 'Intermediate'
        },
        {
          tool_name: 'Postman',
          proficiency_level: 'Advanced'
        }
      ],
      languages: [
        {
          lang_name: 'English',
          proficiency_level: 'Native'
        },
        {
          lang_name: 'Spanish',
          proficiency_level: 'Intermediate'
        }
      ]
    },
    mode: 'onChange',
    shouldFocusError: false
  });

  const formData = form.watch();
  console.log('Form Data Changed:', formData);

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
          <PageContainer scrollable>
            <div className='h-full w-full space-y-8 p-8'>
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
            </div>
          </PageContainer>
        </ResizablePanel>
        <ResizablePanel defaultSize={45} minSize={45}>
          <div className='relative flex h-full justify-center bg-[#D9D9D9]'>
            <div className='relative'>
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
