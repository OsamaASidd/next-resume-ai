import { text, timestamp, integer, pgTable } from 'drizzle-orm/pg-core';

export const accounts = pgTable('accounts', {
  id: text('id').primaryKey().notNull(),
  externalId: text('external_id').unique().notNull(),
  email: text('email').notNull(),
  quotaLimit: integer('quota_limit').notNull().default(100),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export type Account = typeof accounts.$inferSelect;
export type NewAccount = typeof accounts.$inferInsert;
