import { pool } from "./db";
import { payoutStatus } from "./paypal-sim";

/** Everything the /simulator page shows: recent orders, payouts (with their live status), refunds and webhook deliveries. */
export async function simState() {
  const rows = async (kind: string) =>
    (await pool.query("SELECT id, data, created_at FROM sim_paypal WHERE kind = $1 ORDER BY created_at DESC LIMIT 12", [kind])).rows;
  const [orders, payouts, refunds, webhooks] = await Promise.all([rows("order"), rows("payout"), rows("refund"), rows("webhook")]);
  return {
    orders: orders.map((r) => ({ id: r.id, status: r.data.status, amountCents: r.data.amountCents, transferId: r.data.transferId, at: r.created_at })),
    payouts: payouts.map((r) => ({ id: r.id, email: r.data.email, status: payoutStatus({ email: r.data.email, due: r.data.due, created_at: r.created_at }), amountCents: r.data.amountCents, transferId: r.data.transferId, at: r.created_at })),
    refunds: refunds.map((r) => ({ id: r.id, transferId: r.data.transferId, at: r.created_at })),
    webhooks: webhooks.map((r) => ({ id: r.id, type: r.data.event_type, result: r.data.result, at: r.created_at })),
  };
}

/** Makes every pending simulated payout finish now. */
export async function fastForward() {
  const r = await pool.query("UPDATE sim_paypal SET data = data || '{\"due\": true}'::jsonb WHERE kind = 'payout'");
  return r.rowCount ?? 0;
}

/** Wipes the app's data (chats, transfers, recipients) and the simulator's state. Only reachable in simulate mode. */
export async function resetAll() {
  for (const t of ["transfer_events", "webhook_events", "transfers", "messages", "conversations", "recipients", "sim_paypal"]) {
    await pool.query(`DELETE FROM ${t}`);
  }
}

const SEED = {
  recipients: [
    { name: "mama", email: "mama@sim.test" },            // always arrives
    { name: "baba", email: "baba.unclaimed@sim.test" },  // no PayPal account yet
    { name: "shosho", email: "shosho.fail@sim.test" },   // payout fails -> refund
    { name: "wanjiru", email: "wanjiru.reject@sim.test" }, // refused at once -> refund
    { name: "juma", email: "juma.slow@sim.test" },       // stays pending ~20 s, then arrives
  ],
  c1: "00000000-0000-4000-8000-0000000000c1", c2: "00000000-0000-4000-8000-0000000000c2",
  t1: "00000000-0000-4000-8000-0000000000a1", t2: "00000000-0000-4000-8000-0000000000a2",
};

/** Demo recipients plus a little history, so the app looks lived-in. Safe to run again. */
export async function seedDemo() {
  for (const r of SEED.recipients) {
    await pool.query(
      `INSERT INTO recipients (owner, name, paypal_email, country) VALUES ('demo', $1, $2, 'KE')
       ON CONFLICT (owner, lower(name)) DO UPDATE SET paypal_email = EXCLUDED.paypal_email`, [r.name, r.email]);
  }
  const ago = (min: number) => new Date(Date.now() - min * 60_000).toISOString();
  const convo = (id: string, title: string, at: string) =>
    pool.query("INSERT INTO conversations (id, owner, title, created_at, updated_at) VALUES ($1, 'demo', $2, $3, $3) ON CONFLICT (id) DO NOTHING", [id, title, at]);
  const msg = (cid: string, role: string, content: string) =>
    pool.query("INSERT INTO messages (conversation_id, role, content) SELECT $1, $2, $3 WHERE NOT EXISTS (SELECT 1 FROM messages WHERE conversation_id = $1 AND content = $3)", [cid, role, content]);

  await convo(SEED.c1, "Send $50 to mama for rent", ago(180));
  await convo(SEED.c2, "Tuma $30 kwa shosho", ago(60));

  const transfer = (id: string, cid: string, name: string, email: string, cents: number, lang: string, status: string, receipt: string, at: string) =>
    pool.query(
      `INSERT INTO transfers (id, sender_name, recipient_name, recipient_email, recipient_country, amount_usd_cents, fee_usd_cents, fx_rate, payout_local_amount, payout_currency,
         purpose, language, status, paypal_order_id, paypal_capture_id, receipt_text, conversation_id, created_at, updated_at)
       VALUES ($1,'Demo Sender',$2,$3,'KE',$4,$5,129,$6,'KES',NULL,$7,$8,$9,$10,$11,$12,$13,$13) ON CONFLICT (id) DO NOTHING`,
      [id, name, email, cents, Math.round(cents * 0.015) + 30, (cents / 100) * 129, lang, status, `SEEDORDER-${id.slice(-2)}`, `SEEDCAP-${id.slice(-2)}`, receipt, cid, at]);
  const events = (id: string, steps: string[], at: string) =>
    pool.query(
      `INSERT INTO transfer_events (transfer_id, from_status, to_status, detail, created_at)
       SELECT $1, NULL, s, '{}'::jsonb, $3::timestamptz FROM unnest($2::text[]) AS s WHERE NOT EXISTS (SELECT 1 FROM transfer_events WHERE transfer_id = $1)`, [id, steps, at]);

  const r1 = "Done! Mama received $50.00 in her PayPal account. You paid $51.05 including fees.";
  const r2 = "Samahani, uhamisho kwa shosho haukukamilika. Pesa zako $30.55 zimerudishwa kwenye PayPal.";
  await transfer(SEED.t1, SEED.c1, "mama", "mama@sim.test", 5000, "en", "delivered", r1, ago(179));
  await events(SEED.t1, ["awaiting_payment", "paid", "payout_pending", "delivered"], ago(179));
  await transfer(SEED.t2, SEED.c2, "shosho", "shosho.fail@sim.test", 3000, "sw", "failed", r2, ago(59));
  await events(SEED.t2, ["awaiting_payment", "paid", "payout_pending", "failed"], ago(59));
  await msg(SEED.c1, "user", "Send $50 to mama for rent");
  await msg(SEED.c1, "assistant", "I've prepared your $50 transfer for mama. Please review the details.");
  await msg(SEED.c1, "assistant", `${r1}\n\nReference: ${SEED.t1.slice(0, 8).toUpperCase()}`);
  await msg(SEED.c2, "user", "Tuma $30 kwa shosho");
  await msg(SEED.c2, "assistant", "Nimeandaa uhamisho wa $30 kwa shosho. Tafadhali kagua maelezo.");
  await msg(SEED.c2, "assistant", `${r2}\n\nReference: ${SEED.t2.slice(0, 8).toUpperCase()}`);
  return { recipients: SEED.recipients.length, transfers: 2, conversations: 2 };
}