'use client';

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
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useCreateProfile } from '../api';
import { TProfileFormValues, profileSchema } from '../utils/form-schema';
import { ProfileWithRelations } from '@/server/routers/profile-router';

interface CreateProfileFormProps {
  profile?: ProfileWithRelations;
  closeModal: () => void;
}

const transformProfileToFormValues = (
  profile?: ProfileWithRelations
): TProfileFormValues => {
  if (!profile) {
    return {
      email: 'john.doe@example.com',
      firstname: 'John',
      lastname: 'Doe',
      contactno: '1234567890',
      country: 'United States',
      city: 'New York',
      jobs: [
        {
          jobTitle: 'Software Engineer',
          employer: 'Tech Corp',
          city: 'New York',
          startDate: '2020-01-01',
          endDate: '2023-12-31',
          description: 'Software development role'
        }
      ],
      educations: [
        {
          school: 'University of Tech',
          degree: 'Bachelor',
          field: 'Computer Science',
          city: 'New York',
          startDate: '2018-09-01',
          endDate: '2022-06-30',
          description: 'Completed Bachelors in Computer Science'
        }
      ]
    };
  }

  return {
    email: profile.email,
    firstname: profile.firstname,
    lastname: profile.lastname,
    contactno: profile.contactno,
    country: profile.country,
    city: profile.city,
    jobs: profile.jobs.map((job) => ({
      jobTitle: job.jobTitle || '',
      employer: job.employer || '',
      city: job.city || '',
      startDate: job.startDate || '',
      endDate: job.endDate || '',
      description: job.description || '',
      id: job.id
    })),
    educations:
      profile.educations?.map((edu) => ({
        school: edu.school || '',
        degree: edu.degree || '',
        field: edu.field || '',
        description: edu.description || '',
        startDate: edu.startDate || '',
        endDate: edu.endDate || '',
        city: edu.city || '',
        id: edu.id
      })) || []
  };
};

export function CreateProfileForm({
  profile,
  closeModal
}: CreateProfileFormProps) {
  const { mutateAsync: createProfile, isPending: isCreating } =
    useCreateProfile();
  //   const updateProfile = useUpdateProfile();
  const isPending = isCreating;
  const form = useForm<TProfileFormValues>({
    resolver: zodResolver(profileSchema),
    values: transformProfileToFormValues(profile)
  });

  console.log('form errors', form.formState.errors);

  const handleSubmit = async (data: TProfileFormValues) => {
    await createProfile(data, {
      onSuccess: () => {
        toast.success(
          profile
            ? 'Profile updated successfully'
            : 'Profile created successfully'
        );
        closeModal();
      },
      onError: (error) => {
        toast.error('Something went wrong');
        console.error('Error submitting form:', error);
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='firstname'
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input placeholder='John' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='lastname'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input placeholder='Doe' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder='john@example.com' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='contactno'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input type='number' placeholder='1234567890' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='country'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <FormControl>
                <Input placeholder='Enter country' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='city'
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input placeholder='Enter city' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit' className='w-full' disabled={isPending}>
          {profile ? 'Update Profile' : 'Create Profile'}
        </Button>
      </form>
    </Form>
  );
}
