import { randomBytes } from "node:crypto";
import { pool } from "./db";
import { PayPalError } from "./paypal-error";

/**
 * A stand-in for PayPal that behaves like the real thing (orders, approval, capture, payouts, refunds and webhooks)
 * so the whole app can be tried without any PayPal account. State lives in the sim_paypal table.
 *
 * The RECIPIENT'S EMAIL decides what happens to the payout, like a PayPal sandbox account would:
 *   anything@...            -> arrives (SUCCESS) after a few seconds
 *   contains "unclaimed"    -> UNCLAIMED (the recipient has no PayPal account yet)
 *   contains "fail"/"blocked" -> accepted, then FAILED later  -> the sender is refunded
 *   contains "reject"       -> refused immediately            -> the sender is refunded
 *   contains "slow"         -> stays pending for ~20 seconds, then arrives
 * SIM_SPEED=fast makes everything instant (used by tests). The /simulator page can also fast-forward.
 */
export const isSimulated = () => process.env.NEXT_PUBLIC_PAYPAL_MODE === "simulate";
const instant = () => process.env.SIM_SPEED === "fast";

const WEBHOOK_DELAY_MS = 1500;
const PAYOUT_MS = { default: 5000, unclaimed: 2500, fail: 5000, slow: 20000 };

const rid = (prefix: string) => `${prefix}-${randomBytes(5).toString("hex").toUpperCase()}`;
const usd = (cents: number) => (cents / 100).toFixed(2);

type Row<T> = T & { id: string; created_at: string };

async function put(kind: string, id: string, data: object) {
  await pool.query(
    "INSERT INTO sim_paypal (kind, id, data) VALUES ($1, $2, $3) ON CONFLICT (kind, id) DO UPDATE SET data = EXCLUDED.data",
    [kind, id, JSON.stringify(data)]
  );
}
async function get<T>(kind: string, id: string): Promise<Row<T> | null> {
  const r = await pool.query("SELECT id, data, created_at FROM sim_paypal WHERE kind = $1 AND id = $2", [kind, id]);
  return r.rows[0] ? ({ ...r.rows[0].data, id: r.rows[0].id, created_at: r.rows[0].created_at } as Row<T>) : null;
}
async function findByTransfer<T>(kind: string, transferId: string): Promise<Row<T> | null> {
  const r = await pool.query("SELECT id, data, created_at FROM sim_paypal WHERE kind = $1 AND data->>'transferId' = $2 LIMIT 1", [kind, transferId]);
  return r.rows[0] ? ({ ...r.rows[0].data, id: r.rows[0].id, created_at: r.rows[0].created_at } as Row<T>) : null;
}

// ---------- webhooks: delivered into the app's real webhook route, like PayPal would ----------
type SimEvent = { id: string; event_type: string; resource: Record<string, unknown> };

async function deliver(event: SimEvent) {
  await put("webhook", event.id, { event_type: event.event_type, result: "sending" });
  const { POST } = await import("@/app/api/paypal/webhook/route");
  const res = await POST(new Request("http://localhost/api/paypal/webhook", {
    method: "POST",
    headers: { "content-type": "application/json", "paypal-transmission-id": `SIM-${event.id}` },
    body: JSON.stringify(event),
  }));
  await put("webhook", event.id, { event_type: event.event_type, result: res.status });
}
async function sendWebhook(event_type: string, resource: Record<string, unknown>) {
  const event: SimEvent = { id: rid("WH"), event_type, resource };
  if (instant()) return deliver(event);
  setTimeout(() => { deliver(event).catch((e) => console.error("simulated webhook failed:", (e as Error).message)); }, WEBHOOK_DELAY_MS);
}

// ---------- checkout ----------
type Order = { transferId: string; amountCents: number; description: string; status: string; captureId?: string };

export async function createOrder(transferId: string, totalUsdCents: number, description: string) {
  const existing = await findByTransfer<Order>("order", transferId); // idempotent, like PayPal-Request-Id
  if (existing) return { id: existing.id };
  const id = rid("SIMORDER");
  await put("order", id, { transferId, amountCents: totalUsdCents, description: description.slice(0, 120), status: "CREATED" } satisfies Order);
  return { id };
}

export const getOrder = (id: string) => get<Order>("order", id);

/** What the buyer does in the (simulated) PayPal window. */
export async function approveOrder(id: string, outcome: "approve" | "decline" | "insufficient") {
  const o = await get<Order>("order", id);
  if (!o) throw new PayPalError(404, "ORDER_NOT_FOUND");
  if (o.status === "COMPLETED") return o;
  const status = outcome === "approve" ? "APPROVED" : outcome === "insufficient" ? "INSUFFICIENT_FUNDS" : "DECLINED";
  const { id: _i, created_at: _c, ...data } = o;
  await put("order", id, { ...data, status });
  return { ...o, status };
}

