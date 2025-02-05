import { jstack } from 'jstack';
import { HTTPException } from 'hono/http-exception';

interface Env {
  Bindings: { DATABASE_URL: string };
}

export const j = jstack.init<Env>();

// Auth middleware for protected routes
const authMiddleware = j.middleware(async ({ c, next }) => {
  const authHeader = c.req.header('authorization');

  if (!authHeader) {
    throw new HTTPException(401, {
      message: 'Unauthorized, sign in to continue.'
    });
  }

  // Add user to context
  return next({ user: { id: authHeader } });
});

export const publicProcedure = j.procedure;
export const privateProcedure = publicProcedure.use(authMiddleware);
