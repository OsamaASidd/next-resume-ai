'use client';

import { searchParams } from '@/lib/searchparams';
import { useQueryState } from 'nuqs';

export function useResumeFilters() {
  const [profileId, setProfileId] = useQueryState(
    'profileId',
    searchParams.profileId.withDefault('')
  );

  return {
    profileId,
    setProfileId
  };
}
