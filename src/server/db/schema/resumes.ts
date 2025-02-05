import { text, timestamp, integer, pgTable, jsonb } from 'drizzle-orm/pg-core';
import { profiles } from './profiles';

export const resumes = pgTable('resumes', {
  id: text('id').primaryKey().notNull(),
  profileId: text('profile_id')
    .notNull()
    .references(() => profiles.id),
  jdJobTitle: text('jd_job_title').notNull(),
  employer: text('employer').notNull(),
  jdPostDetails: text('jd_post_details').notNull(),
  personalDetails: jsonb('personal_details'),
  jobs: jsonb('jobs').array(),
  education: jsonb('education').array(),
  skills: jsonb('skills').array(),
  tools: jsonb('tools').array(),
  languages: jsonb('languages').array(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export type Resume = typeof resumes.$inferSelect;
export type NewResume = typeof resumes.$inferInsert;
