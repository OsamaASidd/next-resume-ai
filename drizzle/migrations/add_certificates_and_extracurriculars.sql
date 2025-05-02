CREATE TABLE "certificates" (
  "id" serial PRIMARY KEY NOT NULL,
  "profile_id" text NOT NULL,
  "name" text NOT NULL,
  "issuer" text NOT NULL,
  "issue_date" text,
  "expiration_date" text,
  "credential_id" text,
  "credential_url" text,
  "description" text,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "certificates_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE cascade ON UPDATE no action
);

CREATE TABLE "extracurriculars" (
  "id" serial PRIMARY KEY NOT NULL,
  "profile_id" text NOT NULL,
  "activity_name" text NOT NULL,
  "organization" text,
  "role" text,
  "start_date" text,
  "end_date" text,
  "description" text,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "extracurriculars_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE cascade ON UPDATE no action
);