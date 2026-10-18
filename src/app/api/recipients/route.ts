import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

// Saves the recipient the sender typed into the on-screen details form (demo user, no login).
export async function POST(req: Request) {
  try {
    const b = await req.json();
    const name = String(b.name ?? "").trim();
    const email = String(b.email ?? "").trim();
    const country = /^[A-Za-z]{2}$/.test(String(b.country ?? "")) ? String(b.country).toUpperCase() : "KE";
    if (!name || name.length > 60) return NextResponse.json({ error: "Recipient name is required (60 characters max)." }, { status: 400 });
    if (!EMAIL.test(email)) return NextResponse.json({ error: "Enter a valid PayPal email." }, { status: 400 });
    await pool.query(
      `INSERT INTO recipients (owner, name, paypal_email, country) VALUES ('demo', $1, $2, $3)
       ON CONFLICT (owner, lower(name)) DO UPDATE SET paypal_email = EXCLUDED.paypal_email, country = EXCLUDED.country`,
      [name, email, country]
    );
    return NextResponse.json({ saved: true });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}