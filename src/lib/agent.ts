import { Type, ThinkingLevel, type Content, type FunctionDeclaration, type Part } from "@google/genai";
import { pool } from "./db";
import { getQuote, type Quote } from "./quote";
import { getReceipt } from "./receipt";
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
- The app collects the recipient's name and PayPal email in a form on screen. Call prepare_quote even when the recipient is new or has no email saved; the app then shows the form. If the user types an email address in chat while a quote is on screen, call provide_recipient_email so the form is filled in, then tell them to check the details and press Continue.
- Payment happens in PayPal. When the user clearly agrees in chat (yes, ok, confirm, sawa, ndiyo, oui, d'accord, "they are okay", "go ahead") and the current state says the recipient details are confirmed, call start_checkout, then tell them to tap the PayPal button to approve. If the details are not confirmed yet, tell them to check the recipient form and press Continue.
- Never say a transfer is processing, paid or sent unless a tool result says so. If any tool returns an error, say so honestly and never pretend it worked.
- For a receipt or "what happened to my transfer", call get_receipt or get_transfer_status. Only describe outcomes a tool returned; if nothing is found, say so.
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
  {
    name: "get_receipt",
    description: "Get the receipt of a finished transfer (delivered or failed). Omit transfer_id for the latest one.",
    parameters: { type: Type.OBJECT, properties: { transfer_id: { type: Type.STRING } } },
  },
  {
    name: "provide_recipient_email",
    description: "The user typed the recipient's PayPal email in chat while a quote is on screen. Fills it into the on-screen recipient form.",
    parameters: { type: Type.OBJECT, properties: { email: { type: Type.STRING }, name: { type: Type.STRING, description: "Recipient name, only if the user gave one" } }, required: ["email"] },
  },
  {
    name: "start_checkout",
    description: "Open PayPal for the quote on screen after the user clearly confirms in chat. Only works when the recipient details are confirmed. Does not move money: the user still approves in PayPal.",
    parameters: { type: Type.OBJECT, properties: {} },
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

type Ctx = { pending: PendingQuote | null; checkout: boolean; systemError: boolean; lang: string; awaiting: Awaiting };

const USER_ERRORS = /^(Amount must be between|Unsupported destination)/; // the user's fault, not a system failure

// Shown instead of the model's reply when a tool crashed, so the model can never pretend it worked.
const TECH_TROUBLE: Record<string, string> = {
  en: "Sorry, something went wrong on our side and I couldn't prepare that transfer. Nothing was charged. Please try again in a moment.",
  sw: "Samahani, kuna hitilafu upande wetu na sikuweza kuandaa uhamisho huo. Hakuna pesa iliyokatwa. Tafadhali jaribu tena baada ya muda mfupi.",
  fr: "Désolé, un problème est survenu de notre côté et je n'ai pas pu préparer ce transfert. Rien n'a été débité. Réessayez dans un instant.",
  pcm: "Sorry, wahala dey our side and I no fit prepare that transfer. Dem no collect any money. Abeg try again small time.",
};
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

async function runTool(name: string, input: Record<string, unknown>, ctx: Ctx): Promise<string> {
  if (typeof input.language === "string") ctx.lang = input.language;
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
      // A new recipient (or one with no usable email) is fine: the on-screen form collects the details.
      const email = r?.paypal_email && !r.paypal_email.startsWith("REPLACE") ? r.paypal_email : "";
      const recipientName = r?.name ?? String(input.recipient_name).trim();
      const country = r?.country ?? "KE";
      const amountUsd = Number(input.amount_usd);
      const quote = getQuote(Math.round(amountUsd * 100), country);
      ctx.pending = {
        senderName: "Demo Sender",
        recipientName,
        recipientEmail: email,
        country,
        purpose: input.purpose ? String(input.purpose) : null,
        language: String(input.language ?? "en"),
        amountUsd,
        quote,
      };
      return JSON.stringify({
        ok: true, recipient: recipientName, details_needed: !email, amount_usd: amountUsd,
        fee_usd: quote.feeUsdCents / 100, total_usd: quote.totalUsdCents / 100,
        fx_rate_indicative: quote.fxRate,
        recipient_receives: `${amountUsd} USD in their PayPal account (about ${quote.payoutLocalAmount} ${quote.payoutCurrency}, indicative)`,
        note: "The app now shows the user a form for the recipient's name and PayPal email, then a review card. Do not ask for the email in chat.",
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
    if (name === "get_receipt") {
      const r = input.transfer_id
        ? await pool.query("SELECT id, status FROM transfers WHERE id=$1", [String(input.transfer_id)])
        : await pool.query("SELECT id, status FROM transfers ORDER BY created_at DESC LIMIT 1");
      if (!r.rowCount) return JSON.stringify({ found: false });
      const { id, status } = r.rows[0];
      if (!["delivered", "failed"].includes(status))
        return JSON.stringify({ status, note: "This transfer isn't finished yet, so there is no receipt. Tell the user its current status." });
      return JSON.stringify({ status, reference: String(id).slice(0, 8).toUpperCase(), receipt: await getReceipt(id) });
    }
    if (name === "provide_recipient_email") {
      const a = ctx.awaiting;
      if (!a) return JSON.stringify({ error: "There is no quote on screen. Prepare one first." });
      const email = String(input.email ?? "").trim();
      if (!EMAIL.test(email)) return JSON.stringify({ error: "That doesn't look like a valid email address." });
      const country = a.country ?? "KE";
      ctx.pending = {
        senderName: "Demo Sender",
        recipientName: input.name ? String(input.name).trim() : a.recipient,
        recipientEmail: email,
        country,
        purpose: a.purpose ?? null,
        language: a.language ?? ctx.lang,
        amountUsd: a.amountUsd,
        quote: getQuote(Math.round(a.amountUsd * 100), country),
      };
      return JSON.stringify({ ok: true, note: "The email is now filled into the on-screen form. Tell the user to check the details and press Continue to review." });
    }
    if (name === "start_checkout") {
      if (!ctx.awaiting) return JSON.stringify({ error: "There is no quote on screen. Prepare one first." });
      if (!ctx.awaiting.detailsConfirmed)
        return JSON.stringify({ error: "The recipient details haven't been confirmed yet. Tell the user to check the recipient form and press Continue to review." });
      ctx.checkout = true;
      return JSON.stringify({ ok: true, note: "The PayPal button is now shown. Tell the user to tap the PayPal button to approve the payment. Nothing is paid until they approve in PayPal." });
    }
    return JSON.stringify({ error: "Unknown tool" });
  } catch (e) {
    console.error(`tool ${name} failed:`, (e as Error).message); // shows the real cause in the npm run dev terminal
    if (!USER_ERRORS.test((e as Error).message)) ctx.systemError = true;
    return JSON.stringify({ error: (e as Error).message });
  }
}

export type Awaiting = { recipient: string; amountUsd: number; detailsConfirmed?: boolean; purpose?: string | null; language?: string; country?: string } | null;

export async function runAgent(history: ChatMsg[], opts: { awaiting?: Awaiting } = {}) {
  // Gemini wants the conversation to start with the user, so drop the leading assistant greeting.
  const first = history.findIndex((m) => m.role === "user");
  const contents: Content[] = history.slice(Math.max(first, 0)).map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));
  const aw = opts.awaiting ?? null;
  const ctx: Ctx = { pending: null, checkout: false, systemError: false, lang: aw?.language ?? "en", awaiting: aw };
  // The UI tells us what is on screen so the model never claims something was paid when it was not
  const awaitingNote = aw
    ? `\n\nCURRENT STATE: A quote of $${aw.amountUsd} for ${aw.recipient} is on screen. The recipient details ${aw.detailsConfirmed ? "ARE confirmed" : "are NOT confirmed yet"}. Nothing has been paid or sent yet.`
    : "";
  // If a tool crashed, replace the model's reply with an honest message (the model sometimes ignores tool errors)
  const finish = (reply: string) => ({
    reply: ctx.systemError && !ctx.pending && !ctx.checkout ? (TECH_TROUBLE[ctx.lang] ?? TECH_TROUBLE.en) : reply,
    pending: ctx.pending,
    checkout: ctx.checkout,
  });
  let models = MODELS;

  for (let i = 0; i < 6; i++) {
    const { res, model } = await generate(
      { contents, config: { systemInstruction: SYSTEM + awaitingNote, tools: [{ functionDeclarations: declarations }], thinkingConfig: { thinkingLevel: ThinkingLevel.LOW } } },
      models
    );
    models = [model]; // stay on the model that worked for the rest of this turn
    const calls = res.functionCalls ?? [];
    if (!calls.length) {
      return finish((res.text ?? "").trim() || "Sorry, I didn't catch that. Could you say it again?");
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
  return finish("Sorry, I couldn't finish that. Please try again.");
}