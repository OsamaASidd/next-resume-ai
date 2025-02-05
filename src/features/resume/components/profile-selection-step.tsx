'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useProfiles } from '@/features/profile/api';
import { Skeleton } from '@/components/ui/skeleton';

interface ProfileSelectionStepProps {
  onProfileSelect: (profileId: string) => void;
}

export function ProfileSelectionStep({
  onProfileSelect
}: ProfileSelectionStepProps) {
  const { data: profiles, isLoading } = useProfiles();

  if (isLoading) {
    return <Skeleton className='h-[400px] w-full' />;
  }

  return (
    <div className='space-y-4'>
      <h2 className='text-xl font-semibold'>Select a Profile</h2>
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {profiles?.map((profile) => (
          <Card
            key={profile.id}
            className='cursor-pointer transition-all hover:border-primary'
            onClick={() => onProfileSelect(profile.id)}
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
    </div>
  );
}
