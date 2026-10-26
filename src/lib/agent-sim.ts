import { pool } from "./db";
import { getQuote } from "./quote";
import { getReceipt } from "./receipt";
import { TEXT, simLang, type SimLang } from "./sim-text";

/**
 * A rule-based stand-in for the Gemini agent (SIMULATE_AI=true), so the whole app can be demoed with no API key or quota.
 * It understands the demo phrases in English, Swahili, French and Pidgin: amounts as digits or as words up to 99
 * (fifty, hamsini, quarante, twenty five, ishirini na tano), known recipients, confirmations, receipts and status questions.
 */
type Awaiting = { recipient: string; amountUsd: number; detailsConfirmed?: boolean; purpose?: string | null; language?: string; country?: string } | null;
type Reply = { reply: string; pending: Record<string, unknown> | null; checkout: boolean };
type Recipient = { name: string; paypal_email: string | null; country: string };

const CONFIRM = /^\s*(yes|yeah|yep|ok(ay)?|confirm(ed)?|go ahead|sure|proceed|they are okay|i have reviewed( it)?|ndiyo|sawa|haya|endelea|thibitisha|oui|d['’]accord|vas-y|confirme|e dey okay|i don confirm)\b/i;
const STATUS = /(where is my money|status|receipt|risiti|reçu|recu|pesa yangu|wapi|où est|ou est|produce|show me)/i;
const EMAIL = /[^\s@]+@[^\s@]+\.[^\s@]+/;
const CURRENCY = /^(dollars?|usd|dola|dollar|dolla)$/;
const STOP = new Set(["my", "the", "a", "an", "mama", "me", "him", "her", "them", "you", "us"]);

const UNITS: Record<string, number> = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, moja: 1, mbili: 2, tatu: 3, nne: 4, tano: 5, sita: 6, saba: 7, nane: 8, tisa: 9, un: 1, deux: 2, trois: 3, quatre: 4, cinq: 5, sept: 7, huit: 8, neuf: 9 };
const TENS: Record<string, number> = { ten: 10, twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90, kumi: 10, ishirini: 20, thelathini: 30, arobaini: 40, hamsini: 50, sitini: 60, sabini: 70, themanini: 80, tisini: 90, dix: 10, vingt: 20, trente: 30, quarante: 40, cinquante: 50, soixante: 60 };
const HUNDRED = new Set(["hundred", "mia", "cent"]);
const JOIN = new Set(["and", "na", "et"]);

export function detectLang(text: string, fallback?: string): SimLang {
  const t = text.toLowerCase();
  if (/\b(tuma|tumia|kwa|dola|hamsini|ishirini|thelathini|arobaini|asante|habari|nataka|pesa|ndiyo|sawa|wapi|risiti|kodi|endelea)\b/.test(t)) return "sw";
  if (/(\b(envoie|envoyer|maman|merci|bonjour|voudrais|combien|oui|reçu|vingt|trente|quarante|cinquante)\b|à |\bpour\b)/.test(t)) return "fr";
  if (/\b(abeg|dey|wetin|wahala|sef|sabi|oga|i don)\b/.test(t)) return "pcm";
  return /^\s*(yes|ok|okay|confirm)/i.test(t) || !t.trim() ? simLang(fallback) : "en";
}

export function parseAmount(text: string): number | null {
  const digits = text.match(/(\d+(?:[.,]\d{1,2})?)/);
  if (digits) return Number(digits[1].replace(",", "."));
  const words = text.toLowerCase().split(/[^\p{L}]+/u).filter(Boolean);
  for (let i = 0; i < words.length; i++) {
    if (!(words[i] in TENS) && !HUNDRED.has(words[i]) && !(words[i] in UNITS)) continue;
    let j = i, value = 0, strong = false;
    for (; j < words.length; j++) {
      const w = words[j];
      if (w in TENS) { value += TENS[w]; strong = true; }
      else if (HUNDRED.has(w)) { value = (value || 1) * 100; strong = true; }
      else if (w in UNITS) value += UNITS[w];
      else if (!(JOIN.has(w) && j + 1 < words.length && (words[j + 1] in UNITS || words[j + 1] in TENS))) break;
    }
    if (strong || CURRENCY.test(words[j] ?? "")) return value;
    i = j;
  }
  return null;
}

async function recipients(): Promise<Recipient[]> {
  return (await pool.query("SELECT name, paypal_email, country FROM recipients WHERE owner = 'demo'")).rows;
}

function findRecipient(text: string, all: Recipient[]): { name: string; known: Recipient | null } | null {
  const lower = text.toLowerCase();
  for (const r of all) {
    const n = r.name.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    if (new RegExp(`(^|[^\\p{L}])${n}($|[^\\p{L}])`, "u").test(lower)) return { name: r.name, known: r };
  }
  if (/\b(maman|mum|mom|mother|mama yangu)\b/.test(lower)) {
    const mama = all.find((r) => r.name.toLowerCase() === "mama");
    if (mama) return { name: mama.name, known: mama };
  }
  const m = lower.match(/(?:\bto|\bkwa|à|\bpour|\bgive)\s+([\p{L}]+)/u);
  return m && !STOP.has(m[1]) ? { name: m[1], known: null } : null;
}

const usable = (e: string | null | undefined) => (e && !e.startsWith("REPLACE") ? e : "");

export async function simulateAgent(history: { role: string; content: string }[], opts: { awaiting?: Awaiting } = {}): Promise<Reply> {
  const last = [...history].reverse().find((m) => m.role === "user")?.content ?? "";
  const aw = opts.awaiting ?? null;
  const lang = detectLang(last, aw?.language);
  const reply = (text: string, pending: Record<string, unknown> | null = null, checkout = false): Reply => ({ reply: text, pending, checkout });

  if (aw && CONFIRM.test(last)) return aw.detailsConfirmed ? reply(TEXT.tapPaypal[lang], null, true) : reply(TEXT.checkForm[lang]);

  if (aw && EMAIL.test(last)) {
    const q = getQuote(Math.round(aw.amountUsd * 100), aw.country ?? "KE");
    return reply(TEXT.checkForm[lang], { senderName: "Demo Sender", recipientName: aw.recipient, recipientEmail: last.match(EMAIL)![0], country: aw.country ?? "KE", purpose: aw.purpose ?? null, language: aw.language ?? lang, amountUsd: aw.amountUsd, quote: q });
  }

  if (STATUS.test(last)) {
    const r = await pool.query("SELECT id, recipient_name, status FROM transfers ORDER BY created_at DESC LIMIT 1");
    const t = r.rows[0];
    if (!t) return reply(TEXT.noTransfer[lang]);
    if (["delivered", "failed"].includes(t.status)) return reply((await getReceipt(t.id)) ?? TEXT.status[lang](t.recipient_name, t.status));
    return reply(TEXT.status[lang](t.recipient_name, t.status));
  }

  const amount = parseAmount(last);
  const who = findRecipient(last, await recipients());
  if (amount == null && !who) return reply(TEXT.greet[lang]);
  if (amount == null) return reply(TEXT.askAmount[lang](who!.name));
  if (!who) return reply(TEXT.askWho[lang]);

  let quote;
  try { quote = getQuote(Math.round(amount * 100), who.known?.country ?? "KE"); } catch { return reply(TEXT.limit[lang]); }
  // "for rent", "kwa ajili ya kodi", "pour le loyer", or Swahili "kwa mama kwa kodi" (the second "kwa")
  const purpose = (last.match(/(?:\bfor|kwa ajili ya|\bpour)\s+(.{2,40})$/i) ?? last.match(/\bkwa\s+\S+.*\bkwa\s+(.{2,40})$/i))?.[1]?.replace(/[.!?]+$/, "") ?? null;
  return reply(TEXT.quote[lang](who.name, amount), {
    senderName: "Demo Sender", recipientName: who.name, recipientEmail: usable(who.known?.paypal_email), country: who.known?.country ?? "KE",
    purpose, language: lang, amountUsd: amount, quote,
  });
}