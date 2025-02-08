'use client';

import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

export default function EditResumeError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Resume Edit Error:', error);
  }, [error]);

  return (
    <div className='flex h-[50vh] flex-col items-center justify-center space-y-4 text-center'>
      <div className='space-y-2'>
        <h1 className='text-3xl font-bold tracking-tighter'>
          Something went wrong!
        </h1>
        <p className='text-muted-foreground'>
          {error.message || 'Failed to load resume. Please try again.'}
        </p>
      </div>
      <div className='flex justify-center gap-2'>
        <Button onClick={() => reset()}>Try again</Button>
        <Button
          variant='outline'
          onClick={() => (window.location.href = '/dashboard/resume')}
        >
          Go back to resumes
        </Button>
      </div>
    </div>
  );
}
