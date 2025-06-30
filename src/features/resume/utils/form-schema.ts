import * as z from 'zod';

// for resume creation page
export const resumeFormSchema = z.object({
  jd_job_title: z.string().min(3, { message: 'Please enter job title' }),
  employer: z
    .string()
    .min(3, { message: 'Employer name must be at least 3 characters long' }),
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
  jobTitle: z
    .string()
    .min(3, { message: 'Job title must be at least 3 characters' }),
  employer: z
    .string()
    .min(3, { message: 'Employer must be at least 3 characters' }),
  description: z.string().optional(),
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: 'Start date should be YYYY-MM-DD'
    }),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'End date should be YYYY-MM-DD' }),
  city: z.string().min(1, { message: 'Please select a city' })
});

export const educationSchema = z.object({
  id: z.number().optional(),
  school: z
    .string()
    .min(3, { message: 'School name must be at least 3 characters' }),
  degree: z
    .string()
    .min(3, { message: 'Degree name must be at least 3 characters' }),
  field: z
    .string()
    .min(3, { message: 'Field name must be at least 3 characters' }),
  description: z.string().optional(),
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: 'Start date should be YYYY-MM-DD'
    }),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'End date should be YYYY-MM-DD' }),
  city: z.string().min(1, { message: 'Please select a city' })
});

// — NEW: certificateSchema & extracurricularSchema —
export const certificateSchema = z.object({
  name: z.string().min(1, { message: 'Certificate name required' }),
  issuer: z.string().min(1, { message: 'Issuer required' }),
  issueDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: 'Issue date should be YYYY-MM-DD'
    }),
  expirationDate: z.string().optional(),
  credentialId: z.string().optional(),
  credentialUrl: z.string().url().optional(),
  description: z.string().optional()
});

export const extracurricularSchema = z.object({
  activityName: z.string().min(1, { message: 'Activity name required' }),
  organization: z.string().min(1, { message: 'Organization required' }),
  role: z.string().optional(),
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: 'Start date should be YYYY-MM-DD'
    }),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'End date should be YYYY-MM-DD' }),
  description: z.string().optional()
});

// — UPDATED resumeEditFormSchema —
export const resumeEditFormSchema = z.object({
  resume_id: z.string().optional(),
  personal_details: z
    .object({
      resume_job_title: z.string().min(3).optional(),
      fname: z.string().min(3).optional(),
      lname: z.string().min(1).optional(),
      email: z.string().email().optional(),
      phone: z.string().optional(),
      country: z.string().optional(),
      city: z.string().optional(),
      summary: z.string().min(3).optional().nullable()
    })
    .optional(),

  jobs: z.array(jobSchema).optional(),
  educations: z.array(educationSchema).optional(),
  skills: z.array(proficiencyLevelSchema).optional(),
  tools: z.array(toolSchema).optional(),
  languages: z.array(languageSchema).optional(),

  // ← newly added:
  certificates: z.array(certificateSchema).optional(),
  extracurriculars: z.array(extracurricularSchema).optional()
});

// only infer once, remove any duplicate manual type
export type TResumeEditFormValues = z.infer<typeof resumeEditFormSchema>;

export type TResumeFormValues = {
  jd_job_title: string;
  employer: string;
  jd_post_details: string;
};
