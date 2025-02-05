import { z } from 'zod';
import { j, privateProcedure } from '../jstack';
import { profileSchema } from '@/features/profile/utils/form-schema';
import { db } from '../db';
import { profiles } from '../db/schema';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';

export const profileRouter = j.router({
  getProfiles: privateProcedure.query(async ({ c, ctx }) => {
    const { user } = ctx;
    const userProfiles = await db.query.profiles.findMany({
      where: eq(profiles.userId, user.id)
    });
    return c.json(userProfiles);
  }),

  createProfile: privateProcedure
    .input(profileSchema)
    .mutation(async ({ c, ctx, input }) => {
      const { user } = ctx;
      const newProfile = {
        id: nanoid(),
        userId: user.id,
        ...input,
        contactno: input.contactno.toString(),
        jobs: input.jobs.map((job) => JSON.stringify(job))
      };

      const [created] = await db
        .insert(profiles)
        .values(newProfile)
        .returning();

      return c.json(created);
    }),

  updateProfile: privateProcedure
    .input(z.object({ id: z.string(), ...profileSchema.shape }))
    .mutation(async ({ c, ctx, input }) => {
      const { id, ...inputData } = input;
      const { user } = ctx;

      const data = {
        contactno: inputData.contactno.toString(),
        jobs: inputData.jobs.map((job) => JSON.stringify(job))
      };

      const [updated] = await db
        .update(profiles)
        .set(data)
        .where(eq(profiles.id, id))
        .returning();

      return c.json(updated);
    })
});
