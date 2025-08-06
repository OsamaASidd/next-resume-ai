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
import { useTemplateStore } from '@/features/resume/store/use-template-store';
interface EditResumeFormProps {
  form: UseFormReturn<TResumeEditFormValues>;
}

export const EditResumeForm = ({ form }: EditResumeFormProps) => {
  const { userId } = useAuth();
  const { currentTemplate } = useTemplateStore();
  const { mutateAsync: uploadPreviewImage, isPending: isLoading } =
    useUploadPreviewImage();
  const { mutateAsync: updateResume, isPending: isUpdating } =
    useUpdateResume();

  const handleResumeSnapShot = async () => {
    const pdfElement = document.getElementById('resume-pdf-preview');

    // Check if the preview element exists
    if (!pdfElement) {
      console.warn(
        'PDF preview element not found, skipping preview generation'
      );
      return false; // Return false to indicate preview wasn't generated
    }

    try {
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

      return true; // Return true to indicate preview was generated successfully
    } catch (error) {
      console.error('Error generating preview:', error);
      return false;
    }
  };

  // Handle save without preview
  const handleSave = async (values: TResumeEditFormValues) => {
    try {
      const loadingToast = toast.loading('Saving resume...');

      await updateResume({
        id: values.resume_id!,
        templateId: currentTemplate,
        ...values
      });

      toast.dismiss(loadingToast);
      toast.success('Resume saved successfully');
    } catch (error) {
      console.error('Error saving resume:', error);
      toast.error('Failed to save changes. Please try again.');
    }
  };

  // Handle save with preview sync
  const handleSaveAndSync = async (values: TResumeEditFormValues) => {
    try {
      const loadingToast = toast.loading('Saving and syncing preview...');

      // Update resume data first
      await updateResume({
        id: values.resume_id!,
        templateId: currentTemplate,
        ...values
      });

      // Try to generate and upload preview
      const previewGenerated = await handleResumeSnapShot();

      toast.dismiss(loadingToast);

      if (previewGenerated) {
        toast.success('Resume saved and preview synced successfully');
      } else {
        toast.warning(
          'Resume saved, but preview sync failed. Make sure PDF preview is visible.'
        );
      }
    } catch (error) {
      console.error('Error saving resume:', error);
      toast.error('Failed to save changes. Please try again.');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSave)} className='space-y-8'>
        {userId && (
          <div className='mb-4 flex justify-end gap-2'>
            <Button
              type='submit'
              variant='outline'
              disabled={isLoading || isUpdating}
              className='gap-2'
            >
              <FolderSyncIcon className='h-4 w-4' />
              {isUpdating ? 'Saving...' : 'Save'}
            </Button>
            <Button
              type='button'
              onClick={form.handleSubmit(handleSaveAndSync)}
              disabled={isLoading || isUpdating}
              className='gap-2'
            >
              <FolderSyncIcon className='h-4 w-4' />
              {isLoading || isUpdating ? 'Syncing...' : 'Save & Sync Preview'}
            </Button>
          </div>
        )}
        <PersonalDetails control={form.control} />
        <WorkExperience control={form.control} />
        <Education control={form.control} />
        <Skills control={form.control} />
        <Tools control={form.control} />
        <Languages control={form.control} />
      </form>
    </Form>
  );
};
