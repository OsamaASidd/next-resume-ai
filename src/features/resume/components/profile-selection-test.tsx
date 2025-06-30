'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useProfiles } from '@/features/profile/api';
import { useGetResumes } from '@/features/resume/api';
import { useCreateProfile } from '@/features/profile/api';
import { ProfileWithRelations } from '@/server/routers/profile-router';
import { profileSchema, TProfileFormValues } from '../utils/form-schema';
import { Skeleton } from '@/components/ui/skeleton';
import { Upload } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';
import { useForm } from 'react-hook-form';

interface ProfileSelectionStepTestProps {
  onProfileSelect: (profile: any) => void;
}

export function ProfileSelectionStepTest({
  onProfileSelect
}: ProfileSelectionStepTestProps) {
  const { userId } = useAuth();
  const { data: profiles, isLoading: isProfileLoading } = useProfiles();
  const { data: resumes, isLoading: isResumeLoading } = useGetResumes();
  const { mutateAsync: createProfile, isPending: isCreating } =
    useCreateProfile();

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile || selectedFile.type !== 'application/pdf') {
      alert('Please upload a valid PDF file.');
      return;
    }
    const formData = new FormData();
    formData.append('pdf', selectedFile); // Make sure key is 'pdf'
    console.log('selectedFile', formData.get('pdf'));
    try {
      const response = await fetch(
        'https://nlp-resume-parser-1-q5gk.onrender.com/api/parse-resume',
        {
          method: 'POST',
          body: formData
          // Don't set Content-Type header - let browser set it with boundary for multipart/form-data
        }
      );
      const result = await response.json();
      if (response.ok && result.success) {
        // PARSED DATA is in same format as Profile Schema
        console.log('Resume parsed successfully:', result.data);
        if (userId) {
          //if user logged in, create profile
          const profile = await createProfile(
            result.data as TProfileFormValues //Still error in this API call,
          );
          onProfileSelect(profile);
        } else {
          //else handle the unsigned user later
          onProfileSelect(result.data);
        }
      } else {
        console.error('Error parsing resume:', result.error);
        alert(`Error: ${result.message || result.error}`);
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  if (userId && (isProfileLoading || isResumeLoading)) {
    return <Skeleton className='h-[400px] w-full' />;
  }

  return (
    <div className='space-y-4'>
      {/* Upload pdf */}
      <h2 className='font-semibold'>
        Select a Profile or Upload existing Resume to continue
      </h2>
      <Card className='cursor-pointer border-dashed transition-all hover:border-primary'>
        <CardHeader>
          <CardTitle className='text-center font-semibold text-primary'>
            Create Profile from Existing Resume
          </CardTitle>
        </CardHeader>
        <CardContent>
          <label htmlFor='pdf-upload' className='cursor-pointer'>
            <div className='flex flex-col items-center text-gray-500'>
              <Upload />
              <div>Upload PDF</div>
              <input
                type='file'
                id='pdf-upload'
                accept='application/pdf'
                className='hidden'
                onChange={handleFileChange}
              />
            </div>
          </label>
        </CardContent>
      </Card>
      {userId ? (
        <>
          <div className='grid gap-4 md:grid-cols-2'>
            {/* Profiles */}
            {profiles?.map((profile) => (
              <Card
                key={profile.id}
                className='cursor-pointer transition-all hover:border-primary'
                onClick={() => onProfileSelect(profile)}
              >
                <CardHeader>
                  <CardTitle>
                    {profile.firstname} {profile.lastname}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-2'>
                    <div className='text-sm'>
                      <span className='font-medium'>Email:</span>{' '}
                      {profile.email}
                    </div>
                    <div className='text-sm'>
                      <span className='font-medium'>Location:</span>{' '}
                      {profile.city}, {profile.country}
                    </div>
                    <div className='text-sm'>
                      <span className='font-medium'>Experience:</span>{' '}
                      {profile.jobs.length} positions
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <h2 className='font-semibold'>Select Existing Resume to continue</h2>
          {/* Resumes */}
          <div className='grid gap-4 md:grid-cols-2'>
            {resumes?.map((resume) => (
              <Link key={resume.id} href={`/chatbot/${resume.id}`}>
                <Card className='h-full cursor-pointer transition-all hover:border-primary hover:shadow-md'>
                  <CardContent className='h-[300px] p-0'>
                    <div className='relative h-full w-full overflow-hidden'>
                      <Image
                        src={
                          resume.previewImageUrl ||
                          '/templates/default.png' ||
                          ''
                        }
                        alt={resume.jdJobTitle}
                        fill
                        className='absolute inset-0 h-full w-full object-contain'
                      />
                      <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 text-white'>
                        <h3 className='line-clamp-1 font-medium'>
                          {resume.jdJobTitle}
                        </h3>
                        <p className='mt-1 text-xs opacity-90'>
                          Last updated{' '}
                          {formatDistanceToNow(new Date(resume.createdAt), {
                            addSuffix: true
                          })}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </>
      ) : (
        <div></div>
      )}
    </div>
  );
}
