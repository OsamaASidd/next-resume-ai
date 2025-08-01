'use client';

import { Modal } from '@/components/ui/scrollable-dialog';
import useMultistepForm from '@/hooks/use-multistep-form';
import { ProfileSelectionStepTest } from '@/features/resume/components/profile-selection-test';
import { ResumeCreateFormTest } from '@/features/resume/components/resume-create-form-test';
import { useState } from 'react';
import { TemplateSelection } from '@/features/resume/components/template-selection';
import { useTemplateStore } from '@/features/resume/store/use-template-store';

interface PreChatModalProps {
  isOpen: boolean;
  setIsOpen: any;
}

export default function PreChatModal({ setIsOpen, isOpen }: PreChatModalProps) {
  const {
    selectedTemplate,
    currentTemplate,
    setSelectedTemplate,
    applyTemplate
  } = useTemplateStore();
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
      <TemplateSelection
        selectedTemplate={selectedTemplate}
        onTemplateSelect={setSelectedTemplate}
        onApplyTemplate={(templateId: string) => {
          applyTemplate(templateId);
          next();
        }}
        currentTemplate={currentTemplate}
      />,
      <ResumeCreateFormTest
        key='resume-form'
        profileId={selectedProfile?.id}
        setIsOpen={setIsOpen}
        selectedProfile={selectedProfile}
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
