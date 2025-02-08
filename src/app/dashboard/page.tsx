import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function Dashboard() {
  const { redirectToSignIn, userId } = await auth();

  console.log('userId', userId);

  if (!userId) {
    return redirectToSignIn();
  } else {
    redirect('/dashboard/profile');
  }
}
