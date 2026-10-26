import { NextResponse } from "next/server";
import { ThinkingLevel } from "@google/genai";
import { pool } from "@/lib/db";
import { generate } from "@/lib/gemini";
import { isSimulated } from "@/lib/paypal-sim";

// Open http://localhost:3000/api/health to see what is misconfigured. Development only.
type Check = { name: string; ok: boolean; detail: string; fix?: string };

export async function GET() {
  if (process.env.NODE_ENV === "production") return NextResponse.json({ error: "Not found" }, { status: 404 });
  const env = process.env;
  const checks: Check[] = [];
  const add = (name: string, ok: boolean, detail: string, fix?: string) => checks.push({ name, ok, detail, ...(ok || !fix ? {} : { fix }) });

  const simPay = isSimulated();
  const simAi = env.SIMULATE_AI === "true";
  for (const k of ["DATABASE_URL", ...(simPay ? [] : ["PAYPAL_CLIENT_ID", "PAYPAL_CLIENT_SECRET", "NEXT_PUBLIC_PAYPAL_CLIENT_ID"]), ...(simAi ? [] : ["GEMINI_API_KEY"])]) {
    const set = Boolean(env[k]?.trim());
    add(`Setting ${k}`, set, set ? "set" : "missing", `Add ${k} to .env.local, then restart npm run dev`);
  }
  if (!simPay && env.PAYPAL_CLIENT_ID && env.NEXT_PUBLIC_PAYPAL_CLIENT_ID && env.PAYPAL_CLIENT_ID.trim() !== env.NEXT_PUBLIC_PAYPAL_CLIENT_ID.trim()) {
    add("NEXT_PUBLIC_PAYPAL_CLIENT_ID matches PAYPAL_CLIENT_ID", false, "different values", "Both must be the same sandbox client ID");
  }
  const base = (env.PAYPAL_API_BASE ?? "https://api-m.sandbox.paypal.com").trim();
  const baseOk = /^https:\/\/api-m\.(sandbox\.)?paypal\.com$/.test(base);
  if (!simPay) add("Setting PAYPAL_API_BASE", baseOk, base, "Use https://api-m.sandbox.paypal.com (not sandbox.paypal.com)");

  // Database: reachable, migrated, and a usable demo recipient
  try {
    await pool.query("SELECT 1");
    add("Database connection", true, "connected");
    const t = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public'");
    const tables = new Set(t.rows.map((r) => r.table_name));
    const missingTables = ["transfers", "transfer_events", "webhook_events", "recipients", "conversations", "messages", ...(simPay ? ["sim_paypal"] : [])].filter((x) => !tables.has(x));
    add("Database tables", !missingTables.length, missingTables.length ? `missing: ${missingTables.join(", ")}` : "all present",
      "Restart npm run dev: the tables are created automatically on start. If this stays red, look for 'automatic database setup failed' in the terminal.");
    if (!missingTables.length) {
      const c = await pool.query("SELECT table_name || '.' || column_name AS c FROM information_schema.columns WHERE table_schema='public'");
      const cols = new Set(c.rows.map((r) => r.c));
      const missingCols = ["recipients.paypal_email", "transfers.recipient_email", "transfers.payout_batch_id", "transfers.receipt_text", "transfers.conversation_id"].filter((x) => !cols.has(x));
      add("Database columns", !missingCols.length, missingCols.length ? `missing: ${missingCols.join(", ")}` : "up to date", "Restart npm run dev: the tables are created automatically on start. If this stays red, look for 'automatic database setup failed' in the terminal.");
      if (!missingCols.length) {
        const r = await pool.query("SELECT name, paypal_email FROM recipients WHERE owner='demo' ORDER BY name");
        const usable = r.rows.filter((x) => x.paypal_email && !String(x.paypal_email).startsWith("REPLACE"));
        add("Recipient with a PayPal email", usable.length > 0, usable.length ? usable.map((x) => x.name).join(", ") : "none yet",
          "Chat \"Send $10 to mama\" and give the email when Tuma asks, or run: UPDATE recipients SET paypal_email='<sandbox personal email>' WHERE lower(name)='mama';");
      }
    }
  } catch (e) {
    add("Database connection", false, (e as Error).message, "Start Postgres and make sure DATABASE_URL points at a database that exists");
  }

  // PayPal sandbox login
  if (simPay) add("PayPal", true, "simulator is ON (no real PayPal is used)");
  else if (baseOk && env.PAYPAL_CLIENT_ID && env.PAYPAL_CLIENT_SECRET) {
    try {
      const res = await fetch(`${base}/v1/oauth2/token`, {
        method: "POST",
        headers: { Authorization: `Basic ${Buffer.from(`${env.PAYPAL_CLIENT_ID}:${env.PAYPAL_CLIENT_SECRET}`).toString("base64")}`, "Content-Type": "application/x-www-form-urlencoded" },
        body: "grant_type=client_credentials", cache: "no-store",
      });
      add("PayPal sandbox login", res.ok, res.ok ? "credentials accepted" : `PayPal answered ${res.status}`, "Use the Client ID and Secret of a Sandbox app from developer.paypal.com");
    } catch (e) {
      add("PayPal sandbox login", false, (e as Error).message, "Check your internet connection");
    }
  }

  // Gemini
  if (simAi) add("Gemini", true, "simulated AI is ON (no Gemini key needed)");
  else if (env.GEMINI_API_KEY?.trim()) {
    try {
      const { res, model } = await generate({ contents: [{ role: "user", parts: [{ text: "Reply with the single word OK" }] }], config: { thinkingConfig: { thinkingLevel: ThinkingLevel.LOW } } });
      add("Gemini", true, `answered with ${model}${res.text ? "" : " (empty text)"}`);
    } catch (e) {
      const status = (e as { status?: number }).status;
      add("Gemini", false, status === 404 ? "model not available" : status === 429 ? "free quota is busy right now" : status === 400 || status === 401 || status === 403 ? "API key rejected" : (e as Error).message.slice(0, 160),
        status === 404 ? "Set GEMINI_MODEL=gemini-3.8-flash and GEMINI_FALLBACK_MODEL=gemini-3.5-flash-lite" : "Create a key in Google AI Studio and put it in GEMINI_API_KEY");
    }
  }

  return NextResponse.json({ ok: checks.every((c) => c.ok), checks });
}