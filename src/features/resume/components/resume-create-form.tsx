'use client';

import { Button as UiButton } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useCreateResume } from '../api';
import { TResumeFormValues, resumeFormSchema } from '../utils/form-schema';

interface ResumeCreateFormProps {
  profileId: string | null;
}

export function ResumeCreateForm({ profileId }: ResumeCreateFormProps) {
  const { mutateAsync: createResume, isPending } = useCreateResume();
  const router = useRouter();

  const form = useForm<TResumeFormValues>({
    resolver: zodResolver(resumeFormSchema),
    defaultValues: {
      jd_job_title: 'Software Engineer',
      employer: 'Company Name',
      jd_post_details:
        'We are looking for a Software Engineer to join our team. The ideal candidate will have experience with React, TypeScript, and modern web development practices.'
    }
  });

  const onSubmit = async (data: TResumeFormValues) => {
    if (!profileId) return;

    try {
      const resume = await createResume(
        {
          ...data,
          profileId
        },

        {
          onSuccess: (data) => {
            console.log('resume data', data);
            toast.success('Resume created successfully');
            // @ts-ignore
            router.push(`/dashboard/resume/edit/${data?.id}`);
          },
          onError: (error) => {
            toast.error('Failed to create resume');
            console.error('Error creating resume:', error);
          }
        }
      );
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to create resume');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <div className='space-y-4'>
          <FormField
            control={form.control}
            name='jd_job_title'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Title</FormLabel>
                <FormControl>
                  <Input placeholder='Software Engineer' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='employer'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Employer</FormLabel>
                <FormControl>
                  <Input placeholder='Company Name' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='jd_post_details'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Enter job description details...'
                    className='min-h-[200px]'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <UiButton type='submit' className='w-full' disabled={isPending}>
          {isPending ? 'Creating...' : 'Create Resume'}
        </UiButton>
      </form>
    </Form>
  );
}
