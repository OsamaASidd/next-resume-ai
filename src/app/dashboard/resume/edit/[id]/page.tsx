import { ResumeEditContent } from '@/features/resume/components/resume-edit-content';
import { db } from '@/server/db';
import { resumes } from '@/server/db/schema/resumes';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import EditResumeLoading from './loading';

export default async function EditResumePage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  try {
    const resumeId = (await params).id;

    if (!resumeId) {
      notFound();
    }

    const resume = await db.query.resumes.findFirst({
      where: eq(resumes.id, resumeId)
    });

    if (!resume) {
      notFound();
    }

    return (
      <Suspense fallback={<EditResumeLoading />}>
        <ResumeEditContent resume={resume} />
      </Suspense>
    );
  } catch (error) {
    // Log the error but let it propagate to the error boundary
    console.error('Error in EditResumePage:', error);
    throw error;
  }
}
