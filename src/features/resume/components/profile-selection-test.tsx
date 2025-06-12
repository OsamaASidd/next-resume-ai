'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useProfiles } from '@/features/profile/api';
import { useGetResumes } from '@/features/resume/api';
import { Skeleton } from '@/components/ui/skeleton';
import { Upload } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';
import { useEffect } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';

interface ProfileSelectionStepTestProps {
  onProfileSelect: (profile: any) => void;
}

export function ProfileSelectionStepTest({
  onProfileSelect
}: ProfileSelectionStepTestProps) {
  const { userId } = useAuth();
  const { data: profiles, isLoading: isProfileLoading } = useProfiles();
  const { data: resumes, isLoading: isResumeLoading } = useGetResumes();
  useEffect(() => {
    console.log(resumes);
    console.log('resumes');
  }, [resumes]);
  if (isProfileLoading || isResumeLoading) {
    return <Skeleton className='h-[400px] w-full' />;
  }

  return (
    <div className='space-y-4'>
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
          <div className='flex flex-col items-center text-gray-500'>
            <Upload />
            <div>Upload PDF</div>
          </div>
        </CardContent>
      </Card>
      <div className='grid gap-4 md:grid-cols-2'>
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
                  <span className='font-medium'>Email:</span> {profile.email}
                </div>
                <div className='text-sm'>
                  <span className='font-medium'>Location:</span> {profile.city},{' '}
                  {profile.country}
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
      <div className='grid gap-4 md:grid-cols-2'>
        {resumes?.map((resume) => (
          <Link key={resume.id} href={`/chatbot/${resume.id}`}>
            <Card className='h-full cursor-pointer transition-all hover:border-primary hover:shadow-md'>
              <CardContent className='h-[300px] p-0'>
                <div className='relative h-full w-full overflow-hidden'>
                  <Image
                    src={
                      resume.previewImageUrl || '/templates/default.png' || ''
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
    </div>
  );
}
