import { eq } from 'drizzle-orm';
import { HTTPException } from 'hono/http-exception';
import { nanoid } from 'nanoid';
import { z } from 'zod';
import { db } from '../db';
import { users } from '../db/schema/users';
import { j, privateProcedure, publicProcedure } from '../jstack';
import { accounts } from '../db/schema/accounts';

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
  createBasicInfo: privateProcedure
    .input(userInfoSchema)
    .mutation(async ({ c, ctx, input }) => {
      const { user } = ctx; // This is the Clerk user ID from auth middleware

      // Get the account record
      const account = await db.query.accounts.findFirst({
        where: (accounts, { eq }) => eq(accounts.externalId, user.id)
      });

      if (!account) {
        throw new HTTPException(401, { message: 'Account not found' });
      }

      const newUser = {
        id: nanoid(),
        accountId: account.id, // Link to the account
        ...input
      };

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
