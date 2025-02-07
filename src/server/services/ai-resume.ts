import {
  resumeFormSchema,
  TResumeEditFormValues
} from '@/features/resume/utils/form-schema';
import { AIChatSession } from './google-ai-model';
import { resumeEditFormSchema } from '@/features/resume/utils/form-schema';
import { ZodObject } from 'zod';
import { Profile } from '@/server/db/schema/profiles';

function getSchemaStructure(schema: ZodObject<any>) {
  const shape = schema.shape;
  return JSON.stringify(
    shape,
    (key, value) => {
      if (value?._def?.typeName === 'ZodObject') {
        return getSchemaStructure(value);
      }
      if (value?._def?.typeName === 'ZodArray') {
        return [getSchemaStructure(value._def.type)];
      }
      if (value?._def?.typeName === 'ZodString') {
        return 'string';
      }
      if (value?._def?.typeName === 'ZodOptional') {
        return value._def.innerType._def.typeName === 'ZodString'
          ? 'string'
          : value._def.innerType;
      }
      return value;
    },
    2
  );
}

export async function generateResumeContent(
  input: {
    profileId: string;
    jd_job_title: string;
    employer: string;
    jd_post_details: string;
  },
  profile: Profile
): Promise<TResumeEditFormValues> {
  const schemaStructure = getSchemaStructure(resumeEditFormSchema);

  console.log('schema strucutre', schemaStructure);

  const prompt = `
    Generate a professional resume based on the following information:

    Target Position:
    Job Title: ${input.jd_job_title}
    Employer: ${input.employer}
    Job Description: ${input.jd_post_details}

    Candidate Profile:
    Full Name: ${profile.firstname} ${profile.lastname}
    Email: ${profile.email}
    Contact: ${profile.contactno}
    Location: ${profile.city}, ${profile.country}

    Work History:
    ${profile.jobs
      .map((jobStr) => {
        const job = JSON.parse(jobStr);
        return `
      - Position: ${job.jobtitle}
        Company: ${job.employer}
        Location: ${job.jobcity}, ${job.jobcountry}
        Duration: ${job.startdate} to ${job.enddate}
      `;
      })
      .join('\n')}

    Instructions:
    1. Create a compelling professional summary (3-5 sentences) that:
       - Highlights the candidate's years of experience
       - Emphasizes relevant skills for the target position
       - Showcases key achievements from work history
       - Aligns with the job description requirements
    2. Extract key skills and tools from both the job description and work history
    3. Format all dates as YYYY-MM-DD
    4. Structure the response as a JSON object matching exactly this schema:
    ${schemaStructure}

    The professional summary should be included in personal_details.summary and must be at least 3 characters long.
    Focus on making the summary impactful and relevant to the target position.
  `;

  try {
    const result = await AIChatSession.sendMessage(prompt);
    const responseText = await result.response.text();
    console.log('AI Response:', responseText);

    const content = JSON.parse(responseText) as TResumeEditFormValues;

    // Validate and ensure all required sections exist
    return {
      personal_details: {
        resume_job_title:
          content.personal_details?.resume_job_title || input.jd_job_title,
        fname: profile.firstname,
        lname: profile.lastname,
        email: profile.email,
        phone: profile.contactno,
        country: profile.country,
        city: profile.city,
        summary: content.personal_details?.summary || ''
      },
      jobs: content.jobs || [],
      education: content.education || [],
      skills: content.skills || [],
      tools: content.tools || [],
      languages: content.languages || []
    };
  } catch (error) {
    console.error('Error generating resume content:', error);
    throw error;
  }
}
