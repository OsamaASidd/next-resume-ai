import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import {
  type TResumeEditFormValues,
  resumeEditFormSchema
} from '@/features/resume/utils/form-schema';
import { useEffect } from 'react';
import { PersonalDetails } from './personal-details';
import { WorkExperience } from './work-experience';
import { Education } from './education';
import { Skills } from './skills';
import { Tools } from './tools';
import { Languages } from './languages';

interface EditResumeFormProps {
  resumeId: number;
}

export const EditResumeForm = ({ resumeId }: EditResumeFormProps) => {
  const form = useForm<TResumeEditFormValues>({
    resolver: zodResolver(resumeEditFormSchema),
    defaultValues: {
      resume_id: resumeId,
      personal_details: {},
      jobs: [],
      education: [],
      skills: [],
      tools: [],
      languages: []
    }
  });

  useEffect(() => {
    const fetchResumeData = async () => {
      try {
        const response = await fetch(`/api/resume/${resumeId}`);
        const data = await response.json();
        form.reset(data);
      } catch (error) {
        console.error('Failed to fetch resume data:', error);
      }
    };

    fetchResumeData();
  }, [resumeId, form]);

  const handleSubmit = async (values: TResumeEditFormValues) => {
    try {
      await fetch(`/api/resume/${resumeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });
    } catch (error) {
      console.error('Failed to update resume:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-8'>
        <PersonalDetails control={form.control} />
        <WorkExperience control={form.control} />
        <Education control={form.control} />
        <Skills control={form.control} />
        <Tools control={form.control} />
        <Languages control={form.control} />

        <Button type='submit' className='w-full'>
          Save Resume
        </Button>
      </form>
    </Form>
  );
};
