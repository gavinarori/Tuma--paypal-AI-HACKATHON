import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { captureOrder } from "@/lib/paypal";
import { transition } from "@/lib/transfers";
import { startPayout } from "@/lib/payout";

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const t = await pool.query("SELECT paypal_order_id FROM transfers WHERE id=$1", [id]);
    if (!t.rowCount) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const cap = await captureOrder(t.rows[0].paypal_order_id);
    const capture = cap.purchase_units[0].payments.captures[0];
    if (capture.status === "COMPLETED") {
      try {
        await transition(id, "paid", { captureId: capture.id }, { paypal_capture_id: capture.id });
      } catch (e) {
        // PayPal's webhook can arrive before this call finishes and move the transfer on already. That is fine, the money is captured.
        const cur = (await pool.query("SELECT status FROM transfers WHERE id=$1", [id])).rows[0]?.status;
        if (!["paid", "payout_pending", "delivered"].includes(cur)) throw e;
      }
      await startPayout(id);
    }
    return NextResponse.json({ status: capture.status });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}