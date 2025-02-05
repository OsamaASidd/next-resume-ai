import { eq } from 'drizzle-orm';
import { HTTPException } from 'hono/http-exception';
import { nanoid } from 'nanoid';
import { z } from 'zod';
import { db } from '../db';
import { users } from '../db/schema/users';
import { j, privateProcedure, publicProcedure } from '../jstack';

// Input validation schema for user info
const userInfoSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number'),
  address: z.string().min(1, 'Address is required'),
  linkedin: z.string().url('Invalid LinkedIn URL'),
  github: z.string().url('Invalid GitHub URL'),
  skills: z.array(z.string()).min(1, 'At least one skill is required')
});

export const userRouter = j.router({
  // Public procedures
  createBasicInfo: publicProcedure
    .input(userInfoSchema)
    .mutation(async ({ c, ctx, input }) => {
      const newUser = { id: nanoid(), ...input };
      const [createdUser] = await db.insert(users).values(newUser).returning();
      return c.superjson({ message: 'User created', data: createdUser });
    }),

  // Protected procedures
  getBasicInfo: privateProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ c, ctx, input }) => {
      const { user } = ctx;
      const { userId } = input;

      if (user.id !== userId) {
        throw new HTTPException(403, { message: 'Forbidden' });
      }

      const userData = await db.query.users.findFirst({
        where: eq(users.id, userId)
      });

      if (!userData) {
        throw new HTTPException(404, { message: 'User not found' });
      }

      return c.superjson(userData);
    })
});
