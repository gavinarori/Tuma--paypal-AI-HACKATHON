import { PayPalError } from "./paypal-error";
import * as sim from "./paypal-sim";
export { PayPalError };

// With NEXT_PUBLIC_PAYPAL_MODE=simulate every call below is answered by the built-in simulator (no PayPal account needed).
const simulated = () => process.env.NEXT_PUBLIC_PAYPAL_MODE === "simulate";

const BASE = process.env.PAYPAL_API_BASE ?? "https://api-m.sandbox.paypal.com";

async function accessToken(): Promise<string> {
  const creds = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString("base64");
  const res = await fetch(`${BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${creds}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`PayPal auth failed: ${res.status}`);
  return (await res.json()).access_token;
}

async function pp<T>(path: string, init: RequestInit & { requestId?: string } = {}): Promise<T> {
  const token = await accessToken();
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init.requestId ? { "PayPal-Request-Id": init.requestId } : {}),
    },
    cache: "no-store",
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new PayPalError(res.status, `PayPal ${path} ${res.status}: ${JSON.stringify(body)}`);
  return body as T;
}

const usd = (cents: number) => (cents / 100).toFixed(2);

/** Create an order. custom_id carries our transfer id so webhooks can find it. */
export function createOrder(transferId: string, totalUsdCents: number, description: string) {
  if (simulated()) return sim.createOrder(transferId, totalUsdCents, description);
  return pp<{ id: string }>("/v2/checkout/orders", {
    method: "POST",
    requestId: `order-${transferId}`, // idempotency
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          custom_id: transferId,
          description: description.slice(0, 120),
          amount: { currency_code: "USD", value: usd(totalUsdCents) },
        },
      ],
    }),
  });
}

export function captureOrder(orderId: string) {
  if (simulated()) return sim.captureOrder(orderId);
  return pp<{
    status: string;
    purchase_units: { payments: { captures: { id: string; status: string }[] } }[];
  }>(`/v2/checkout/orders/${orderId}/capture`, {
    method: "POST",
    requestId: `capture-${orderId}`,
    body: "{}",
  });
}

/** Verify a webhook with PayPal's verification endpoint. */
export async function verifyWebhook(headers: Headers, rawBody: string): Promise<boolean> {
  if (simulated()) return sim.verifyWebhook(headers);
  const result = await pp<{ verification_status: string }>(
    "/v1/notifications/verify-webhook-signature",
    {
      method: "POST",
      body: JSON.stringify({
        auth_algo: headers.get("paypal-auth-algo"),
        cert_url: headers.get("paypal-cert-url"),
        transmission_id: headers.get("paypal-transmission-id"),
        transmission_sig: headers.get("paypal-transmission-sig"),
        transmission_time: headers.get("paypal-transmission-time"),
        webhook_id: process.env.PAYPAL_WEBHOOK_ID,
        webhook_event: JSON.parse(rawBody),
      }),
    }
  );
  return result.verification_status === "SUCCESS";
}

/** Send money to a recipient's PayPal account. sender_batch_id makes retries safe for 30 days. */
export function createPayout(transferId: string, email: string, amountUsdCents: number, note: string) {
  if (simulated()) return sim.createPayout(transferId, email, amountUsdCents);
  return pp<{ batch_header: { payout_batch_id: string; batch_status: string } }>("/v1/payments/payouts", {
    method: "POST",
    requestId: `payout-${transferId}`,
    body: JSON.stringify({
      sender_batch_header: {
        sender_batch_id: `tuma-${transferId}`,
        email_subject: "You received money via Tuma",
        email_message: "Someone sent you money with Tuma.",
      },
      items: [
        {
          recipient_type: "EMAIL",
          receiver: email,
          sender_item_id: transferId,
          note: note.slice(0, 200),
          amount: { currency_code: "USD", value: usd(amountUsdCents) },
        },
      ],
    }),
  });
}

export function getPayoutBatch(batchId: string) {
  if (simulated()) return sim.getPayoutBatch(batchId);
  return pp<{
    batch_header: { batch_status: string };
    items?: { transaction_status: string }[];
  }>(`/v1/payments/payouts/${batchId}`);
}

/** Full refund of a captured payment. Idempotent per transfer. */
export function refundCapture(captureId: string, transferId: string) {
  if (simulated()) return sim.refundCapture(captureId, transferId);
  return pp<{ id: string; status: string }>(`/v2/payments/captures/${captureId}/refund`, {
    method: "POST",
    requestId: `refund-${transferId}`,
    body: "{}",
  });
}