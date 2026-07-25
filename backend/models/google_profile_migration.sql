-- Adds profile fields populated from Google Sign-In and general profile use.
-- Existing rows and existing login/signup logic are unaffected.

ALTER TABLE users ADD COLUMN IF NOT EXISTS picture_url TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS address TEXT;