export async function captureOrder(orderId: string) {
  const o = await get<Order>("order", orderId);
  if (!o) throw new PayPalError(404, "PayPal /v2/checkout/orders: ORDER_NOT_FOUND");
  const done = (captureId: string) => ({ status: "COMPLETED", purchase_units: [{ payments: { captures: [{ id: captureId, status: "COMPLETED" }] } }] });
  if (o.status === "COMPLETED" && o.captureId) return done(o.captureId); // idempotent
  if (o.status === "DECLINED") throw new PayPalError(422, "PayPal capture 422: INSTRUMENT_DECLINED");
  if (o.status === "INSUFFICIENT_FUNDS") throw new PayPalError(422, "PayPal capture 422: INSUFFICIENT_FUNDS");
  if (o.status !== "APPROVED") throw new PayPalError(422, "PayPal capture 422: ORDER_NOT_APPROVED (the buyer has not approved the payment)");
  const captureId = rid("SIMCAP");
  const { id: _i, created_at: _c, ...data } = o;
  await put("order", orderId, { ...data, status: "COMPLETED", captureId });
  await sendWebhook("PAYMENT.CAPTURE.COMPLETED", { id: captureId, custom_id: o.transferId, status: "COMPLETED", amount: { currency_code: "USD", value: usd(o.amountCents) } });
  return done(captureId);
}

export function verifyWebhook(headers: Headers) {
  return (headers.get("paypal-transmission-id") ?? "").startsWith("SIM-");
}

// ---------- payouts ----------
type Payout = { transferId: string; email: string; amountCents: number; webhookSent?: boolean; due?: boolean };
type PayoutStatus = "PENDING" | "SUCCESS" | "UNCLAIMED" | "FAILED";

const outcomeFor = (email: string): "default" | "unclaimed" | "fail" | "slow" =>
  /unclaimed/i.test(email) ? "unclaimed" : /fail|blocked/i.test(email) ? "fail" : /slow/i.test(email) ? "slow" : "default";

export function payoutStatus(p: Pick<Payout, "email" | "due"> & { created_at: string }): PayoutStatus {
  const kind = outcomeFor(p.email);
  const elapsed = instant() || p.due ? Infinity : Date.now() - new Date(p.created_at).getTime();
  if (elapsed < PAYOUT_MS[kind]) return "PENDING";
  return kind === "unclaimed" ? "UNCLAIMED" : kind === "fail" ? "FAILED" : "SUCCESS";
}

export async function createPayout(transferId: string, email: string, amountCents: number) {
  if (/reject/i.test(email)) throw new PayPalError(422, "PayPal /v1/payments/payouts 422: RECEIVER_UNREGISTERED (the simulator rejects this email)");
  const existing = await findByTransfer<Payout>("payout", transferId);
  if (existing) return { batch_header: { payout_batch_id: existing.id, batch_status: "PENDING" } };
  const id = rid("SIMBATCH");
  await put("payout", id, { transferId, email, amountCents, webhookSent: false } satisfies Payout);
  return { batch_header: { payout_batch_id: id, batch_status: "PENDING" } };
}

const PAYOUT_EVENT: Record<string, string> = { SUCCESS: "PAYMENT.PAYOUTS-ITEM.SUCCEEDED", FAILED: "PAYMENT.PAYOUTS-ITEM.FAILED", UNCLAIMED: "PAYMENT.PAYOUTS-ITEM.UNCLAIMED" };

export async function getPayoutBatch(batchId: string) {
  const p = await get<Payout>("payout", batchId);
  if (!p) throw new PayPalError(404, "PayPal payouts 404: BATCH_NOT_FOUND");
  const status = payoutStatus(p);
  if (status !== "PENDING" && !p.webhookSent) {
    const { id: _i, created_at: _c, ...data } = p;
    await put("payout", batchId, { ...data, webhookSent: true });
    await sendWebhook(PAYOUT_EVENT[status], { payout_batch_id: batchId, payout_item_id: `${batchId}-1`, transaction_status: status });
  }
  return { batch_header: { batch_status: status === "PENDING" ? "PENDING" : "SUCCESS" }, items: [{ transaction_status: status }] };
}

// ---------- refunds ----------
export async function refundCapture(captureId: string, transferId: string) {
  const existing = await findByTransfer<{ transferId: string }>("refund", transferId);
  if (existing) return { id: existing.id, status: "COMPLETED" };
  const id = rid("SIMREFUND");
  await put("refund", id, { captureId, transferId, status: "COMPLETED" });
  return { id, status: "COMPLETED" };
}