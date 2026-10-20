-- Chat history. Deleting a conversation keeps the transfers (financial records) and just unlinks them.
CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner text NOT NULL DEFAULT 'demo',
  title text NOT NULL DEFAULT 'New chat',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS messages (
  id bigserial PRIMARY KEY,
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS messages_conversation ON messages (conversation_id, id);
CREATE INDEX IF NOT EXISTS conversations_owner_updated ON conversations (owner, updated_at DESC);

ALTER TABLE transfers ADD COLUMN IF NOT EXISTS conversation_id uuid REFERENCES conversations(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS transfers_created ON transfers (created_at DESC);
