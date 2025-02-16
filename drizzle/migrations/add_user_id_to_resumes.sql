
ALTER TABLE "resumes" 
ADD COLUMN "user_id" text NOT NULL REFERENCES "accounts"("id");

-- Backfill existing resumes with user_id from their profiles
UPDATE "resumes" r 
SET user_id = p.user_id 
FROM "profiles" p 
WHERE r.profile_id = p.id; 