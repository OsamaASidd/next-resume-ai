import { pgTable, text, timestamp, serial } from 'drizzle-orm/pg-core';
import { profiles } from './profiles';

export const certificates = pgTable('certificates', {
  id: serial('id').primaryKey(),
  profileId: text('profile_id')
    .notNull()
    .references(() => profiles.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  issuer: text('issuer').notNull(),
  issueDate: text('issue_date'),
  expirationDate: text('expiration_date'),
  credentialId: text('credential_id'),
  credentialUrl: text('credential_url'),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});
