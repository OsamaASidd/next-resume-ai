// sync auth status to database
'use client';
import { client } from '@/lib/client';
import { useQuery } from '@tanstack/react-query';
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
      router.push('/dashboard/overview');
    }
  }, [data, router]);

  return <div>Welcome {data?.isSynced ? 'Synced' : 'Not Synced'}</div>;
}
