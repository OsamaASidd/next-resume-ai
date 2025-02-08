import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react';

export default async function page() {
  const { userId } = await auth();
  if (!userId) {
    return redirect('/sign-in');
  }
  return redirect('/welcome');
}
