import { text, timestamp, pgTable } from 'drizzle-orm/pg-core';
import { accounts } from './accounts';

export const users = pgTable('users', {
  id: text('id').primaryKey().notNull(),
  accountId: text('account_id')
    .notNull()
    .references(() => accounts.id),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  address: text('address').notNull(),
  linkedin: text('linkedin').notNull(),
  github: text('github').notNull(),
  skills: text('skills').array().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
