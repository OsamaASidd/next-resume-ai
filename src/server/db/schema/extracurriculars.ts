import { pgTable, text, timestamp, serial } from 'drizzle-orm/pg-core';
import { profiles } from './profiles';

export const extracurriculars = pgTable('extracurriculars', {
  id: serial('id').primaryKey(),
  profileId: text('profile_id')
    .notNull()
    .references(() => profiles.id, { onDelete: 'cascade' }),
  activityName: text('activity_name').notNull(),
  organization: text('organization'),
  role: text('role'),
  startDate: text('start_date'),
  endDate: text('end_date'),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});
