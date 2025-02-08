// sync auth status to database
'use client';
import { client } from '@/lib/client';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Page() {
  const router = useRouter();
  const { data, isLoading } = useQuery({
    queryKey: ['get-database-sync-status'],
    refetchInterval: (query) => {
      return query.state.data?.isSynced ? false : 1000;
    },
    queryFn: async () => {
      const res = await client.auth.getDatabaseSyncStatus.$get();
      return await res.json();
    }
  });

  useEffect(() => {
    if (data?.isSynced) {
      router.push('/dashboard/profile');
    }
  }, [data, router]);

  return (
    <div className='flex min-h-screen flex-col items-center justify-center'>
      <div className='flex flex-col items-center'>
        <Loader2 className='mb-4 size-8 animate-spin' />
        <p className='text-lg'>Syncing your account data, please wait...</p>
      </div>
    </div>
  );
}
