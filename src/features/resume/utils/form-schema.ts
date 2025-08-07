import * as z from 'zod';

// for resume creation page
export const resumeFormSchema = z.object({
  jd_job_title: z.string().optional(), // Now optional
  employer: z.string().optional(),
  jd_post_details: z
    .string()
    .min(3, { message: 'Job description must be at least 3 characters long' })
});

export const proficiencyLevelSchema = z.object({
  skill_name: z.string(),
  proficiency_level: z.string()
});

const toolSchema = z.object({
  tool_name: z.string(),
  proficiency_level: z.string()
});

const languageSchema = z.object({
  lang_name: z.string(),
  proficiency_level: z.string()
});

export const jobSchema = z.object({
  id: z.number().optional(),
  jobTitle: z.string().min(1, { message: 'Job title is required' }),
  employer: z.string().min(1, { message: 'Employer is required' }),
  description: z.string().optional().nullable(),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
  city: z.string().optional().nullable()
});

export const educationSchema = z.object({
  id: z.number().optional(),
  school: z.string().optional().nullable(),
  degree: z.string().optional().nullable(),
  field: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
  city: z.string().optional().nullable()
});

export const certificateSchema = z.object({
  name: z.string().optional().nullable(),
  issuer: z.string().optional().nullable(),
  issueDate: z.string().optional().nullable(),
  expirationDate: z.string().optional().nullable(),
  credentialId: z.string().optional().nullable(),
  credentialUrl: z.string().optional().nullable(),
  description: z.string().optional().nullable()
});

export const extracurricularSchema = z.object({
  activityName: z.string().optional().nullable(),
  organization: z.string().optional().nullable(),
  role: z.string().optional().nullable(),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
  description: z.string().optional().nullable()
});

export const resumeEditFormSchema = z.object({
  resume_id: z.string().optional(),
  personal_details: z
    .object({
      resume_job_title: z.string().optional().nullable(),
      fname: z.string().optional().nullable(),
      lname: z.string().optional().nullable(),
      email: z.string().optional().nullable(),
      phone: z.string().optional().nullable(),
      country: z.string().optional().nullable(),
      city: z.string().optional().nullable(),
      summary: z.string().optional().nullable()
    })
    .optional(),

  jobs: z.array(jobSchema).optional(),
  educations: z.array(educationSchema).optional(),
  skills: z.array(proficiencyLevelSchema).optional(),
  tools: z.array(toolSchema).optional(),
  languages: z.array(languageSchema).optional(),
  certificates: z.array(certificateSchema).optional(),
  extracurriculars: z.array(extracurricularSchema).optional()
});

export type TResumeEditFormValues = z.infer<typeof resumeEditFormSchema>;

export type TResumeFormValues = {
  jd_job_title: string;
  employer: string;
  jd_post_details: string;
};
