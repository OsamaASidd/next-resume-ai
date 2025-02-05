'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, UseFormReturn } from 'react-hook-form';
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
  form: UseFormReturn<TResumeEditFormValues, any, undefined>;
}

export const EditResumeForm = ({ resumeId, form }: EditResumeFormProps) => {
  const handleSubmit = async (values: TResumeEditFormValues) => {
    console.log('values', values);
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
