import { describe, it, expect, vi, beforeEach } from "vitest";

const h = vi.hoisted(() => ({
  query: vi.fn(), verifyWebhook: vi.fn(), transition: vi.fn(), startPayout: vi.fn(), syncPayout: vi.fn(),
}));
vi.mock("@/lib/db", () => ({ pool: { query: h.query } }));
vi.mock("@/lib/paypal", () => ({ verifyWebhook: h.verifyWebhook }));
vi.mock("@/lib/transfers", () => ({ transition: h.transition }));
vi.mock("@/lib/payout", () => ({ startPayout: h.startPayout, syncPayout: h.syncPayout }));
import { POST } from "@/app/api/paypal/webhook/route";

const send = (event: unknown) =>
  POST(new Request("http://localhost/api/paypal/webhook", { method: "POST", headers: { "paypal-transmission-id": "tid" }, body: JSON.stringify(event) }));

beforeEach(() => {
  Object.values(h).forEach((m) => m.mockReset());
  h.verifyWebhook.mockResolvedValue(true);
  h.query.mockResolvedValue({ rowCount: 1, rows: [] }); // event not seen before
  h.transition.mockResolvedValue(undefined);
  h.startPayout.mockResolvedValue(undefined);
  h.syncPayout.mockResolvedValue("SUCCESS");
});

const capture = { id: "EVT1", event_type: "PAYMENT.CAPTURE.COMPLETED", resource: { id: "CAP9", custom_id: "T1" } };

describe("PayPal webhook", () => {
  it("rejects events with an invalid signature before touching the database", async () => {
    h.verifyWebhook.mockResolvedValue(false);
    const res = await send(capture);
    expect(res.status).toBe(401);
    expect(h.query).not.toHaveBeenCalled();
    expect(h.transition).not.toHaveBeenCalled();
  });

  it("verifies the raw body and request headers", async () => {
    await send(capture);
    const [headers, raw] = h.verifyWebhook.mock.calls[0];
    expect((headers as Headers).get("paypal-transmission-id")).toBe("tid");
    expect(JSON.parse(raw)).toEqual(capture);
  });

  it("ignores duplicate deliveries (idempotency)", async () => {
    h.query.mockResolvedValue({ rowCount: 0, rows: [] });
    const res = await send(capture);
    expect(await res.json()).toEqual({ ok: true, duplicate: true });
    expect(h.transition).not.toHaveBeenCalled();
    expect(h.startPayout).not.toHaveBeenCalled();
  });

  it("marks the transfer paid and starts the payout on PAYMENT.CAPTURE.COMPLETED", async () => {
    const res = await send(capture);
    expect(res.status).toBe(200);
    expect(h.transition).toHaveBeenCalledWith("T1", "paid", { via: "webhook" }, { paypal_capture_id: "CAP9" });
    expect(h.startPayout).toHaveBeenCalledWith("T1");
  });

  it("still starts the payout if the transfer was already marked paid (transition throws)", async () => {
    h.transition.mockRejectedValue(new Error("Illegal transition"));
    const res = await send(capture);
    expect(res.status).toBe(200);
    expect(h.startPayout).toHaveBeenCalledWith("T1");
  });

  it("ignores capture events that carry no transfer id", async () => {
    await send({ id: "EVT2", event_type: "PAYMENT.CAPTURE.COMPLETED", resource: { id: "CAP9" } });
    expect(h.transition).not.toHaveBeenCalled();
    expect(h.startPayout).not.toHaveBeenCalled();
  });

  it("syncs the matching transfer when a payout item event arrives", async () => {
    h.query.mockResolvedValueOnce({ rowCount: 1, rows: [] }).mockResolvedValueOnce({ rowCount: 1, rows: [{ id: "T7" }] });
    await send({ id: "EVT3", event_type: "PAYMENT.PAYOUTS-ITEM.SUCCEEDED", resource: { payout_batch_id: "B1" } });
    expect(h.query).toHaveBeenLastCalledWith(expect.stringContaining("payout_batch_id=$1"), ["B1"]);
    expect(h.syncPayout).toHaveBeenCalledWith("T7");
  });

  it("does nothing for payout events with no matching transfer", async () => {
    h.query.mockResolvedValueOnce({ rowCount: 1, rows: [] }).mockResolvedValueOnce({ rowCount: 0, rows: [] });
    const res = await send({ id: "EVT4", event_type: "PAYMENT.PAYOUTS-ITEM.FAILED", resource: { payout_batch_id: "B404" } });
    expect(res.status).toBe(200);
    expect(h.syncPayout).not.toHaveBeenCalled();
  });

  it("acknowledges (200) even if syncing the payout fails, so PayPal does not retry forever", async () => {
    h.query.mockResolvedValueOnce({ rowCount: 1, rows: [] }).mockResolvedValueOnce({ rowCount: 1, rows: [{ id: "T7" }] });
    h.syncPayout.mockRejectedValue(new Error("paypal down"));
    const res = await send({ id: "EVT5", event_type: "PAYMENT.PAYOUTS-ITEM.SUCCEEDED", resource: { payout_batch_id: "B1" } });
    expect(res.status).toBe(200);
  });

  it("acknowledges unrelated event types without side effects", async () => {
    const res = await send({ id: "EVT6", event_type: "CUSTOMER.DISPUTE.CREATED", resource: {} });
    expect(res.status).toBe(200);
    expect(h.transition).not.toHaveBeenCalled();
    expect(h.startPayout).not.toHaveBeenCalled();
    expect(h.syncPayout).not.toHaveBeenCalled();
  });
});
