'use client';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { type TResumeEditFormValues } from '@/features/resume/utils/form-schema';
import { FolderSyncIcon } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';
import { useUploadPreviewImage, useUpdateResume } from '../api';
import { generatePreviewImage } from '../utils/preview-generator';
import { Education } from './education';
import { Languages } from './languages';
import { PersonalDetails } from './personal-details';
import { Skills } from './skills';
import { Tools } from './tools';
import { WorkExperience } from './work-experience';
import { useAuth } from '@clerk/nextjs';

interface EditResumeFormProps {
  form: UseFormReturn<TResumeEditFormValues, any, undefined>;
}

export const EditResumeForm = ({ form }: EditResumeFormProps) => {
  const { userId } = useAuth();
  const { mutateAsync: uploadPreviewImage, isPending: isLoading } =
    useUploadPreviewImage();
  const { mutateAsync: updateResume, isPending: isUpdating } =
    useUpdateResume();

  const handleResumeSnapShot = async () => {
    const pdfElement = document.getElementById('resume-pdf-preview');
    if (!pdfElement) {
      throw new Error('Preview element not found');
    }

    const imageBlob = await generatePreviewImage(pdfElement);
    const reader = new FileReader();
    const base64Promise = new Promise<string>((resolve) => {
      reader.onloadend = () => resolve(reader.result as string);
    });
    reader.readAsDataURL(imageBlob);
    const base64Image = await base64Promise;

    await uploadPreviewImage({
      resumeId: String(form.getValues('resume_id')),
      image: base64Image
    });
  };

  const handleSubmit = async (values: TResumeEditFormValues) => {
    try {
      const loadingToast = toast.loading('Saving and syncing preview...');

      // Update resume data
      await updateResume({
        id: values.resume_id!,
        ...values
      });

      // Generate and upload preview
      await handleResumeSnapShot();

      toast.dismiss(loadingToast);
      toast.success('Resume synced successfully');
    } catch (error) {
      console.error('Error saving resume:', error);
      toast.error('Failed to save changes. Please try again.');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-8'>
        {userId && (
          <div className='mb-4 flex justify-end'>
            <Button
              type='submit'
              disabled={isLoading || isUpdating}
              className='gap-2'
            >
              <FolderSyncIcon className='h-4 w-4' />
              {isLoading || isUpdating ? 'Saving...' : 'Sync & Save'}
            </Button>
          </div>
        )}
        <PersonalDetails control={form.control} />
        <WorkExperience control={form.control} />
        <Education control={form.control} />
        <Skills control={form.control} />
        <Tools control={form.control} />
        <Languages control={form.control} />
        {userId && (
          <Button
            type='submit'
            disabled={isLoading || isUpdating}
            className='w-full gap-2'
          >
            <FolderSyncIcon className='h-4 w-4' />
            {isLoading || isUpdating ? 'Saving...' : 'Sync & Save'}
          </Button>
        )}
      </form>
    </Form>
  );
};
