'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';
import { useProfiles } from '../api';
import { ProfileFormValues } from '../utils/form-schema';
import CreateProfileModal from './create-profile-modal';

export default function ProfileList() {
  const [selectedProfile, setSelectedProfile] =
    useState<ProfileFormValues | null>(null);
  const { data: profiles, isLoading } = useProfiles();

  if (isLoading) {
    return <Skeleton className='h-[400px] w-full' />;
  }

  return (
    <>
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        <Card className='flex cursor-pointer flex-col items-center justify-center border-2 border-dashed bg-gradient-to-br from-sidebar/60 to-sidebar p-8 hover:border-primary'>
          <CreateProfileModal />
          <p className='mt-2 text-sm text-muted-foreground'>
            Create new profile
          </p>
        </Card>

        {profiles?.map((profile) => (
          <Card
            key={profile.id}
            className='cursor-pointer bg-gradient-to-br from-sidebar/60 to-sidebar transition-all hover:border-primary'
            onClick={() => {
              setSelectedProfile(profile as any);
            }}
          >
            <CardHeader>
              <CardTitle>
                {profile.firstname} {profile.lastname}
              </CardTitle>
              <CardDescription>{profile.email}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-2'>
                <div className='text-sm'>
                  <span className='font-medium'>Phone:</span>{' '}
                  {profile.contactno}
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
    </>
  );
}
