'use client';

import Header from '@/components/layout/header';
import { useSelectedLayoutSegments } from 'next/navigation';
import type React from 'react'; // Added import for React

export default function LayoutWrapper({
  children
}: {
  children: React.ReactNode;
}) {
  // Get all segments of the current route
  const segments = useSelectedLayoutSegments();

  // Check if we're on the resume/edit route
  const isResumeEdit = segments[0] === 'resume' && segments[1] === 'edit';

  // Show header everywhere except resume/edit
  const showHeader = !isResumeEdit;

  return (
    <>
      {showHeader && <Header />}
      <main>{children}</main>
    </>
  );
}
