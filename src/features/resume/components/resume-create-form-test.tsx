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
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { generateGuestResumeAction } from '../../../server/routers/guest-resume'; // Import the server action

interface ResumeCreateFormTestProps {
  selectedProfile?: any | null;
  profileId: string | null;
  templateId: string;
  setIsOpen: (prev: boolean) => void;
}

export function ResumeCreateFormTest({
  profileId = null,
  templateId = 'template-one',
  setIsOpen,
  selectedProfile = null
}: ResumeCreateFormTestProps) {
  const { mutateAsync: createResume, isPending: isCreating } =
    useCreateResume();
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const form = useForm<TResumeFormValues>({
    resolver: zodResolver(resumeFormSchema),
    defaultValues: {
      jd_job_title: '',
      employer: '',
      jd_post_details: ''
    }
  });

  const onSubmit = async (data: TResumeFormValues) => {
    if (!profileId && !selectedProfile) {
      toast.error('Profile data is required');
      return;
    }

    // Case 1: User is logged in
    if (profileId) {
      try {
        const resume = await createResume(
          {
            ...data,
            profileId,
            templateId
          },
          {
            onSuccess: async (data) => {
              toast.success('Resume created successfully');
              setIsNavigating(true);
              setIsOpen(false);

              // @ts-ignore
              router.push(`/chatbot/${data?.id}`);
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
    }
    // Case 2: Guest user (not signed in)
    else {
      try {
        setIsGenerating(true);

        // Call server action instead of direct function call
        const result = await generateGuestResumeAction(
          {
            jd_job_title: data.jd_job_title,
            employer: data.employer,
            jd_post_details: data.jd_post_details
          },
          selectedProfile
        );

        if (!result.success) {
          throw new Error(result.error || 'Failed to generate resume');
        }

        console.log('AI generated content for guest:', result.data);

        // Create a temporary resume object for guest
        const guestResume = {
          id: `guest`,
          ...data,
          ...result.data,
          isGuest: true,
          createdAt: new Date().toISOString()
        };

        // Store in localStorage for guest access
        localStorage.setItem('guestResume', JSON.stringify(guestResume));
        toast.success('Resume generated successfully!');
        setIsOpen(false);
        // Redirect to a guest resume view or handle differently
        router.push(`/chatbot/${guestResume.id}`);
      } catch (error) {
        console.error('Error generating guest resume:', error);
        toast.error('Failed to generate resume. Please try again.');
      } finally {
        setIsGenerating(false);
      }
    }
  };

  const isLoading = isCreating || isNavigating || isGenerating;

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
                  <Input placeholder='Job Title (Optional)' {...field} />
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
                  <Input placeholder='Company Name (Optional)' {...field} />
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

        <div className='flex items-center justify-center'>
          <UiButton
            type='submit'
            disabled={isLoading}
            className='min-w-[150px]'
          >
            {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            {isCreating
              ? 'Creating...'
              : isNavigating
                ? 'Redirecting...'
                : isGenerating
                  ? 'Generating...'
                  : profileId
                    ? 'Create Resume'
                    : 'Generate Resume'}
          </UiButton>
        </div>
      </form>
    </Form>
  );
}
