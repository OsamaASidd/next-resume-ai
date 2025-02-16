'use client';

import { Modal } from '@/components/ui/scrollable-dialog';
import { ProfileWithRelations } from '@/server/routers/profile-router';
import CreateProfileForm from './create-profile-form';

interface CreateProfileModalProps {
  profile?: ProfileWithRelations;
  isOpen: boolean;
  onChange: (open: boolean) => void;
}

export default function CreateProfileModal({
  profile,
  isOpen,
  onChange
}: CreateProfileModalProps) {
  return (
    <Modal
      title={profile ? 'Edit Profile' : 'Create New Profile'}
      description={
        profile ? 'Edit your profile details' : 'Add your profile information'
      }
      open={isOpen}
      onOpenChange={onChange}
    >
      <CreateProfileForm profile={profile} closeModal={() => onChange(false)} />
    </Modal>
  );
}
