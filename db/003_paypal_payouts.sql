-- Payout leg goes through PayPal Payouts (recipient identified by PayPal email), not mobile money.
ALTER TABLE recipients ADD COLUMN IF NOT EXISTS paypal_email text;
ALTER TABLE recipients ALTER COLUMN phone DROP NOT NULL;
ALTER TABLE transfers ADD COLUMN IF NOT EXISTS recipient_email text;
ALTER TABLE transfers ADD COLUMN IF NOT EXISTS payout_batch_id text;
ALTER TABLE transfers ALTER COLUMN recipient_phone DROP NOT NULL;

-- Replace with the email of a SANDBOX personal account that acts as "mama"
UPDATE recipients SET paypal_email = 'REPLACE-WITH-SANDBOX-PERSONAL-EMAIL'
WHERE owner = 'demo' AND lower(name) = 'mama' AND paypal_email IS NULL;
