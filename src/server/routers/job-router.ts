import { z } from 'zod';
import { j, privateProcedure } from '../jstack';
import { HTTPException } from 'hono/http-exception';
import { nanoid } from 'nanoid';

const jobInfoSchema = z.object({
  userId: z.string(),
  companyName: z.string().min(1, 'Company name is required'),
  jobTitle: z.string().min(1, 'Job title is required'),
  jobDescription: z.string().min(1, 'Job description is required'),
  additionalRequirements: z.string().optional()
});

export const jobRouter = j.router({
  createJobInfo: privateProcedure
    .input(jobInfoSchema)
    .mutation(async ({ c, ctx, input }) => {
      const { user } = ctx;

      if (user.id !== input.userId) {
        throw new HTTPException(403, { message: 'Forbidden' });
      }

      // Here you would save to database
      return c.superjson({
        message: 'Job info saved',
        data: {
          jobId: nanoid(),
          ...input
        }
      });
    })
});
