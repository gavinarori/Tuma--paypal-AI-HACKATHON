import { pool } from "./db";
import { createPayout, getPayoutBatch, refundCapture, PayPalError } from "./paypal";
import { transition } from "./transfers";

/** Payment was captured but the payout cannot complete: refund the sender and mark failed. */
async function failAndRefund(t: { id: string; paypal_capture_id: string | null }, reason: string) {
  let refundId: string | null = null;
  try {
    if (t.paypal_capture_id) refundId = (await refundCapture(t.paypal_capture_id, t.id)).id;
  } catch (e) {
    console.error("refund failed", t.id, (e as Error).message); // recorded below as refunded:false
  }
  await transition(t.id, "failed", { reason, refundId, refunded: Boolean(refundId) });
}

/** After payment is captured, send the funds to the recipient's PayPal account. Safe to call repeatedly. */
export async function startPayout(transferId: string) {
  const r = await pool.query("SELECT * FROM transfers WHERE id=$1", [transferId]);
  const t = r.rows[0];
  if (!t || t.status !== "paid" || t.payout_batch_id || !t.recipient_email) return;
  try {
    const batch = await createPayout(t.id, t.recipient_email, t.amount_usd_cents, `Transfer from ${t.sender_name} via Tuma`);
    const batchId = batch.batch_header.payout_batch_id;
    await transition(t.id, "payout_pending", { batchId }, { payout_batch_id: batchId });
  } catch (e) {
    const permanent = e instanceof PayPalError && e.status >= 400 && e.status < 500 && e.status !== 429;
    if (permanent) await failAndRefund(t, "payout_rejected");
    else console.error("payout error (will retry)", transferId, (e as Error).message); // stays "paid"
  }
}

/** Pull the payout result from PayPal and advance the transfer. Returns PayPal's item status. */
export async function syncPayout(transferId: string): Promise<string | null> {
  const r = await pool.query("SELECT status, payout_batch_id, paypal_capture_id FROM transfers WHERE id=$1", [transferId]);
  const t = r.rows[0];
  if (!t || t.status !== "payout_pending" || !t.payout_batch_id) return null;
  const batch = await getPayoutBatch(t.payout_batch_id);
  const s = batch.items?.[0]?.transaction_status ?? null;
  if (s === "SUCCESS") await transition(transferId, "delivered", { payoutStatus: s });
  else if (s && ["FAILED", "RETURNED", "BLOCKED", "REFUNDED", "REVERSED"].includes(s))
    await failAndRefund({ id: transferId, paypal_capture_id: t.paypal_capture_id }, `payout_${s.toLowerCase()}`);
  return s; // UNCLAIMED / PENDING / ONHOLD stay pending
}
