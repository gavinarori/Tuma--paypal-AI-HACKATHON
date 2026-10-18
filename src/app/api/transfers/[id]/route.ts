import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { startPayout, syncPayout } from "@/lib/payout";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // Advance payout state on each poll so the demo works even without payout webhooks
  await startPayout(id).catch(() => {});
  const payoutStatus = await syncPayout(id).catch(() => null);
  const t = await pool.query(
    "SELECT id, recipient_name, status, amount_usd_cents, payout_local_amount, payout_currency FROM transfers WHERE id=$1",
    [id]
  );
  if (!t.rowCount) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const ev = await pool.query(
    "SELECT to_status, created_at FROM transfer_events WHERE transfer_id=$1 ORDER BY id", [id]
  );
  return NextResponse.json({ transfer: t.rows[0], events: ev.rows, payoutStatus });
}
