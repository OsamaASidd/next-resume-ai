'use client';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { type TResumeEditFormValues } from '@/features/resume/utils/form-schema';
import { FolderSyncIcon } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';
import { useUploadPreviewImage } from '../api';
import { generatePreviewImage } from '../utils/preview-generator';
import { Education } from './education';
import { Languages } from './languages';
import { PersonalDetails } from './personal-details';
import { Skills } from './skills';
import { Tools } from './tools';
import { WorkExperience } from './work-experience';

interface EditResumeFormProps {
  form: UseFormReturn<TResumeEditFormValues, any, undefined>;
}

export const EditResumeForm = ({ form }: EditResumeFormProps) => {
  const { mutate: uploadPreviewImage, isPending: isLoading } =
    useUploadPreviewImage();

  const handleResumeSnapShot = async () => {
    try {
      const pdfElement = document.getElementById('resume-pdf-preview');
      if (!pdfElement) return;

      const imageBlob = await generatePreviewImage(pdfElement);
      // Convert Blob to base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
      });
      reader.readAsDataURL(imageBlob);
      const base64Image = await base64Promise;

      uploadPreviewImage(
        {
          resumeId: String(form.getValues('resume_id')),
          image: base64Image
        },
        {
          onSuccess: () => toast.success('Preview synced successfully'),
          onError: (error) => {
            toast.error('Failed to sync preview');
            console.error('Error:', error);
          }
        }
      );
    } catch (error) {
      console.error('Error syncing preview:', error);
      toast.error('Failed to sync preview');
    }
  };

  const handleSubmit = async (values: TResumeEditFormValues) => {
    console.log('values', values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-8'>
        <div className='mb-4 flex justify-end'>
          <Button
            type='button'
            variant='outline'
            onClick={handleResumeSnapShot}
            disabled={isLoading}
            className='gap-2'
          >
            <FolderSyncIcon className='h-4 w-4' />
            {isLoading ? 'Syncing...' : 'Sync Preview'}
          </Button>
        </div>

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
