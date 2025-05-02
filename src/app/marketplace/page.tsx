// interface MarketPlaceProps {}
// 'use client';

import { db } from '@/server/db';
import { eq } from 'drizzle-orm';
import { Resume, resumes } from '@/server/db/schema/resumes';
import React from 'react';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import EditResumeLoading from '../dashboard/resume/edit/[id]/loading';
import { ResumeMarketplace } from '@/features/resume/components/resume-marketplace';

export default async function MarketPlace() {
  try {
    const resumeId = 'gvin-vx1j-Xer67Tk8kzm';

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
        <ResumeMarketplace resume={resume} />
      </Suspense>
    );
  } catch (error) {
    // Log the error but let it propagate to the error boundary
    console.error('Error in EditResumePage:', error);
    throw error;
  }
}
