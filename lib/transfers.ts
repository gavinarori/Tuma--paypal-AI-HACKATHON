import { pool } from "./db";

export type Status =
  | "draft" | "awaiting_payment" | "paid"
  | "payout_pending" | "delivered" | "failed";

const ALLOWED: Record<Status, Status[]> = {
  draft: ["awaiting_payment", "failed"],
  awaiting_payment: ["paid", "failed"],
  paid: ["payout_pending", "failed"],
  payout_pending: ["delivered", "failed"],
  delivered: [],
  failed: [],
};

/** Move a transfer to a new status; no-op if already there, throws on illegal jumps. */
export async function transition(
  transferId: string, to: Status, detail: unknown = {}, extra: Record<string, string> = {}
) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const cur = await client.query("SELECT status FROM transfers WHERE id=$1 FOR UPDATE", [transferId]);
    if (!cur.rowCount) throw new Error("Transfer not found");
    const from = cur.rows[0].status as Status;
    if (from === to) { await client.query("COMMIT"); return; }
    if (!ALLOWED[from].includes(to)) throw new Error(`Illegal transition ${from} -> ${to}`);
    const sets = ["status=$2", "updated_at=now()"];
    const vals: unknown[] = [transferId, to];
    for (const [col, v] of Object.entries(extra)) {
      if (!["paypal_order_id", "paypal_capture_id", "payout_batch_id"].includes(col)) throw new Error("bad column");
      vals.push(v); sets.push(`${col}=$${vals.length}`);
    }
    await client.query(`UPDATE transfers SET ${sets.join(", ")} WHERE id=$1`, vals);
    await client.query(
      "INSERT INTO transfer_events (transfer_id, from_status, to_status, detail) VALUES ($1,$2,$3,$4)",
      [transferId, from, to, JSON.stringify(detail)]
    );
    await client.query("COMMIT");
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}
