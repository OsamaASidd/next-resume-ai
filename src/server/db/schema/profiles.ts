// src/server/db/schema/profiles.ts
import { pgTable, text, timestamp, integer, serial } from 'drizzle-orm/pg-core';
import { accounts } from './accounts';
import { relations } from 'drizzle-orm';
import { certificates } from './certificates';
import { extracurriculars } from './extracurriculars';

// Main profiles table
export const profiles = pgTable('profiles', {
  id: text('id').primaryKey().notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => accounts.id),
  firstname: text('firstname').notNull(),
  lastname: text('lastname').notNull(),
  email: text('email').notNull(),
  contactno: text('contact_no'), // Removed .notNull()
  country: text('country'), // Removed .notNull()
  city: text('city'), // Removed .notNull()
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Jobs table with reference to profile - made all fields nullable except required ones
export const jobs = pgTable('jobs', {
  id: serial('id').primaryKey(),
  profileId: text('profile_id')
    .notNull()
    .references(() => profiles.id),
  jobTitle: text('job_title'), // Already nullable
  employer: text('employer'), // Already nullable
  description: text('description'), // Already nullable
  startDate: text('start_date'), // Already nullable
  endDate: text('end_date'), // Already nullable
  city: text('city'), // Already nullable
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Education table with reference to profile - made all fields nullable except required ones
export const educations = pgTable('educations', {
  id: serial('id').primaryKey(),
  profileId: text('profile_id')
    .notNull()
    .references(() => profiles.id, { onDelete: 'cascade' }),
  school: text('school'), // Already nullable
  degree: text('degree'), // Already nullable
  field: text('field'), // Already nullable
  description: text('description'), // Already nullable
  startDate: text('start_date'), // Already nullable
  endDate: text('end_date'), // Already nullable
  city: text('city'), // Already nullable
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Define relationships for profiles
export const profilesRelations = relations(profiles, ({ many }) => ({
  jobs: many(jobs),
  educations: many(educations),
  certificates: many(certificates),
  extracurriculars: many(extracurriculars)
}));

// Define relationships for certificates
export const certificatesRelations = relations(certificates, ({ one }) => ({
  profile: one(profiles, {
    fields: [certificates.profileId],
    references: [profiles.id]
  })
}));

// Define relationships for extracurriculars
export const extracurricularsRelations = relations(
  extracurriculars,
  ({ one }) => ({
    profile: one(profiles, {
      fields: [extracurriculars.profileId],
      references: [profiles.id]
    })
  })
);

// Define relationships for jobs
export const jobsRelations = relations(jobs, ({ one }) => ({
  profile: one(profiles, {
    fields: [jobs.profileId],
    references: [profiles.id]
  })
}));

// Define relationships for educations
export const educationsRelations = relations(educations, ({ one }) => ({
  profile: one(profiles, {
    fields: [educations.profileId],
    references: [profiles.id]
  })
}));

// Type inference
export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;
export type Job = typeof jobs.$inferSelect;
export type NewJob = typeof jobs.$inferInsert;
export type Education = typeof educations.$inferSelect;
export type NewEducation = typeof educations.$inferInsert;
export type Certificate = typeof certificates.$inferSelect;
export type NewCertificate = typeof certificates.$inferInsert;
export type Extracurricular = typeof extracurriculars.$inferSelect;
export type NewExtracurricular = typeof extracurriculars.$inferInsert;
