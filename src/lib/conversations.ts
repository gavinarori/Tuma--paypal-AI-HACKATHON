import { pool } from "./db";

const OWNER = "demo"; // single demo user, like recipients; add real auth before using this with real people
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const isUuid = (s: unknown): s is string => typeof s === "string" && UUID.test(s);

export function titleFrom(text: string) {
  const t = text.replace(/\s+/g, " ").trim();
  return !t ? "New chat" : t.length > 48 ? `${t.slice(0, 47)}…` : t;
}

/** Stores one user message and Tuma's reply. Creates the conversation on the first turn. Never throws. */
export async function saveTurn(conversationId: unknown, userText: string, assistantText: string): Promise<string | null> {
  try {
    let id: string | null = null;
    if (isUuid(conversationId)) {
      const r = await pool.query("UPDATE conversations SET updated_at = now() WHERE id = $1 AND owner = $2 RETURNING id", [conversationId, OWNER]);
      if (r.rows[0]) id = r.rows[0].id as string;
    }
    if (!id) {
      const r = await pool.query("INSERT INTO conversations (owner, title) VALUES ($1, $2) RETURNING id", [OWNER, titleFrom(userText)]);
      id = r.rows[0].id as string;
    }
    await pool.query("INSERT INTO messages (conversation_id, role, content) VALUES ($1, 'user', $2), ($1, 'assistant', $3)", [id, userText, assistantText]);
    return id;
  } catch (e) {
    console.error("saving the conversation failed:", (e as Error).message); // the chat itself keeps working
    return null;
  }
}

export async function listConversations() {
  const r = await pool.query("SELECT id, title, updated_at FROM conversations WHERE owner = $1 ORDER BY updated_at DESC LIMIT 50", [OWNER]);
  return r.rows;
}

export async function getConversation(id: unknown) {
  if (!isUuid(id)) return null;
  const c = await pool.query("SELECT id, title, created_at, updated_at FROM conversations WHERE id = $1 AND owner = $2", [id, OWNER]);
  if (!c.rows[0]) return null;
  const m = await pool.query("SELECT role, content, created_at FROM messages WHERE conversation_id = $1 ORDER BY id", [id]);
  const t = await pool.query(
    "SELECT id, recipient_name, amount_usd_cents, status, created_at FROM transfers WHERE conversation_id = $1 AND status <> 'draft' ORDER BY created_at", [id]
  );
  return { conversation: c.rows[0], messages: m.rows, transfers: t.rows };
}

export async function deleteConversation(id: unknown) {
  if (!isUuid(id)) return false;
  const r = await pool.query("DELETE FROM conversations WHERE id = $1 AND owner = $2", [id, OWNER]);
  return (r.rowCount ?? 0) > 0;
}

/** Transaction history, newest first. Drafts (never sent to PayPal) are left out. */
export async function listTransfers() {
  const r = await pool.query(
    `SELECT id, recipient_name, amount_usd_cents, fee_usd_cents, status, created_at, conversation_id
       FROM transfers WHERE status <> 'draft' ORDER BY created_at DESC LIMIT 50`
  );
  return r.rows;
}