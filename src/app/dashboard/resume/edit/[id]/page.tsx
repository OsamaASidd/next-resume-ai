import { EditResumeForm } from '@/features/resume/components/edit-resume-form';

export default function EditResumePage({ params }: { params: { id: string } }) {
  return (
    <div className='container mx-auto py-10'>
      <h1 className='mb-6 text-3xl font-bold'>Edit Resume</h1>
      <EditResumeForm resumeId={parseInt(params.id)} />
    </div>
  );
}
