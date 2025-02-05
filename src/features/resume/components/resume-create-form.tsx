'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
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
import { useCreateResume } from '../api';
import { TResumeFormValues, resumeFormSchema } from '../utils/form-schema';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button as UiButton } from '@/components/ui/button';

interface ResumeCreateFormProps {
  profileId: string | null;
}

export function ResumeCreateForm({ profileId }: ResumeCreateFormProps) {
  const { mutateAsync: createResume, isPending } = useCreateResume();
  const router = useRouter();

  const form = useForm<TResumeFormValues>({
    resolver: zodResolver(resumeFormSchema),
    defaultValues: {
      jd_job_title: '',
      employer: '',
      jd_post_details: ''
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
          onSuccess: (resume) => {
            toast.success('Resume created successfully');
            router.push(`/dashboard/resume/${resume}`);
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
