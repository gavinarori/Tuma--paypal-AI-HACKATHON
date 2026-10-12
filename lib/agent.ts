import Anthropic from "@anthropic-ai/sdk";
import { pool } from "./db";
import { getQuote, type Quote } from "./quote";

const client = new Anthropic();
const MODEL = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-6";
const OWNER = "demo"; // single demo user; replace with real auth later

export type PendingQuote = {
  senderName: string;
  recipientName: string;
  recipientEmail: string;
  country: string;
  purpose: string | null;
  language: string;
  amountUsd: number;
  quote: Quote;
};
export type ChatMsg = { role: "user" | "assistant"; content: string };

const SYSTEM = `You are Tuma, an assistant that helps people abroad send money to family in Kenya via PayPal.
Rules:
- The recipient receives USD in their own PayPal account (they can withdraw it locally). Local-currency figures are indicative only.
- Reply in the language the user writes in (English, Swahili, French or Nigerian Pidgin). Keep replies short and warm.
- You can only PREPARE a transfer. Use prepare_quote; the app then shows the user a confirmation card.
  Never say money has been sent. Tell the user to review the card and confirm.
- Never invent or calculate amounts, fees or exchange rates yourself. Only repeat numbers returned by tools.
- If the recipient is not in the address book, ask for their PayPal email address and call save_recipient.
- If the amount or recipient is unclear, ask one short question.
- For "where is my money" questions, call get_transfer_status.
- Decline anything unrelated to sending money or checking a transfer.`;

const tools: Anthropic.Tool[] = [
  {
    name: "find_recipient",
    description: "Look up a saved recipient by name or nickname (e.g. 'mama').",
    input_schema: { type: "object", properties: { name: { type: "string" } }, required: ["name"] },
  },
  {
    name: "save_recipient",
    description: "Save a new recipient identified by their PayPal email address.",
    input_schema: {
      type: "object",
      properties: { name: { type: "string" }, email: { type: "string", description: "The recipient's PayPal email address" }, country: { type: "string", description: "ISO code, default KE" } },
      required: ["name", "email"],
    },
  },
  {
    name: "prepare_quote",
    description: "Prepare a transfer quote for the user to confirm. Does NOT move money.",
    input_schema: {
      type: "object",
      properties: {
        recipient_name: { type: "string" },
        amount_usd: { type: "number", description: "Amount in USD the recipient should receive" },
        purpose: { type: "string" },
        language: { type: "string", description: "User's language code: en, sw, fr or pcm" },
      },
      required: ["recipient_name", "amount_usd", "language"],
    },
  },
  {
    name: "get_transfer_status",
    description: "Get status and timeline of a transfer. Omit transfer_id for the latest one.",
    input_schema: { type: "object", properties: { transfer_id: { type: "string" } } },
  },
];

type Ctx = { pending: PendingQuote | null };

async function runTool(name: string, input: Record<string, unknown>, ctx: Ctx): Promise<string> {
  try {
    if (name === "find_recipient") {
      const r = await pool.query(
        "SELECT name, paypal_email, country FROM recipients WHERE owner=$1 AND lower(name)=lower($2)",
        [OWNER, String(input.name)]
      );
      return JSON.stringify(r.rowCount ? r.rows[0] : { found: false });
    }
    if (name === "save_recipient") {
      const email = String(input.email).trim();
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return JSON.stringify({ error: "That doesn't look like a valid email address." });
      await pool.query(
        `INSERT INTO recipients (owner, name, paypal_email, country) VALUES ($1,$2,$3,$4)
         ON CONFLICT (owner, lower(name)) DO UPDATE SET paypal_email=EXCLUDED.paypal_email`,
        [OWNER, String(input.name), email, String(input.country ?? "KE")]
      );
      return JSON.stringify({ saved: true });
    }
    if (name === "prepare_quote") {
      const r = await pool.query(
        "SELECT name, paypal_email, country FROM recipients WHERE owner=$1 AND lower(name)=lower($2)",
        [OWNER, String(input.recipient_name)]
      );
      if (!r.rowCount) return JSON.stringify({ error: "Recipient not found. Ask for their PayPal email address." });
      const amountUsd = Number(input.amount_usd);
      const quote = getQuote(Math.round(amountUsd * 100), r.rows[0].country);
      ctx.pending = {
        senderName: "Demo Sender",
        recipientName: r.rows[0].name,
        recipientEmail: r.rows[0].paypal_email,
        country: r.rows[0].country,
        purpose: input.purpose ? String(input.purpose) : null,
        language: String(input.language ?? "en"),
        amountUsd,
        quote,
      };
      return JSON.stringify({
        ok: true, recipient: r.rows[0].name, amount_usd: amountUsd,
        fee_usd: quote.feeUsdCents / 100, total_usd: quote.totalUsdCents / 100,
        fx_rate_indicative: quote.fxRate, recipient_receives: `${amountUsd} USD in their PayPal account (about ${quote.payoutLocalAmount} ${quote.payoutCurrency}, indicative)`,
        note: "A confirmation card is now shown to the user.",
      });
    }
    if (name === "get_transfer_status") {
      const r = input.transfer_id
        ? await pool.query("SELECT * FROM transfers WHERE id=$1", [String(input.transfer_id)])
        : await pool.query("SELECT * FROM transfers ORDER BY created_at DESC LIMIT 1");
      if (!r.rowCount) return JSON.stringify({ found: false });
      const t = r.rows[0];
      const ev = await pool.query(
        "SELECT to_status, created_at FROM transfer_events WHERE transfer_id=$1 ORDER BY id", [t.id]
      );
      return JSON.stringify({
        id: t.id, recipient: t.recipient_name, status: t.status,
        amount_usd: t.amount_usd_cents / 100, timeline: ev.rows,
      });
    }
    return JSON.stringify({ error: "Unknown tool" });
  } catch (e) {
    return JSON.stringify({ error: (e as Error).message });
  }
}

export async function runAgent(history: ChatMsg[]) {
  const messages: Anthropic.MessageParam[] = history.map((m) => ({ role: m.role, content: m.content }));
  const ctx: Ctx = { pending: null };

  for (let i = 0; i < 6; i++) {
    const res = await client.messages.create({
      model: MODEL, max_tokens: 1024, system: SYSTEM, tools, messages,
    });
    messages.push({ role: "assistant", content: res.content });

    if (res.stop_reason !== "tool_use") {
      const reply = res.content
        .filter((b): b is Anthropic.TextBlock => b.type === "text")
        .map((b) => b.text).join("\n");
      return { reply, pending: ctx.pending };
    }
    const results: Anthropic.ToolResultBlockParam[] = [];
    for (const b of res.content) {
      if (b.type === "tool_use") {
        results.push({
          type: "tool_result", tool_use_id: b.id,
          content: await runTool(b.name, b.input as Record<string, unknown>, ctx),
        });
      }
    }
    messages.push({ role: "user", content: results });
  }
  return { reply: "Sorry, I couldn't finish that. Please try again.", pending: ctx.pending };
}
