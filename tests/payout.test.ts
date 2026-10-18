import { describe, it, expect, vi, beforeEach } from "vitest";

const h = vi.hoisted(() => ({
  query: vi.fn(), createPayout: vi.fn(), getPayoutBatch: vi.fn(), refundCapture: vi.fn(), transition: vi.fn(),
}));
vi.mock("@/lib/db", () => ({ pool: { query: h.query } }));
vi.mock("@/lib/transfers", () => ({ transition: h.transition }));
vi.mock("@/lib/paypal", async (orig) => ({
  ...(await orig<typeof import("@/lib/paypal")>()),
  createPayout: h.createPayout, getPayoutBatch: h.getPayoutBatch, refundCapture: h.refundCapture,
}));
import { PayPalError } from "@/lib/paypal";
import { startPayout, syncPayout } from "@/lib/payout";

const transfer = (o: Record<string, unknown> = {}) => ({
  id: "T1", status: "paid", payout_batch_id: null, recipient_email: "mama@example.com",
  amount_usd_cents: 5000, sender_name: "Demo Sender", paypal_capture_id: "CAP1", ...o,
});
const load = (row: unknown) => h.query.mockResolvedValue({ rows: row ? [row] : [] });

beforeEach(() => {
  Object.values(h).forEach((m) => m.mockReset());
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("startPayout", () => {
  it("sends the payout and moves the transfer to payout_pending with the batch id", async () => {
    load(transfer());
    h.createPayout.mockResolvedValue({ batch_header: { payout_batch_id: "B1" } });
    await startPayout("T1");
    expect(h.createPayout).toHaveBeenCalledWith("T1", "mama@example.com", 5000, "Transfer from Demo Sender via Tuma");
    expect(h.transition).toHaveBeenCalledWith("T1", "payout_pending", { batchId: "B1" }, { payout_batch_id: "B1" });
  });

  it.each([
    ["transfer is missing", null],
    ["transfer is not paid", transfer({ status: "awaiting_payment" })],
    ["a payout was already started", transfer({ payout_batch_id: "B0" })],
    ["there is no recipient email", transfer({ recipient_email: null })],
  ])("does nothing when %s", async (_, row) => {
    load(row);
    await startPayout("T1");
    expect(h.createPayout).not.toHaveBeenCalled();
    expect(h.transition).not.toHaveBeenCalled();
  });

  it("refunds the sender and marks failed when PayPal permanently rejects the payout", async () => {
    load(transfer());
    h.createPayout.mockRejectedValue(new PayPalError(422, "bad receiver"));
    h.refundCapture.mockResolvedValue({ id: "R1" });
    await startPayout("T1");
    expect(h.refundCapture).toHaveBeenCalledWith("CAP1", "T1");
    expect(h.transition).toHaveBeenCalledWith("T1", "failed", { reason: "payout_rejected", refundId: "R1", refunded: true });
  });

  it("records refunded:false when the refund itself fails", async () => {
    load(transfer());
    h.createPayout.mockRejectedValue(new PayPalError(400, "nope"));
    h.refundCapture.mockRejectedValue(new Error("refund down"));
    await startPayout("T1");
    expect(h.transition).toHaveBeenCalledWith("T1", "failed", { reason: "payout_rejected", refundId: null, refunded: false });
  });

  it("does not try to refund when there is no capture id", async () => {
    load(transfer({ paypal_capture_id: null }));
    h.createPayout.mockRejectedValue(new PayPalError(400, "nope"));
    await startPayout("T1");
    expect(h.refundCapture).not.toHaveBeenCalled();
    expect(h.transition).toHaveBeenCalledWith("T1", "failed", expect.objectContaining({ refunded: false }));
  });

  it.each([
    ["rate limited (429)", new PayPalError(429, "slow down")],
    ["PayPal server error (500)", new PayPalError(500, "oops")],
    ["network error", new Error("fetch failed")],
  ])("leaves the transfer in 'paid' for a retry on %s", async (_, err) => {
    load(transfer());
    h.createPayout.mockRejectedValue(err);
    await startPayout("T1");
    expect(h.refundCapture).not.toHaveBeenCalled();
    expect(h.transition).not.toHaveBeenCalled();
  });
});

describe("syncPayout", () => {
  const pending = (o: Record<string, unknown> = {}) => ({ status: "payout_pending", payout_batch_id: "B1", paypal_capture_id: "CAP1", ...o });
  const itemStatus = (s?: string) => h.getPayoutBatch.mockResolvedValue({ batch_header: { batch_status: "X" }, items: s ? [{ transaction_status: s }] : [] });

  it("marks the transfer delivered on SUCCESS", async () => {
    load(pending()); itemStatus("SUCCESS");
    expect(await syncPayout("T1")).toBe("SUCCESS");
    expect(h.transition).toHaveBeenCalledWith("T1", "delivered", { payoutStatus: "SUCCESS" });
  });

  it.each(["FAILED", "RETURNED", "BLOCKED", "REFUNDED", "REVERSED"])("refunds and fails on %s", async (s) => {
    load(pending()); itemStatus(s); h.refundCapture.mockResolvedValue({ id: "R1" });
    await syncPayout("T1");
    expect(h.refundCapture).toHaveBeenCalledWith("CAP1", "T1");
    expect(h.transition).toHaveBeenCalledWith("T1", "failed", { reason: `payout_${s.toLowerCase()}`, refundId: "R1", refunded: true });
  });

  it.each(["UNCLAIMED", "PENDING", "ONHOLD"])("keeps waiting on %s", async (s) => {
    load(pending()); itemStatus(s);
    expect(await syncPayout("T1")).toBe(s);
    expect(h.transition).not.toHaveBeenCalled();
    expect(h.refundCapture).not.toHaveBeenCalled();
  });

  it("returns null when PayPal has no item yet", async () => {
    load(pending()); itemStatus();
    expect(await syncPayout("T1")).toBeNull();
    expect(h.transition).not.toHaveBeenCalled();
  });

  it.each([
    ["not in payout_pending", pending({ status: "paid" })],
    ["has no batch id", pending({ payout_batch_id: null })],
    ["is missing", null],
  ])("does not call PayPal when the transfer %s", async (_, row) => {
    load(row);
    expect(await syncPayout("T1")).toBeNull();
    expect(h.getPayoutBatch).not.toHaveBeenCalled();
  });
});
