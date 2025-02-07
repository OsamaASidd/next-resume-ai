import { Card, CardContent } from '@/components/ui/card';
import { ProfileFilter } from '@/features/resume/components/profile-filter';
import { searchParamsCache, serialize } from '@/lib/searchparams';
import { db } from '@/server/db';
import { resumes } from '@/server/db/schema';
import { formatDistanceToNow } from 'date-fns';
import { eq } from 'drizzle-orm';
import { PlusIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';

export default async function ResumePage({
  searchParams
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  searchParamsCache.parse(params);
  const key = serialize({ ...params });

  const { profileId } = params;

  const resumesList = await db.query.resumes.findMany({
    where: profileId ? eq(resumes.profileId, String(profileId)) : undefined,
    orderBy: (resumes, { desc }) => [desc(resumes.createdAt)]
  });

  return (
    <div className='container mx-auto py-10'>
      <div className='mb-8 flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>My Resumes</h1>
          <p className='text-muted-foreground'>Manage your resumes</p>
        </div>
      </div>

      <ProfileFilter />

      <Suspense key={key}>
        <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
          {/* Create New Resume Card */}
          <Link href='/dashboard/resume/create'>
            <Card className='group h-full cursor-pointer transition-all hover:border-primary hover:shadow-md'>
              <CardContent className='flex h-[300px] flex-col items-center justify-center p-6'>
                <div className='mb-4 rounded-full bg-muted/10 p-4 group-hover:bg-primary/5'>
                  <PlusIcon className='h-8 w-8 text-muted-foreground group-hover:text-primary' />
                </div>
                <h3 className='text-lg font-semibold'>Create a new resume</h3>
                <p className='mt-2 text-center text-sm text-muted-foreground'>
                  Start building from scratch
                </p>
              </CardContent>
            </Card>
          </Link>

          {/* Import Resume Card */}
          {/* <Link href='/dashboard/resume/import'>
            <Card className='h-full transition-all cursor-pointer hover:border-primary hover:shadow-md group'>
              <CardContent className='flex flex-col items-center justify-center h-[300px] p-6'>
                <div className='p-4 mb-4 rounded-full bg-muted/10 group-hover:bg-primary/5'>
                  <svg
                    className='w-8 h-8 text-muted-foreground group-hover:text-primary'
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>
                <h3 className='text-lg font-semibold'>Import an existing resume</h3>
                <p className='mt-2 text-sm text-center text-muted-foreground'>
                  LinkedIn, JSON Resume, etc.
                </p>
              </CardContent>
            </Card>
          </Link> */}

          {/* Existing Resumes */}
          {resumesList.map((resume) => (
            <Link key={resume.id} href={`/dashboard/resume/edit/${resume.id}`}>
              <Card className='h-full cursor-pointer transition-all hover:border-primary hover:shadow-md'>
                <CardContent className='h-[300px] p-0'>
                  <div className='relative h-full w-full overflow-hidden'>
                    <Image
                      src={resume.previewImageUrl ?? '/templates/default.png'}
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
      </Suspense>
    </div>
  );
}
