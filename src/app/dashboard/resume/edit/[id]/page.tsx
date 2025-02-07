import { db } from '@/server/db';
import { resumes } from '@/server/db/schema/resumes';
import { eq } from 'drizzle-orm';
import { ResumeEditContent } from '@/features/resume/components/resume-edit-content';
import { notFound } from 'next/navigation';

export default async function EditResumePage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const resumeId = (await params).id;
  const resume = await db.query.resumes.findFirst({
    where: eq(resumes.id, resumeId)
  });

  console.log('yo resume haha', resume);
  if (!resume) {
    notFound();
  }

  return <ResumeEditContent resume={resume} />;
}
