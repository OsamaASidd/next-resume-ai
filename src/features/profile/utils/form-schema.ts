import { z } from 'zod';

export const jobSchema = z.object({
  id: z.number().optional(), // For existing jobs during updates
  jobTitle: z
    .string()
    .min(3, { message: 'Job title must be at least 3 characters' }),
  employer: z
    .string()
    .min(3, { message: 'Employer must be at least 3 characters' }),
  description: z.string().optional(),
  startDate: z.string().refine((value) => /^\d{4}-\d{2}-\d{2}$/.test(value), {
    message: 'Start date should be in the format YYYY-MM-DD'
  }),
  endDate: z.string().refine((value) => /^\d{4}-\d{2}-\d{2}$/.test(value), {
    message: 'End date should be in the format YYYY-MM-DD'
  }),
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
  startDate: z.string().refine((value) => /^\d{4}-\d{2}-\d{2}$/.test(value), {
    message: 'Start date should be in the format YYYY-MM-DD'
  }),
  endDate: z.string().refine((value) => /^\d{4}-\d{2}-\d{2}$/.test(value), {
    message: 'End date should be in the format YYYY-MM-DD'
  }),
  city: z.string().min(1, { message: 'Please select a city' })
});

// Add these new schemas
export const certificateSchema = z.object({
  id: z.number().optional(),
  name: z
    .string()
    .min(3, { message: 'Certificate name must be at least 3 characters' }),
  issuer: z
    .string()
    .min(3, { message: 'Issuer name must be at least 3 characters' }),
  issueDate: z.string().refine((value) => /^\d{4}-\d{2}-\d{2}$/.test(value), {
    message: 'Issue date should be in the format YYYY-MM-DD'
  }),
  expirationDate: z.string().optional(),
  credentialId: z.string().optional(),
  credentialUrl: z
    .string()
    .url('Please enter a valid URL')
    .optional()
    .nullable(),
  description: z.string().optional()
});

export const extracurricularSchema = z.object({
  id: z.number().optional(),
  activityName: z
    .string()
    .min(3, { message: 'Activity name must be at least 3 characters' }),
  organization: z.string().min(1, { message: 'Organization is required' }),
  role: z.string().optional(),
  startDate: z.string().refine((value) => /^\d{4}-\d{2}-\d{2}$/.test(value), {
    message: 'Start date should be in the format YYYY-MM-DD'
  }),
  endDate: z.string().refine((value) => /^\d{4}-\d{2}-\d{2}$/.test(value), {
    message: 'End date should be in the format YYYY-MM-DD'
  }),
  description: z.string().optional()
});

// Update the profile schema to include the new arrays
export const profileSchema = z.object({
  firstname: z
    .string()
    .min(3, { message: 'First name must be at least 3 characters' }),
  lastname: z
    .string()
    .min(1, { message: 'Last name must be at least 1 characters long' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  contactno: z.string().refine((val) => /^\d{10}$/.test(val), {
    message: 'Contact number must be 10 digits'
  }),
  country: z.string().min(1, { message: 'Please select a country' }),
  city: z.string().min(1, { message: 'Please select a city' }),
  jobs: z.array(jobSchema),
  educations: z.array(educationSchema),
  certificates: z.array(certificateSchema),
  extracurriculars: z.array(extracurricularSchema)
});

// Type definitions
export type TCertificateFormValues = z.infer<typeof certificateSchema>;
export type TExtracurricularFormValues = z.infer<typeof extracurricularSchema>;

// For updates, we need an ID
export const updateProfileSchema = profileSchema.extend({
  id: z.string()
});

export type TProfileFormValues = z.infer<typeof profileSchema>;
export type TUpdateProfileFormValues = z.infer<typeof updateProfileSchema>;
export type TJobFormValues = z.infer<typeof jobSchema>;
export type TEducationFormValues = z.infer<typeof educationSchema>;
