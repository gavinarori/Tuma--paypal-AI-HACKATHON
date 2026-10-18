import { describe, it, expect, vi, beforeEach } from "vitest";

const h = vi.hoisted(() => ({ connect: vi.fn() }));
vi.mock("@/lib/db", () => ({ pool: { connect: h.connect } }));
import { transition, type Status } from "@/lib/transfers";

function setup(status: string | null) {
  const calls: { sql: string; vals?: unknown[] }[] = [];
  const client = {
    release: vi.fn(),
    query: vi.fn(async (sql: string, vals?: unknown[]) => {
      calls.push({ sql, vals });
      if (sql.startsWith("SELECT status")) return status ? { rowCount: 1, rows: [{ status }] } : { rowCount: 0, rows: [] };
      return { rowCount: 1, rows: [] };
    }),
  };
  h.connect.mockResolvedValue(client);
  return { client, calls, sqls: () => calls.map((c) => c.sql.split(" ")[0]) };
}

beforeEach(() => { h.connect.mockReset(); });

const LEGAL: [Status, Status][] = [
  ["draft", "awaiting_payment"], ["draft", "failed"],
  ["awaiting_payment", "paid"], ["awaiting_payment", "failed"],
  ["paid", "payout_pending"], ["paid", "failed"],
  ["payout_pending", "delivered"], ["payout_pending", "failed"],
];
const ALL: Status[] = ["draft", "awaiting_payment", "paid", "payout_pending", "delivered", "failed"];
const ILLEGAL = ALL.flatMap((a) => ALL.map((b) => [a, b] as [Status, Status]))
  .filter(([a, b]) => a !== b && !LEGAL.some(([x, y]) => x === a && y === b));

describe("transfer state machine", () => {
  it.each(LEGAL)("allows %s -> %s, writes the audit event and commits", async (from, to) => {
    const { sqls, client } = setup(from);
    await transition("T1", to, { why: "test" });
    expect(sqls()).toEqual(["BEGIN", "SELECT", "UPDATE", "INSERT", "COMMIT"]);
    expect(client.release).toHaveBeenCalledOnce();
  });

  it.each(ILLEGAL)("rejects %s -> %s and rolls back", async (from, to) => {
    const { sqls, client } = setup(from);
    await expect(transition("T1", to)).rejects.toThrow(`Illegal transition ${from} -> ${to}`);
    expect(sqls()).toEqual(["BEGIN", "SELECT", "ROLLBACK"]);
    expect(client.release).toHaveBeenCalledOnce();
  });

  it("is a no-op (no update, no event) when already in the target status", async () => {
    const { sqls } = setup("paid");
    await transition("T1", "paid");
    expect(sqls()).toEqual(["BEGIN", "SELECT", "COMMIT"]);
  });

  it("throws and rolls back when the transfer does not exist", async () => {
    const { sqls } = setup(null);
    await expect(transition("nope", "paid")).rejects.toThrow("Transfer not found");
    expect(sqls()).toEqual(["BEGIN", "SELECT", "ROLLBACK"]);
  });

  it("locks the row while reading its status", async () => {
    const { calls } = setup("draft");
    await transition("T1", "awaiting_payment");
    expect(calls[1].sql).toContain("FOR UPDATE");
  });

  it("stores whitelisted extra columns and the event detail", async () => {
    const { calls } = setup("paid");
    await transition("T1", "payout_pending", { batchId: "B1" }, { payout_batch_id: "B1" });
    const update = calls.find((c) => c.sql.startsWith("UPDATE"))!;
    expect(update.sql).toContain("payout_batch_id=$3");
    expect(update.vals).toEqual(["T1", "payout_pending", "B1"]);
    const insert = calls.find((c) => c.sql.startsWith("INSERT"))!;
    expect(insert.vals).toEqual(["T1", "paid", "payout_pending", JSON.stringify({ batchId: "B1" })]);
  });

  it("refuses to write columns outside the whitelist (SQL injection guard)", async () => {
    const { sqls } = setup("paid");
    await expect(transition("T1", "payout_pending", {}, { "status='delivered', x": "1" })).rejects.toThrow("bad column");
    expect(sqls()).toContain("ROLLBACK");
    expect(sqls()).not.toContain("UPDATE");
  });

  it("rolls back and releases the connection when a query fails", async () => {
    const { client } = setup("draft");
    client.query.mockImplementation(async (sql: string) => {
      if (sql.startsWith("SELECT")) return { rowCount: 1, rows: [{ status: "draft" }] };
      if (sql.startsWith("UPDATE")) throw new Error("db down");
      return { rowCount: 1, rows: [] };
    });
    await expect(transition("T1", "awaiting_payment")).rejects.toThrow("db down");
    expect(client.query).toHaveBeenCalledWith("ROLLBACK");
    expect(client.release).toHaveBeenCalledOnce();
  });
});
