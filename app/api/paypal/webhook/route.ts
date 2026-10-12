import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { verifyWebhook } from "@/lib/paypal";
import { transition } from "@/lib/transfers";
import { startPayout, syncPayout } from "@/lib/payout";

export async function POST(req: Request) {
  const raw = await req.text();
  if (!(await verifyWebhook(req.headers, raw))) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }
  const event = JSON.parse(raw);

  // Idempotency: ignore events we've already processed
  const seen = await pool.query(
    "INSERT INTO webhook_events (id) VALUES ($1) ON CONFLICT DO NOTHING RETURNING id", [event.id]
  );
  if (!seen.rowCount) return NextResponse.json({ ok: true, duplicate: true });

  if (event.event_type === "PAYMENT.CAPTURE.COMPLETED") {
    const transferId = event.resource?.custom_id as string | undefined;
    if (transferId) {
      // Capture route may have already moved it to paid; transition() is a no-op then.
      await transition(transferId, "paid", { via: "webhook" }, { paypal_capture_id: event.resource.id })
        .catch(() => {});
      await startPayout(transferId).catch(() => {});
    }
  }
  if (String(event.event_type).startsWith("PAYMENT.PAYOUTS-ITEM.")) {
    const batchId = event.resource?.payout_batch_id as string | undefined;
    if (batchId) {
      const r = await pool.query("SELECT id FROM transfers WHERE payout_batch_id=$1", [batchId]);
      if (r.rowCount) await syncPayout(r.rows[0].id).catch(() => {});
    }
  }
  return NextResponse.json({ ok: true });
}
