'use client';

import { Modal } from '@/components/ui/scrollable-dialog';
import useMultistepForm from '@/hooks/use-multistep-form';
import { ProfileSelectionStepTest } from '@/features/resume/components/profile-selection-test';
import { ResumeCreateFormTest } from '@/features/resume/components/resume-create-form-test';
import { useState } from 'react';

interface PreChatModalProps {
  isOpen: boolean;
  setIsOpen: any;
}

export default function PreChatModal({ setIsOpen, isOpen }: PreChatModalProps) {
  const [selectedProfile, setSelectedProfile] = useState<any | null>(null);
  const { steps, currentStepIndex, step, isFirstStep, isLastStep, back, next } =
    useMultistepForm([
      <ProfileSelectionStepTest
        key='profile-selection'
        onProfileSelect={(profile) => {
          setSelectedProfile(profile);
          console.log(profile);
          next();
        }}
      />,
      <ResumeCreateFormTest
        key='resume-form'
        profileId={selectedProfile?.id}
        setIsOpen={setIsOpen}
      />
    ]);
  return (
    <Modal
      title={'Profile Selection'}
      description={'Select Profile or Upload Existing Resume to continue'}
      open={isOpen}
      onOpenChange={() => false}
    >
      {step}
    </Modal>
  );
}
