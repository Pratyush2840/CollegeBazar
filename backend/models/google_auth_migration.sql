-- Adds support for Google OAuth accounts alongside existing email/password accounts.
-- Existing rows and existing login/signup logic are unaffected.

ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id VARCHAR(255) UNIQUE;
ALTER TABLE users ALTER COLUMN password DROP NOT NULL;
ALTER TABLE users ALTER COLUMN roll_no DROP NOT NULL;
