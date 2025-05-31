// app/chat/page.tsx
import { Metadata } from 'next';
import ChatInterface from '@/components/chat-interface';

export const metadata: Metadata = {
  title: 'Chat | Next Resume Builder',
  description:
    'Manage your professional profiles. Create and customize different profiles for various job types and industries.',
  openGraph: {
    title: 'Chat | Next Resume Builder',
    description:
      'Manage your professional profiles. Create and customize different profiles for various job types and industries.'
  },
  twitter: {
    title: 'Chat | Next Resume Builder',
    description:
      'Manage your professional profiles. Create and customize different profiles for various job types and industries.'
  }
};

export default function ChatBot() {
  return (
    <div className='min-h-screen'>
      <ChatInterface />
    </div>
  );
}
