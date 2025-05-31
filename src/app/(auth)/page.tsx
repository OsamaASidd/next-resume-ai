import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import LandingPage from '@/components/landing-page';
import React from 'react';

export default async function page() {
  const { userId } = await auth();
  if (!userId) {
    return <LandingPage />;
  }
  return redirect('/welcome');
}
