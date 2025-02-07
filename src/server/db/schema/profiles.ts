import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { accounts } from './accounts';

export const profiles = pgTable('profiles', {
  id: text('id').primaryKey().notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => accounts.id),
  firstname: text('firstname').notNull(),
  lastname: text('lastname').notNull(),
  email: text('email').notNull(),
  contactno: text('contact_no').notNull(),
  country: text('country').notNull(),
  city: text('city').notNull(),
  // Store jobs as a JSON array since PostgreSQL supports it
  jobs: text('jobs').array().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;
