CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS transfers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_name text NOT NULL,
  recipient_name text NOT NULL,
  recipient_phone text NOT NULL,
  recipient_country text NOT NULL DEFAULT 'KE',
  amount_usd_cents integer NOT NULL CHECK (amount_usd_cents > 0),
  fee_usd_cents integer NOT NULL,
  fx_rate numeric(12,4) NOT NULL,
  payout_local_amount numeric(14,2) NOT NULL,
  payout_currency text NOT NULL DEFAULT 'KES',
  purpose text,
  language text NOT NULL DEFAULT 'en',
  status text NOT NULL DEFAULT 'draft',
  paypal_order_id text UNIQUE,
  paypal_capture_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS transfer_events (
  id bigserial PRIMARY KEY,
  transfer_id uuid NOT NULL REFERENCES transfers(id),
  from_status text,
  to_status text NOT NULL,
  detail jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- webhook idempotency: one row per PayPal event id
CREATE TABLE IF NOT EXISTS webhook_events (
  id text PRIMARY KEY,
  received_at timestamptz NOT NULL DEFAULT now()
);
