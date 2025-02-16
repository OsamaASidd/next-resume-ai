import { Metadata } from 'next';
import PageContainer from '@/components/layout/page-container';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Dashboard | Next Resume Builder',
  description:
    'Manage your resumes and profiles in one place. Create, edit, and track your job applications.',
  openGraph: {
    title: 'Dashboard | Next Resume Builder',
    description:
      'Manage your resumes and profiles in one place. Create, edit, and track your job applications.'
  },
  twitter: {
    title: 'Dashboard | Next Resume Builder',
    description:
      'Manage your resumes and profiles in one place. Create, edit, and track your job applications.'
  }
};

export default async function Dashboard() {
  const { redirectToSignIn, userId } = await auth();

  console.log('userId', userId);

  if (!userId) {
    return redirectToSignIn();
  } else {
    redirect('/dashboard/profile');
  }
}
