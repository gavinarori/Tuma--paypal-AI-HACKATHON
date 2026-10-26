import { ThinkingLevel } from "@google/genai";
import { pool } from "./db";
import { generate } from "./gemini";

import { languageName } from "./languages";
import { simReceipt, simLang } from "./sim-text";

/** Localised receipt for a finished transfer (delivered or failed). Cached in the DB. */
export async function getReceipt(transferId: string, opts: { record?: boolean } = {}): Promise<string | null> {
  const r = await pool.query("SELECT * FROM transfers WHERE id=$1", [transferId]);
  const t = r.rows[0];
  if (!t || !["delivered", "failed"].includes(t.status)) return null;
  if (t.receipt_text) return t.receipt_text as string;

  const amount = t.amount_usd_cents / 100;
  const total = (t.amount_usd_cents + t.fee_usd_cents) / 100;
  let facts: Record<string, unknown>;
  let fallback: string;
  if (t.status === "delivered") {
    facts = { outcome: "delivered", recipient: t.recipient_name, amount_usd: amount, fee_usd: t.fee_usd_cents / 100, total_paid_usd: total, indicative_kes: Number(t.payout_local_amount) };
    fallback = `Delivered: ${t.recipient_name} received $${amount.toFixed(2)} in their PayPal account. You paid $${total.toFixed(2)} including fees.`;
  } else {
    const ev = await pool.query(
      "SELECT detail FROM transfer_events WHERE transfer_id=$1 AND to_status='failed' ORDER BY id DESC LIMIT 1", [transferId]
    );
    const refunded = Boolean(ev.rows[0]?.detail?.refunded);
    facts = { outcome: "failed", recipient: t.recipient_name, total_paid_usd: total, refunded };
    fallback = refunded
      ? `The transfer to ${t.recipient_name} could not be completed. Your $${total.toFixed(2)} was refunded to PayPal.`
      : `The transfer to ${t.recipient_name} could not be completed and we could not confirm a refund automatically. Please contact support.`;
  }

  let text = fallback;
  if (process.env.SIMULATE_AI === "true") {
    text = simReceipt(simLang(t.language), facts); // simulated AI: no Gemini call
  } else try {
    const { res } = await generate({
      contents: [{ role: "user", parts: [{ text: JSON.stringify(facts) }] }],
      config: {
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        systemInstruction: `You write short, warm payment receipts (max 3 sentences, plain text, no markdown) in ${languageName(t.language)}. Use ONLY the facts given. Never invent or recompute numbers. If the outcome is failed, apologise briefly and say whether the money was refunded.`,
      },
    });
    const out = (res.text ?? "").trim();
    if (out) text = out;
  } catch (e) {
    console.error("receipt generation failed", (e as Error).message);
  }
  await pool.query("UPDATE transfers SET receipt_text=$2 WHERE id=$1", [transferId, text]);
  // Put the transaction record into the chat history (once: later calls return the cached receipt above)
  if (opts.record && t.conversation_id) {
    try {
      await pool.query("INSERT INTO messages (conversation_id, role, content) VALUES ($1, 'assistant', $2)", [t.conversation_id, `${text}\n\nReference: ${String(transferId).slice(0, 8).toUpperCase()}`]);
      await pool.query("UPDATE conversations SET updated_at = now() WHERE id = $1", [t.conversation_id]);
    } catch (e) {
      console.error("recording the receipt in the chat failed:", (e as Error).message);
    }
  }
  return text;
}