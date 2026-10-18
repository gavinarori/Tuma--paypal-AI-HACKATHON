import { Type, ThinkingLevel, type Content, type FunctionDeclaration, type Part } from "@google/genai";
import { pool } from "./db";
import { getQuote, type Quote } from "./quote";
import { generate, MODELS } from "./gemini";

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

const SYSTEM = `You are Tuma, a friendly assistant that helps people abroad send money to family in Kenya through PayPal.

LANGUAGE
- The user may write or speak English, Swahili (including Sheng), French or Nigerian Pidgin, and may mix them. Always reply in the language of the user's latest message, in 1 or 2 short sentences.
- Set the language argument of prepare_quote to en, sw, fr or pcm to match.

UNDERSTANDING REQUESTS
- Amounts are US dollars. "dola", "dollars", "$" all mean USD. Convert number words to digits:
  Swahili: kumi 10, ishirini 20, thelathini 30, arobaini 40, hamsini 50, sitini 60, sabini 70, themanini 80, tisini 90, mia 100, mia mbili 200, mia tano 500; "ishirini na tano" is 25.
  French: vingt 20, trente 30, quarante 40, cinquante 50, cent 100. English/Pidgin: "fifty" 50, "one hundred" 100.
- If the user gives an amount in shillings, KES or "bob", do not convert it yourself. Ask for the amount in dollars.
- Family words are recipient names: mama/maman/mum/mother, baba/papa/dad, dada (sister), kaka (brother), bibi (grandmother).
- Examples: "Nitumie mama dola hamsini kwa kodi" means prepare_quote(mama, 50, purpose "kodi", sw). "Envoie quarante dollars à maman" means (mama, 40, fr). "Abeg send mama twenty dollars for rent" means (mama, 20, pcm).

RULES
- The recipient receives USD in their own PayPal account (they can withdraw it locally). Local-currency figures are indicative only.
- You can only PREPARE a transfer with prepare_quote. The app then shows a confirmation card. Never say money has been sent; tell the user to review the card and confirm.
- Never invent or calculate amounts, fees or exchange rates. Only repeat numbers returned by tools.
- If the recipient is not found, ask for their PayPal email address and call save_recipient.
- If the amount or recipient is unclear, ask one short question.
- For "where is my money" questions, call get_transfer_status.
- Decline anything unrelated to sending money or checking a transfer.`;

const declarations: FunctionDeclaration[] = [
  {
    name: "find_recipient",
    description: "Look up a saved recipient by name or family word (e.g. mama, maman, baba).",
    parameters: { type: Type.OBJECT, properties: { name: { type: Type.STRING } }, required: ["name"] },
  },
  {
    name: "save_recipient",
    description: "Save a new recipient identified by their PayPal email address.",
    parameters: {
      type: Type.OBJECT,
      properties: { name: { type: Type.STRING }, email: { type: Type.STRING, description: "The recipient's PayPal email address" }, country: { type: Type.STRING, description: "ISO country code, default KE" } },
      required: ["name", "email"],
    },
  },
  {
    name: "prepare_quote",
    description: "Prepare a transfer quote for the user to confirm. Does NOT move money.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        recipient_name: { type: Type.STRING },
        amount_usd: { type: Type.NUMBER, description: "Amount in USD the recipient should receive" },
        purpose: { type: Type.STRING, description: "Why they are sending, in the user's own words" },
        language: { type: Type.STRING, description: "User's language: en, sw, fr or pcm" },
      },
      required: ["recipient_name", "amount_usd", "language"],
    },
  },
  {
    name: "get_transfer_status",
    description: "Get status and timeline of a transfer. Omit transfer_id for the latest one.",
    parameters: { type: Type.OBJECT, properties: { transfer_id: { type: Type.STRING } } },
  },
];

// "maman", "mum" and "mother" should all find a recipient saved as "mama".
const GROUPS = [
  ["mama", "maman", "mum", "mom", "mother", "mummy", "mami"],
  ["baba", "papa", "dad", "daddy", "father"],
];
const strip = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase();
const variants = (n: string) => GROUPS.find((g) => g.includes(strip(n))) ?? [strip(n)];

async function findRecipient(name: string) {
  const r = await pool.query(
    "SELECT name, paypal_email, country FROM recipients WHERE owner=$1 AND lower(name)=ANY($2) LIMIT 1",
    [OWNER, variants(name)]
  );
  return r.rows[0] as { name: string; paypal_email: string; country: string } | undefined;
}

