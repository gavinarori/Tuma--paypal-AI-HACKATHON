import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getQuote } from "@/lib/quote";
import { createOrder } from "@/lib/paypal";
import { transition } from "@/lib/transfers";

// Creates a draft transfer + PayPal order. Called ONLY after the user confirms the quote card.
export async function POST(req: Request) {
  try {
    const b = await req.json();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(b.recipientEmail))) throw new Error("Recipient PayPal email required");
    const q = getQuote(Math.round(Number(b.amountUsd) * 100), b.country ?? "KE");
    const ins = await pool.query(
      `INSERT INTO transfers (sender_name, recipient_name, recipient_email, recipient_country,
         amount_usd_cents, fee_usd_cents, fx_rate, payout_local_amount, payout_currency, purpose, language)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING id`,
      [b.senderName ?? "Sender", b.recipientName, b.recipientEmail, b.country ?? "KE",
       q.amountUsdCents, q.feeUsdCents, q.fxRate, q.payoutLocalAmount, q.payoutCurrency,
       b.purpose ?? null, b.language ?? "en"]
    );
    const id = ins.rows[0].id as string;
    const order = await createOrder(id, q.totalUsdCents, `Transfer to ${b.recipientName}`);
    await pool.query("UPDATE transfers SET paypal_order_id=$2 WHERE id=$1", [id, order.id]);
    await transition(id, "awaiting_payment", { orderId: order.id });
    return NextResponse.json({ transferId: id, orderId: order.id, quote: q });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
