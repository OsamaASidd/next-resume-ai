import { Skeleton } from '@/components/ui/skeleton';

export default function EditResumeLoading() {
  return (
    <div className='space-y-6 p-4'>
      <div className='space-y-2'>
        <Skeleton className='h-8 w-[200px]' />
        <Skeleton className='h-4 w-[300px]' />
      </div>
      <div className='grid gap-6'>
        <Skeleton className='h-[200px]' />
        <Skeleton className='h-[400px]' />
      </div>
    </div>
  );
}
