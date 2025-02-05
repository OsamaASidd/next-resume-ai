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
import { ProfileFormValues, profileSchema } from '../utils/form-schema';

interface CreateProfileFormProps {
  profile?: ProfileFormValues;
}

export function CreateProfileForm({ profile }: CreateProfileFormProps) {
  const { mutateAsync: createProfile, isPending: isCreating } =
    useCreateProfile();
  //   const updateProfile = useUpdateProfile();
  const isPending = isCreating;
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: profile || {
      email: 'john.doe@example.com',
      firstname: 'John',
      lastname: 'Doe',
      contactno: 1234567890,
      country: 'United States',
      city: 'New York',
      jobs: [
        {
          jobcountry: 'United States',
          jobcity: 'New York',
          jobtitle: 'Software Engineer',
          employer: 'Tech Corp',
          startdate: '2020-01-01',
          enddate: '2023-12-31'
        }
      ]
    }
  });

  console.log('form errors', form.formState.errors);

  const handleSubmit = async (data: ProfileFormValues) => {
    await createProfile(data, {
      onSuccess: () => {
        toast.success(
          profile
            ? 'Profile updated successfully'
            : 'Profile created successfully'
        );
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
