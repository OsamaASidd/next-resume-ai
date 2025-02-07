import { jstack } from 'jstack';
import { HTTPException } from 'hono/http-exception';
import { currentUser } from '@clerk/nextjs/server';
import { db } from './db';

interface Env {
  Bindings: { DATABASE_URL: string };
}

export const j = jstack.init<Env>();

// Auth middleware for protected routes
const authMiddleware = j.middleware(async ({ c, next }) => {
  try {
    const authHeader = c.req.header('Authorization');
    //todo: bearer token need to handle in schema and table.
    if (authHeader) {
      const apiKey = authHeader.split(' ')[1]; // bearer <API_KEY>
      console.log('header', apiKey);
      const user = await db.query.accounts.findFirst({
        where: (accounts, { eq }) => eq(accounts.id, apiKey)
      });

      if (user) return next({ user });
    }

    const auth = await currentUser();

    console.log('auth', auth);

    if (!auth) {
      throw new HTTPException(401, { message: 'Unauthorized' });
    }

    const user = await db.query.accounts.findFirst({
      where: (accounts, { eq }) => eq(accounts.externalId, auth.id)
    });

    if (!user) {
      throw new HTTPException(401, { message: 'Unauthorized' });
    }

    return next({ user });
  } catch (error) {
    console.log('error', error);
    // throw new HTTPException(401, { message: 'Unauthorized' });
  }
});

export const publicProcedure = j.procedure;
export const privateProcedure = publicProcedure.use(authMiddleware);