type Ctx = { pending: PendingQuote | null };
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

async function runTool(name: string, input: Record<string, unknown>, ctx: Ctx): Promise<string> {
  try {
    if (name === "find_recipient") {
      const r = await findRecipient(String(input.name));
      return JSON.stringify(r ? { name: r.name, country: r.country, has_paypal_email: Boolean(r.paypal_email) } : { found: false });
    }
    if (name === "save_recipient") {
      const email = String(input.email).trim();
      if (!EMAIL.test(email)) return JSON.stringify({ error: "That doesn't look like a valid email address." });
      await pool.query(
        `INSERT INTO recipients (owner, name, paypal_email, country) VALUES ($1,$2,$3,$4)
         ON CONFLICT (owner, lower(name)) DO UPDATE SET paypal_email=EXCLUDED.paypal_email`,
        [OWNER, strip(String(input.name)), email, String(input.country ?? "KE")]
      );
      return JSON.stringify({ saved: true });
    }
    if (name === "prepare_quote") {
      const r = await findRecipient(String(input.recipient_name));
      if (!r) return JSON.stringify({ error: "Recipient not found. Ask for their PayPal email address." });
      if (!r.paypal_email || r.paypal_email.startsWith("REPLACE")) return JSON.stringify({ error: "This recipient has no PayPal email yet. Ask for it." });
      const amountUsd = Number(input.amount_usd);
      const quote = getQuote(Math.round(amountUsd * 100), r.country);
      ctx.pending = {
        senderName: "Demo Sender",
        recipientName: r.name,
        recipientEmail: r.paypal_email,
        country: r.country,
        purpose: input.purpose ? String(input.purpose) : null,
        language: String(input.language ?? "en"),
        amountUsd,
        quote,
      };
      return JSON.stringify({
        ok: true, recipient: r.name, amount_usd: amountUsd,
        fee_usd: quote.feeUsdCents / 100, total_usd: quote.totalUsdCents / 100,
        fx_rate_indicative: quote.fxRate,
        recipient_receives: `${amountUsd} USD in their PayPal account (about ${quote.payoutLocalAmount} ${quote.payoutCurrency}, indicative)`,
        note: "A confirmation card is now shown to the user.",
      });
    }
    if (name === "get_transfer_status") {
      const r = input.transfer_id
        ? await pool.query("SELECT * FROM transfers WHERE id=$1", [String(input.transfer_id)])
        : await pool.query("SELECT * FROM transfers ORDER BY created_at DESC LIMIT 1");
      if (!r.rowCount) return JSON.stringify({ found: false });
      const t = r.rows[0];
      const ev = await pool.query("SELECT to_status, created_at FROM transfer_events WHERE transfer_id=$1 ORDER BY id", [t.id]);
      return JSON.stringify({ id: t.id, recipient: t.recipient_name, status: t.status, amount_usd: t.amount_usd_cents / 100, timeline: ev.rows });
    }
    return JSON.stringify({ error: "Unknown tool" });
  } catch (e) {
    return JSON.stringify({ error: (e as Error).message });
  }
}

export async function runAgent(history: ChatMsg[]) {
  // Gemini wants the conversation to start with the user, so drop the leading assistant greeting.
  const first = history.findIndex((m) => m.role === "user");
  const contents: Content[] = history.slice(Math.max(first, 0)).map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));
  const ctx: Ctx = { pending: null };
  let models = MODELS;

  for (let i = 0; i < 6; i++) {
    const { res, model } = await generate(
      { contents, config: { systemInstruction: SYSTEM, tools: [{ functionDeclarations: declarations }], thinkingConfig: { thinkingLevel: ThinkingLevel.LOW } } },
      models
    );
    models = [model]; // stay on the model that worked for the rest of this turn
    const calls = res.functionCalls ?? [];
    if (!calls.length) {
      return { reply: (res.text ?? "").trim() || "Sorry, I didn't catch that. Could you say it again?", pending: ctx.pending };
    }
    const modelContent = res.candidates?.[0]?.content;
    if (modelContent) contents.push(modelContent);
    const parts: Part[] = [];
    for (const c of calls) {
      const out = await runTool(c.name ?? "", (c.args ?? {}) as Record<string, unknown>, ctx);
      parts.push({ functionResponse: { name: c.name, response: { output: JSON.parse(out) } } });
    }
    contents.push({ role: "user", parts });
  }
  return { reply: "Sorry, I couldn't finish that. Please try again.", pending: ctx.pending };
}