'use server';

import { generateGuestResumeContent } from '@/server/services/ai-resume';

export async function generateGuestResumeAction(
  resumeData: {
    jd_job_title: string;
    employer: string;
    jd_post_details: string;
  },
  selectedProfile: any
) {
  try {
    const aiGeneratedContent = await generateGuestResumeContent(
      resumeData,
      selectedProfile
    );

    return {
      success: true,
      data: aiGeneratedContent
    };
  } catch (error) {
    console.error('Error generating guest resume:', error);
    return {
      success: false,
      error: 'Failed to generate resume content'
    };
  }
}
