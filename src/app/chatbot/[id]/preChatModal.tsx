'use client';

import { Modal } from '@/components/ui/scrollable-dialog';
import useMultistepForm from '@/hooks/use-multistep-form';
import { ProfileSelectionStepTest } from '@/features/resume/components/profile-selection-test';
import { ResumeCreateFormTest } from '@/features/resume/components/resume-create-form-test';
import { useState } from 'react';
import { TemplateSelection } from '@/features/resume/components/template-selection';
import { useTemplateStore } from '@/features/resume/store/use-template-store';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { AlertModal } from '@/components/modal/alert-modal';

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
  const [alert, setAlert] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<any | null>(null);
  const [heading, setHeading] = useState(
    'Upload Resume or Select existing Profile to continue'
  );
  const { steps, currentStepIndex, step, isFirstStep, isLastStep, back, next } =
    useMultistepForm([
      <ProfileSelectionStepTest
        key='profile-selection'
        onProfileSelect={(profile) => {
          setSelectedProfile(profile);
          console.log(profile);
          setHeading(`Hello ${profile?.firstname}!`);
          next();
        }}
      />,
      <TemplateSelection
        selectedTemplate={selectedTemplate}
        onTemplateSelect={setSelectedTemplate}
        onApplyTemplate={applyTemplate}
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
      title={heading}
      description={'Upload Resume or Select existing Profile to continue'}
      open={isOpen}
      onOpenChange={() => false}
    >
      <>
        <AlertModal
          description='This action will reset your Current Progress'
          isOpen={alert}
          onClose={() => setAlert(false)}
          onConfirm={() => {
            back();
            setAlert(false);
            setHeading('Select Existing Profile or Upload Resume');
          }}
          loading={false}
        />
        <div className='absolute right-4 top-4 z-10 flex items-center gap-2'>
          {currentStepIndex ? (
            <Button
              size='sm'
              className='h-8 border text-xs shadow md:text-sm'
              onClick={() => {
                currentStepIndex === 1 ? setAlert(true) : back();
              }}
              disabled={isFirstStep}
              variant='secondary'
            >
              <Icons.chevronLeft className='mr-2 h-4 w-4' />
              <div>Back</div>
            </Button>
          ) : (
            ''
          )}
          {currentStepIndex === 1 && (
            <Button
              size='sm'
              className='h-8 border text-xs shadow md:text-sm'
              onClick={next}
              variant='secondary'
            >
              <div>Next</div>
              <Icons.chevronRight className='ml-2 h-4 w-4' />
            </Button>
          )}
        </div>

        {step}
      </>
    </Modal>
  );
}
