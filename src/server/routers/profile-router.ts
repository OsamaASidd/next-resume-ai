import { z } from 'zod';
import { j, privateProcedure } from '../jstack';
import { profileSchema } from '@/features/profile/utils/form-schema';
import { db } from '../db';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import {
  certificates,
  extracurriculars,
  profiles,
  jobs,
  educations
} from '../db/schema';
import { Education, Job, Profile } from '../db/schema/profiles';

export type ProfileWithRelations = Profile & {
  jobs: Job[];
  educations: Education[];
  certificates: Array<{
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    profileId: string;
    issuer: string;
    issueDate: string | null;
    expirationDate: string | null;
    credentialId: string | null;
    credentialUrl: string | null;
    description: string | null;
  }>;
  extracurriculars: Array<{
    id: number;
    createdAt: Date;
    updatedAt: Date;
    profileId: string;
    activityName: string;
    organization: string;
    role: string | null;
    startDate: string | null;
    endDate: string | null;
    description: string | null;
  }>;
};

export const profileRouter = j.router({
  getProfiles: privateProcedure.query(async ({ c, ctx }) => {
    const { user } = ctx;
    const userProfiles = (await db.query.profiles.findMany({
      where: eq(profiles.userId, user.id),
      with: {
        jobs: true,
        educations: true,
        certificates: true,
        extracurriculars: true
      }
    })) as ProfileWithRelations[];

    return c.json(userProfiles);
  }),

  createProfile: privateProcedure
    .input(profileSchema)
    .mutation(async ({ c, ctx, input }) => {
      const { user } = ctx;
      return await db.transaction(async (tx) => {
        const [createdProfile] = await tx
          .insert(profiles)
          .values({
            id: nanoid(),
            userId: user.id,
            firstname: input.firstname,
            lastname: input.lastname,
            email: input.email,
            contactno: input.contactno || null,
            country: input.country || null,
            city: input.city || null
          })
          .returning();

        if (input.jobs?.length) {
          await tx.insert(jobs).values(
            input.jobs.map((job) => ({
              profileId: createdProfile.id,
              jobTitle: job.jobTitle,
              employer: job.employer,
              description: job.description,
              startDate: job.startDate,
              endDate: job.endDate,
              city: job.city
            }))
          );
        }

        if (input.educations?.length) {
          await tx.insert(educations).values(
            input.educations.map((edu) => ({
              profileId: createdProfile.id,
              school: edu.school,
              degree: edu.degree,
              field: edu.field,
              description: edu.description,
              startDate: edu.startDate,
              endDate: edu.endDate,
              city: edu.city
            }))
          );
        }

        if (input.certificates?.length) {
          await tx.insert(certificates).values(
            input.certificates.map((cert) => ({
              profileId: createdProfile.id,
              name: cert.name!,
              issuer: cert.issuer!,
              issueDate: cert.issueDate!, // Keep as string
              expirationDate: cert.expirationDate || null, // Keep as string
              credentialId: cert.credentialId || null,
              credentialUrl: cert.credentialUrl || null,
              description: cert.description || null
            }))
          );
        }

        if (input.extracurriculars?.length) {
          await tx.insert(extracurriculars).values(
            input.extracurriculars.map((eca) => ({
              profileId: createdProfile.id,
              activityName: eca.activityName!,
              organization: eca.organization!,
              role: eca.role || null,
              startDate: eca.startDate!, // Keep as string
              endDate: eca.endDate!, // Keep as string
              description: eca.description || null
            }))
          );
        }

        const completeProfile = await tx.query.profiles.findFirst({
          where: (profiles, { eq }) => eq(profiles.id, createdProfile.id),
          with: {
            jobs: true,
            educations: true,
            certificates: true,
            extracurriculars: true
          }
        });
        return c.json(completeProfile);
      });
    }),

  updateProfile: privateProcedure
    .input(z.object({ id: z.string(), ...profileSchema.shape }))
    .mutation(async ({ c, ctx, input }) => {
      const { id, ...inputData } = input;
      const { user } = ctx;
      return await db.transaction(async (tx) => {
        const [updatedProfile] = await tx
          .update(profiles)
          .set({
            firstname: inputData.firstname,
            lastname: inputData.lastname,
            email: inputData.email,
            contactno: inputData.contactno || null,
            country: inputData.country || null,
            city: inputData.city || null,
            updatedAt: new Date()
          })
          .where(eq(profiles.id, id))
          .returning();

        await tx.delete(jobs).where(eq(jobs.profileId, id));
        await tx.delete(educations).where(eq(educations.profileId, id));
        await tx.delete(certificates).where(eq(certificates.profileId, id));
        await tx
          .delete(extracurriculars)
          .where(eq(extracurriculars.profileId, id));

        if (inputData.jobs?.length) {
          await tx.insert(jobs).values(
            inputData.jobs.map((job) => ({
              profileId: id,
              jobTitle: job.jobTitle,
              employer: job.employer,
              description: job.description,
              startDate: job.startDate,
              endDate: job.endDate,
              city: job.city
            }))
          );
        }

        if (inputData.educations?.length) {
          await tx.insert(educations).values(
            inputData.educations.map((edu) => ({
              profileId: id,
              school: edu.school,
              degree: edu.degree,
              field: edu.field,
              description: edu.description,
              startDate: edu.startDate,
              endDate: edu.endDate,
              city: edu.city
            }))
          );
        }

        if (inputData.certificates?.length) {
          await tx.insert(certificates).values(
            inputData.certificates.map((cert) => ({
              profileId: id,
              name: cert.name!,
              issuer: cert.issuer!,
              issueDate: cert.issueDate!, // Keep as string
              expirationDate: cert.expirationDate || null, // Keep as string
              credentialId: cert.credentialId || null,
              credentialUrl: cert.credentialUrl || null,
              description: cert.description || null
            }))
          );
        }

        if (inputData.extracurriculars?.length) {
          await tx.insert(extracurriculars).values(
            inputData.extracurriculars.map((eca) => ({
              profileId: id,
              activityName: eca.activityName!,
              organization: eca.organization!,
              role: eca.role || null,
              startDate: eca.startDate!, // Keep as string
              endDate: eca.endDate!, // Keep as string
              description: eca.description || null
            }))
          );
        }

        const completeProfile = await tx.query.profiles.findFirst({
          where: (profiles, { eq }) => eq(profiles.id, id),
          with: {
            jobs: true,
            educations: true,
            certificates: true,
            extracurriculars: true
          }
        });
        return c.json(completeProfile);
      });
    })
});
