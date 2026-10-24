-- State of the built-in PayPal simulator (orders, payouts, refunds and webhook deliveries).
-- Only used when NEXT_PUBLIC_PAYPAL_MODE=simulate. Harmless otherwise.
CREATE TABLE IF NOT EXISTS sim_paypal (
  kind text NOT NULL,            -- order | payout | refund | webhook
  id text NOT NULL,
  data jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (kind, id)
);
CREATE INDEX IF NOT EXISTS sim_paypal_created ON sim_paypal (created_at DESC);