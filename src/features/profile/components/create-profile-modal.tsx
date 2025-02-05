'use client';

import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/scrollable-dialog';
import { PlusCircle } from 'lucide-react';
import { useState } from 'react';
import { ProfileFormValues } from '../utils/form-schema';
import { CreateProfileForm } from './create-profile-form';

interface CreateProfileModalProps {
  profile?: ProfileFormValues;
}

export default function CreateProfileModal({
  profile
}: CreateProfileModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const onChange = (open: boolean) => {
    setIsOpen(open);
  };

  return (
    <Modal
      title={profile ? 'Edit Profile' : 'Create New Profile'}
      description={
        profile ? 'Edit your profile details' : 'Add your profile information'
      }
      open={isOpen}
      onOpenChange={onChange}
      trigger={
        <Button
          variant='ghost'
          className='h-20 w-20'
          onClick={() => setIsOpen(true)}
        >
          <PlusCircle className='h-10 w-10' />
        </Button>
      }
    >
      <CreateProfileForm profile={profile} />
    </Modal>
  );
}
