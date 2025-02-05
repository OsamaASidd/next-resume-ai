import { z } from 'zod';
import { j, privateProcedure } from '../jstack';
import { db } from '../db';
import { resumes } from '../db/schema/resumes';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import {
  resumeFormSchema,
  resumeEditFormSchema
} from '@/features/resume/utils/form-schema';

export const resumeRouter = j.router({
  // Create a new resume
  createResume: privateProcedure
    .input(
      z.object({
        profileId: z.string(),
        ...resumeFormSchema.shape
      })
    )
    .mutation(async ({ c, ctx, input }) => {
      const { user } = ctx;
      const { profileId, ...resumeData } = input;

      const newResume = {
        id: nanoid(),
        profileId,
        jdJobTitle: resumeData.jd_job_title,
        employer: resumeData.employer,
        jdPostDetails: resumeData.jd_post_details
      };

      const [created] = await db.insert(resumes).values(newResume).returning();

      return c.json(created);
    }),

  // Get a resume by ID
  getResume: privateProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ c, ctx, input }) => {
      const resume = await db.query.resumes.findFirst({
        where: eq(resumes.id, input.id)
      });

      if (!resume) {
        return c.json({ error: 'Resume not found' }, 404);
      }

      return c.json(resume);
    }),

  // Update a resume
  updateResume: privateProcedure
    .input(
      z.object({
        id: z.string(),
        ...resumeEditFormSchema.shape
      })
    )
    .mutation(async ({ c, ctx, input }) => {
      const { id, ...updateData } = input;

      const [updated] = await db
        .update(resumes)
        .set({
          ...updateData,
          updatedAt: new Date()
        })
        .where(eq(resumes.id, id))
        .returning();

      return c.json(updated);
    }),

  // Get all resumes for a profile
  getProfileResumes: privateProcedure
    .input(z.object({ profileId: z.string() }))
    .query(async ({ c, ctx, input }) => {
      const profileResumes = await db.query.resumes.findMany({
        where: eq(resumes.profileId, input.profileId)
      });

      return c.json(profileResumes);
    })
});
