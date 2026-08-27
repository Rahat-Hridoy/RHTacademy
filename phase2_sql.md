-- 1. Add Password Column to Registration Requests
-- We add a password column so the user's password can be temporarily stored until admin approval.
ALTER TABLE registration_requests ADD COLUMN password TEXT NOT NULL DEFAULT '';

-- 2. Create OTPs table for Forgot Password flow
CREATE TABLE otps (
    email TEXT PRIMARY KEY,
    otp TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL
);

-- Note: Ensure RLS is enabled and accessible for Server Actions
ALTER TABLE otps ENABLE ROW LEVEL SECURITY;
-- We do not add public policies to otps because only the Server Action (using Service Role key) should interact with it.
