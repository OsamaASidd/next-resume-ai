// src/features/resume/components/profile-selection-test.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useProfiles } from '@/features/profile/api';
import { useGetResumes } from '@/features/resume/api';
import { useCreateProfile } from '@/features/profile/api';
import { ProfileWithRelations } from '@/server/routers/profile-router';
import {
  profileSchema,
  TProfileFormValues
} from '@/features/profile/utils/form-schema';
import { Skeleton } from '@/components/ui/skeleton';
import { Upload } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import 'animate.css';

interface ProfileSelectionStepTestProps {
  onProfileSelect: (profile: any) => void;
}

interface Resume {
  id: any;
  previewImageUrl: any;
  jdJobTitle: any;
  createdAt: any;
}

export function ProfileSelectionStepTest({
  onProfileSelect
}: ProfileSelectionStepTestProps) {
  const { userId } = useAuth();
  const { data: profiles, isLoading: isProfileLoading } = useProfiles();
  const { data: maybeResumes, isLoading: isResumeLoading } = useGetResumes();
  const resumes = maybeResumes as Resume[] | undefined;
  const { mutateAsync: createProfile, isPending: isCreating } =
    useCreateProfile();
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isScreenDrag, setIsScreenDrag] = useState(false);

  // Add effect to handle window-level drag events
  useEffect(() => {
    const handleWindowDragOver = (e: DragEvent) => {
      e.preventDefault();
      setIsScreenDrag(true);
    };

    const handleWindowDragLeave = (e: DragEvent) => {
      e.preventDefault();
      // Only hide if we're leaving the window completely
      if (e.clientX === 0 && e.clientY === 0) {
        setIsScreenDrag(false);
      }
    };

    const handleWindowDrop = (e: DragEvent) => {
      e.preventDefault();
      setIsScreenDrag(false);
    };

    window.addEventListener('dragover', handleWindowDragOver);
    window.addEventListener('dragleave', handleWindowDragLeave);
    window.addEventListener('drop', handleWindowDrop);

    return () => {
      window.removeEventListener('dragover', handleWindowDragOver);
      window.removeEventListener('dragleave', handleWindowDragLeave);
      window.removeEventListener('drop', handleWindowDrop);
    };
  }, []);

  // Transform parsed data to match TProfileFormValues schema
  const transformParsedDataToProfile = (
    parsedData: any
  ): TProfileFormValues => {
    return {
      firstname: parsedData.firstname || '',
      lastname: parsedData.lastname || '',
      email: parsedData.email || '',
      contactno: parsedData.contactno || '',
      country: parsedData.country || '',
      city: parsedData.city || '',
      jobs:
        parsedData.jobs?.map((job: any) => ({
          jobTitle: job.jobTitle || '',
          employer: job.employer || '',
          description: job.description || '',
          startDate: job.startDate || '',
          endDate: job.endDate || '',
          city: job.city || ''
        })) || [],
      educations:
        parsedData.education?.map((edu: any) => ({
          school: edu.school || '',
          degree: edu.degree || '',
          field: edu.field || '',
          description: edu.description || '',
          startDate: edu.startDate || '',
          endDate: edu.endDate || '',
          city: edu.city || ''
        })) || [],
      certificates:
        parsedData.certificates?.map((cert: any) => ({
          name: cert.name || '',
          issuer: cert.issuer || '',
          issueDate: cert.issueDate || '',
          expirationDate: cert.expirationDate || '',
          credentialId: cert.credentialId || '',
          credentialUrl: cert.credentialUrl || '',
          description: cert.description || ''
        })) || [],
      extracurriculars:
        parsedData.extracurriculars?.map((eca: any) => ({
          activityName: eca.activityName || '',
          organization: eca.organization || '',
          role: eca.role || '',
          startDate: eca.startDate || '',
          endDate: eca.endDate || '',
          description: eca.description || ''
        })) || []
    };
  };

  const validateFile = (file: File): boolean => {
    if (file.type !== 'application/pdf') {
      toast.error('Please upload a valid PDF file.');
      return false;
    }

    // Optional: Add file size validation (e.g., 10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast.error('File size must be less than 10MB.');
      return false;
    }

    return true;
  };

  const processFile = async (file: File) => {
    if (!validateFile(file)) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const response = await fetch(
        'https://nlp-resume-parser-1-q5gk.onrender.com/api/parse-resume',
        {
          method: 'POST',
          body: formData
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        console.log('Resume parsed successfully:', result.data);

        if (userId) {
          // Transform the parsed data to match the profile schema
          const profileData = transformParsedDataToProfile(result.data);

          // Validate the data before sending
          try {
            profileSchema.parse(profileData);
            console.log('Profile data validated successfully:', profileData);

            // Create profile with validated data
            const profile = await createProfile(profileData);
            console.log('Profile created successfully:', profile);

            toast.success('Profile created successfully from resume!');
            onProfileSelect(profile);
          } catch (validationError) {
            console.error('Profile validation error:', validationError);
            toast.error(
              'Invalid resume data. Please check your PDF and try again.'
            );
          }
        } else {
          // For guest users, pass the raw parsed data
          onProfileSelect(result.data);
        }
      } else {
        console.error('Error parsing resume:', result.error);
        toast.error(`Error: ${result.message || result.error}`);
      }
    } catch (error) {
      console.error('Network error:', error);
      toast.error('Failed to parse resume. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    await processFile(selectedFile);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    setIsScreenDrag(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;

    const file = files[0];
    await processFile(file);
  };

  // Screen-wide drag and drop handlers
  const handleScreenDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleScreenDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleScreenDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsScreenDrag(false);
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;

    const file = files[0];
    await processFile(file);
  };

  if (userId && (isProfileLoading || isResumeLoading)) {
    return <Skeleton className='h-[400px] w-full' />;
  }
  if (isUploading) {
    return (
      <div className='space-y-6 p-6'>
        <Skeleton className='h-[30px] w-full' />
        <Skeleton className='h-[30px] w-full' />
        <Skeleton className='h-[250px] w-full' />
      </div>
    );
  }

  return (
    <>
      {/* Full screen drag overlay */}
      {isScreenDrag && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center rounded-lg border-4 border-dashed border-primary/70 bg-primary/20 backdrop-blur-md'
          onDragOver={handleScreenDragOver}
          onDragLeave={handleScreenDragLeave}
          onDrop={handleScreenDrop}
        >
          <div className='flex flex-col items-center text-primary'>
            <Upload className='animate__animated animate__slow animate__bounce mb-6 h-20 w-20' />
            <div className='mb-3 text-3xl font-bold'>DROP HERE</div>
            <div className='text-center text-lg text-gray-600'>
              Release to upload your resume
            </div>
          </div>
        </div>
      )}

      <div className='relative space-y-4'>
        {/* Upload pdf */}
        {/* <h2 className='font-semibold'>
          Select a Profile or Upload existing Resume to continue
        </h2> */}
        <Card
          className={`cursor-pointer border border-dashed transition-all duration-500 hover:scale-[103%] hover:border-primary ${
            isDragOver ? 'scale-[103%] border-primary bg-primary/5' : ''
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <label htmlFor='pdf-upload' className='cursor-pointer'>
            <CardHeader>
              <CardTitle className='text-center font-semibold text-primary'>
                Create Profile from Existing Resume
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex flex-col items-center text-gray-500'>
                <Upload
                  className={`transition-all duration-300 ${isDragOver ? 'scale-110 text-primary' : ''}`}
                />
                <div className='text-center'>
                  <div className='font-medium'>
                    Drag and drop or click to select
                  </div>
                </div>
                <input
                  type='file'
                  id='pdf-upload'
                  accept='application/pdf'
                  className='hidden'
                  onChange={handleFileChange}
                  disabled={isUploading || isCreating}
                />
              </div>
            </CardContent>
          </label>
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
            <h2 className='font-semibold'>
              Select Existing Resume to continue
            </h2>
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
    </>
  );
}
