CREATE TABLE IF NOT EXISTS recipients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner text NOT NULL DEFAULT 'demo',
  name text NOT NULL,
  phone text NOT NULL,
  country text NOT NULL DEFAULT 'KE',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS recipients_owner_name ON recipients (owner, lower(name));

-- demo seed so "send $50 to mama" works out of the box
INSERT INTO recipients (owner, name, phone, country)
VALUES ('demo', 'mama', '+254700000000', 'KE')
ON CONFLICT DO NOTHING;
