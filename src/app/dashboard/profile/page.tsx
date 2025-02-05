import { Suspense } from 'react';
import ProfileList from '@/features/profile/components/profile-list';
import PageContainer from '@/components/layout/page-container';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata = {
  title: 'Dashboard : Profiles'
};

export default function ProfilesPage() {
  return (
    <PageContainer>
      <div className='flex-1 space-y-4'>
        <div className='flex items-center justify-between'>
          <h2 className='text-3xl font-bold tracking-tight'>Profiles</h2>
        </div>
        <Suspense fallback={<Skeleton className='h-[400px] w-full' />}>
          <ProfileList />
        </Suspense>
      </div>
    </PageContainer>
  );
}
