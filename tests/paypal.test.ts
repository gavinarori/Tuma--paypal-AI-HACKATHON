import { describe, it, expect, vi, beforeEach } from "vitest";
import { createOrder, captureOrder, createPayout, getPayoutBatch, refundCapture, verifyWebhook, PayPalError } from "@/lib/paypal";

const fetchMock = vi.fn();
const isToken = (u: unknown) => String(u).endsWith("/v1/oauth2/token");

function respond(body: unknown, status = 200) {
  fetchMock.mockImplementation(async (url: string) =>
    isToken(url)
      ? { ok: true, status: 200, json: async () => ({ access_token: "tok" }) }
      : { ok: status < 400, status, json: async () => body }
  );
}
const apiCall = () => {
  const [url, init] = fetchMock.mock.calls.find(([u]) => !isToken(u))!;
  return { url: String(url), init: init as RequestInit & { headers: Record<string, string> }, body: init.body ? JSON.parse(init.body) : null };
};

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
  process.env.PAYPAL_CLIENT_ID = "id";
  process.env.PAYPAL_CLIENT_SECRET = "secret";
  process.env.PAYPAL_WEBHOOK_ID = "WH-1";
});

describe("PayPal client", () => {
  it("authenticates with basic auth and sends the bearer token on API calls", async () => {
    respond({ id: "ORD1" });
    await createOrder("T1", 5105, "x");
    const [, tokenInit] = fetchMock.mock.calls[0];
    expect(tokenInit.headers.Authorization).toBe(`Basic ${Buffer.from("id:secret").toString("base64")}`);
    expect(tokenInit.body).toBe("grant_type=client_credentials");
    expect(apiCall().init.headers.Authorization).toBe("Bearer tok");
  });

  it("createOrder: USD amount in dollars, custom_id = transfer id, idempotency key", async () => {
    respond({ id: "ORD1" });
    const out = await createOrder("T1", 5105, "Transfer to mama");
    const { url, init, body } = apiCall();
    expect(out.id).toBe("ORD1");
    expect(url).toBe("https://api-m.sandbox.paypal.com/v2/checkout/orders");
    expect(init.method).toBe("POST");
    expect(init.headers["PayPal-Request-Id"]).toBe("order-T1");
    expect(body.intent).toBe("CAPTURE");
    expect(body.purchase_units[0]).toMatchObject({ custom_id: "T1", amount: { currency_code: "USD", value: "51.05" } });
  });

  it("createOrder truncates long descriptions to 120 characters", async () => {
    respond({ id: "ORD1" });
    await createOrder("T1", 100, "a".repeat(300));
    expect(apiCall().body.purchase_units[0].description).toHaveLength(120);
  });

  it("captureOrder hits the capture endpoint with an idempotency key", async () => {
    respond({ status: "COMPLETED", purchase_units: [] });
    await captureOrder("ORD1");
    const { url, init } = apiCall();
    expect(url).toBe("https://api-m.sandbox.paypal.com/v2/checkout/orders/ORD1/capture");
    expect(init.headers["PayPal-Request-Id"]).toBe("capture-ORD1");
  });

  it("createPayout pays the recipient's email with a deterministic batch id", async () => {
    respond({ batch_header: { payout_batch_id: "B1", batch_status: "PENDING" } });
    await createPayout("T1", "mama@example.com", 5000, "n".repeat(500));
    const { url, init, body } = apiCall();
    expect(url).toBe("https://api-m.sandbox.paypal.com/v1/payments/payouts");
    expect(init.headers["PayPal-Request-Id"]).toBe("payout-T1");
    expect(body.sender_batch_header.sender_batch_id).toBe("tuma-T1");
    expect(body.items).toHaveLength(1);
    expect(body.items[0]).toMatchObject({
      recipient_type: "EMAIL", receiver: "mama@example.com", sender_item_id: "T1",
      amount: { currency_code: "USD", value: "50.00" },
    });
    expect(body.items[0].note).toHaveLength(200);
  });

  it("getPayoutBatch and refundCapture use the right endpoints", async () => {
    respond({ batch_header: { batch_status: "SUCCESS" } });
    await getPayoutBatch("B1");
    expect(apiCall().url).toBe("https://api-m.sandbox.paypal.com/v1/payments/payouts/B1");

    fetchMock.mockClear();
    respond({ id: "R1", status: "COMPLETED" });
    await refundCapture("CAP1", "T1");
    const { url, init } = apiCall();
    expect(url).toBe("https://api-m.sandbox.paypal.com/v2/payments/captures/CAP1/refund");
    expect(init.headers["PayPal-Request-Id"]).toBe("refund-T1");
  });

  it("throws PayPalError carrying the HTTP status on API failures", async () => {
    respond({ name: "UNPROCESSABLE_ENTITY" }, 422);
    const err = await createOrder("T1", 100, "x").catch((e) => e);
    expect(err).toBeInstanceOf(PayPalError);
    expect(err.status).toBe(422);
    expect(err.message).toContain("/v2/checkout/orders");
  });

  it("throws a plain error (not PayPalError) when authentication fails", async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 401, json: async () => ({}) });
    const err = await createOrder("T1", 100, "x").catch((e) => e);
    expect(err).not.toBeInstanceOf(PayPalError);
    expect(err.message).toBe("PayPal auth failed: 401");
  });
});

describe("verifyWebhook", () => {
  const headers = new Headers({
    "paypal-auth-algo": "SHA256withRSA", "paypal-cert-url": "https://api.paypal.com/cert",
    "paypal-transmission-id": "tid", "paypal-transmission-sig": "sig", "paypal-transmission-time": "2026-10-17T10:00:00Z",
  });
  const raw = JSON.stringify({ id: "WH-EVT-1", event_type: "PAYMENT.CAPTURE.COMPLETED" });

  it("returns true only for SUCCESS and forwards the signature headers", async () => {
    respond({ verification_status: "SUCCESS" });
    expect(await verifyWebhook(headers, raw)).toBe(true);
    const { url, body } = apiCall();
    expect(url).toContain("/v1/notifications/verify-webhook-signature");
    expect(body).toMatchObject({
      auth_algo: "SHA256withRSA", transmission_id: "tid", transmission_sig: "sig",
      webhook_id: "WH-1", webhook_event: { id: "WH-EVT-1" },
    });
  });

  it("returns false for any other verification status", async () => {
    respond({ verification_status: "FAILURE" });
    expect(await verifyWebhook(headers, raw)).toBe(false);
  });
});
