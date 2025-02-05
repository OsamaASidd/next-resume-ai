import { currentUser } from '@clerk/nextjs/server';
import { HTTPException } from 'hono/http-exception';
import { nanoid } from 'nanoid';
import { db } from '../db';
import { accounts } from '../db/schema';
import { j, privateProcedure, publicProcedure } from '../jstack';

export const authRouter = j.router({
  getDatabaseSyncStatus: privateProcedure.query(async ({ c }) => {
    const auth = await currentUser();

    if (!auth) {
      return c.json({ isSynced: false });
    }

    const account = await db.query.accounts.findFirst({
      where: (accounts, { eq }) => eq(accounts.externalId, auth.id)
    });

    if (!account) {
      const [newAccount] = await db
        .insert(accounts)
        .values({
          id: nanoid(),
          externalId: auth.id,
          email: auth.emailAddresses[0].emailAddress
        })
        .returning();

      return c.json({
        isSynced: true,
        account: newAccount
      });
    }

    return c.json({
      isSynced: true,
      account
    });
  })
});
