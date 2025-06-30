// src/features/profile/utils/form-schema.ts
import { z } from 'zod';

export const jobSchema = z.object({
  id: z.number().optional(), // For existing jobs during updates
  jobTitle: z
    .string()
    .min(1, { message: 'Job title is required' })
    .optional()
    .or(z.literal('')),
  employer: z
    .string()
    .min(1, { message: 'Employer is required' })
    .optional()
    .or(z.literal('')),
  description: z.string().optional().nullable(),
  startDate: z
    .string()
    .optional()
    .nullable()
    .refine(
      (value) => !value || value === '' || /^\d{4}-\d{2}-\d{2}$/.test(value),
      {
        message: 'Start date should be in the format YYYY-MM-DD or empty'
      }
    ),
  endDate: z
    .string()
    .optional()
    .nullable()
    .refine(
      (value) => !value || value === '' || /^\d{4}-\d{2}-\d{2}$/.test(value),
      {
        message: 'End date should be in the format YYYY-MM-DD or empty'
      }
    ),
  city: z.string().optional().nullable()
});

export const educationSchema = z.object({
  id: z.number().optional(),
  school: z.string().optional().nullable(),
  degree: z.string().optional().nullable(),
  field: z.string().optional().nullable(), // Made optional and nullable
  description: z.string().optional().nullable(),
  startDate: z
    .string()
    .optional()
    .nullable()
    .refine(
      (value) => !value || value === '' || /^\d{4}-\d{2}-\d{2}$/.test(value),
      {
        message: 'Start date should be in the format YYYY-MM-DD or empty'
      }
    ),
  endDate: z
    .string()
    .optional()
    .nullable()
    .refine(
      (value) => !value || value === '' || /^\d{4}-\d{2}-\d{2}$/.test(value),
      {
        message: 'End date should be in the format YYYY-MM-DD or empty'
      }
    ),
  city: z.string().optional().nullable() // Made optional and nullable
});

// Add these new schemas
export const certificateSchema = z.object({
  id: z.number().optional(),
  name: z.string().optional().nullable(),
  issuer: z.string().optional().nullable(),
  issueDate: z
    .string()
    .optional()
    .nullable()
    .refine(
      (value) => !value || value === '' || /^\d{4}-\d{2}-\d{2}$/.test(value),
      {
        message: 'Issue date should be in the format YYYY-MM-DD or empty'
      }
    ),
  expirationDate: z.string().optional().nullable(),
  credentialId: z.string().optional().nullable(),
  credentialUrl: z
    .string()
    .url('Please enter a valid URL')
    .optional()
    .nullable()
    .or(z.literal('')), // Allow empty string
  description: z.string().optional().nullable()
});

export const extracurricularSchema = z.object({
  id: z.number().optional(),
  activityName: z.string().optional().nullable(),
  organization: z.string().optional().nullable(),
  role: z.string().optional().nullable(),
  startDate: z
    .string()
    .optional()
    .nullable()
    .refine(
      (value) => !value || value === '' || /^\d{4}-\d{2}-\d{2}$/.test(value),
      {
        message: 'Start date should be in the format YYYY-MM-DD or empty'
      }
    ),
  endDate: z
    .string()
    .optional()
    .nullable()
    .refine(
      (value) => !value || value === '' || /^\d{4}-\d{2}-\d{2}$/.test(value),
      {
        message: 'End date should be in the format YYYY-MM-DD or empty'
      }
    ),
  description: z.string().optional().nullable()
});

// Update the profile schema to be more flexible
export const profileSchema = z.object({
  firstname: z.string().min(1, { message: 'First name is required' }),
  lastname: z.string().min(1, { message: 'Last name is required' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  contactno: z
    .string()
    .min(1, { message: 'Contact number is required' })
    .optional()
    .or(z.literal('')), // Allow empty string
  country: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  jobs: z.array(jobSchema).default([]),
  educations: z.array(educationSchema).default([]),
  certificates: z.array(certificateSchema).default([]),
  extracurriculars: z.array(extracurricularSchema).default([])
});

// For updates, we need an ID
export const updateProfileSchema = profileSchema.extend({
  id: z.string()
});

export type TProfileFormValues = z.infer<typeof profileSchema>;
export type TUpdateProfileFormValues = z.infer<typeof updateProfileSchema>;
export type TJobFormValues = z.infer<typeof jobSchema>;
export type TEducationFormValues = z.infer<typeof educationSchema>;
export type TCertificateFormValues = z.infer<typeof certificateSchema>;
export type TExtracurricularFormValues = z.infer<typeof extracurricularSchema>;
