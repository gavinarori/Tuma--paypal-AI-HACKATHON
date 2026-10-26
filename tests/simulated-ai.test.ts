import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const h = vi.hoisted(() => ({ query: vi.fn(), generate: vi.fn(), runAgent: vi.fn(), saveTurn: vi.fn(), getReceipt: vi.fn() }));
vi.mock("@/lib/db", () => ({ pool: { query: h.query } }));
vi.mock("@/lib/gemini", () => ({ generate: h.generate, MODELS: ["m"] }));
vi.mock("@/lib/agent", () => ({ runAgent: h.runAgent }));
vi.mock("@/lib/receipt", async (orig) => ({ ...(await orig<typeof import("@/lib/receipt")>()), getReceipt: h.getReceipt }));
vi.mock("@/lib/conversations", async (orig) => ({ ...(await orig<typeof import("@/lib/conversations")>()), saveTurn: h.saveTurn }));
import { simulateAgent, parseAmount, detectLang } from "@/lib/agent-sim";
import { simReceipt } from "@/lib/sim-text";
import { POST as chat } from "@/app/api/chat/route";
import { POST as transcribe } from "@/app/api/transcribe/route";

const DB = [{ name: "mama", paypal_email: "mama@sim.test", country: "KE" }, { name: "baba", paypal_email: "REPLACE-WITH-SANDBOX-PERSONAL-EMAIL", country: "KE" }];
const say = (t: string, awaiting = null as never) => simulateAgent([{ role: "user", content: t }], { awaiting });
const shown = { recipient: "mama", amountUsd: 50, purpose: "rent", language: "sw", country: "KE" };

beforeEach(() => {
  Object.values(h).forEach((m) => m.mockReset());
  h.query.mockResolvedValue({ rows: DB });
  h.saveTurn.mockResolvedValue("C1");
});
afterEach(() => { vi.unstubAllEnvs(); });

describe("parseAmount", () => {
  it.each([["send $50", 50], ["50 dollars", 50], ["12.5", 12.5], ["12,50", 12.5], ["fifty dollars", 50], ["twenty five dollars", 25], ["ishirini na tano", 25], ["hamsini", 50], ["quarante dollars", 40], ["vingt-cinq dollars", 25], ["a hundred dollars", 100], ["mia dola", 100]])("%j -> %s", (text, n) => {
    expect(parseAmount(text)).toBe(n);
  });
  it.each(["hello there", "no one knows", "tuma kwa mama", ""])("%j -> null", (text) => expect(parseAmount(text)).toBeNull());
});

describe("detectLang", () => {
  it.each([["Tuma dola hamsini kwa mama", "sw"], ["Envoie quarante dollars à maman", "fr"], ["Abeg send mama money", "pcm"], ["Send $50 to mama", "en"]])("%j -> %s", (t, l) => expect(detectLang(t)).toBe(l));
  it("keeps the language of the quote on screen for a bare 'yes'", () => expect(detectLang("yes", "fr")).toBe("fr"));
});

describe("simulated agent", () => {
  it.each([
    ["Send $50 to mama for rent", "en", "prepared", "rent"],
    ["Tuma dola hamsini kwa mama kwa kodi", "sw", "Nimeandaa", "kodi"],
    ["Envoie quarante dollars à maman pour le loyer", "fr", "préparé", "le loyer"],
    ["Abeg send mama twenty five dollars for rent", "pcm", "don prepare", "rent"],
  ])("prepares a quote for %j", async (text, lang, word, purpose) => {
    const out = await say(text);
    expect(out.reply).toContain(word);
    expect(out.checkout).toBe(false);
    expect(out.pending).toMatchObject({ recipientName: "mama", recipientEmail: "mama@sim.test", language: lang, purpose });
  });

  it("computes the quote with the real fee rules", async () => {
    expect((await say("Send $50 to mama")).pending).toMatchObject({ amountUsd: 50, quote: { totalUsdCents: 5105, payoutLocalAmount: 6450 } });
  });

  it("leaves the email blank for a new recipient or a placeholder, so the form asks for it", async () => {
    expect((await say("Send $30 to shosho")).pending).toMatchObject({ recipientName: "shosho", recipientEmail: "" });
    expect((await say("Send $30 to baba")).pending).toMatchObject({ recipientName: "baba", recipientEmail: "" });
  });

  it("asks for what is missing", async () => {
    expect((await say("Send money to mama")).reply).toContain("How much");
    expect((await say("Send $20")).reply).toContain("Who");
    expect((await say("hello")).reply).toContain("Tell me who");
    expect((await say("Tuma kwa mama")).reply).toContain("kiasi gani");
  });

  it("refuses amounts outside $1 to $1,000 with a normal reply", async () => {
    const out = await say("Send $5000 to mama");
    expect(out.pending).toBeNull();
    expect(out.reply).toContain("$1,000");
  });

  it("only starts checkout when a quote is on screen AND the details are confirmed", async () => {
    expect(await say("yes", { ...shown, detailsConfirmed: true } as never)).toMatchObject({ checkout: true, reply: expect.stringContaining("PayPal") });
    const early = await say("ndiyo", { ...shown, detailsConfirmed: false } as never);
    expect(early.checkout).toBe(false);
    expect(early.reply).toContain("Endelea");
    expect((await say("yes")).checkout).toBe(false); // nothing on screen
  });

  it("fills in an email typed in chat while a quote is on screen", async () => {
    const out = await say("it is nobody-123@example.com", shown as never);
    expect(out.pending).toMatchObject({ recipientName: "mama", recipientEmail: "nobody-123@example.com", amountUsd: 50, quote: { totalUsdCents: 5105 } });
  });

  it("reports status and receipts from the latest transfer", async () => {
    h.query.mockResolvedValueOnce({ rows: [] });
    expect((await say("where is my money?")).reply).toContain("couldn't find");
    h.query.mockResolvedValueOnce({ rows: [{ id: "T1", recipient_name: "mama", status: "payout_pending" }] });
    expect((await say("where is my money?")).reply).toContain("payout_pending");
    h.query.mockResolvedValueOnce({ rows: [{ id: "T1", recipient_name: "mama", status: "delivered" }] });
    h.getReceipt.mockResolvedValue("Done! mama received $50.00.");
    expect((await say("produce the receipt")).reply).toBe("Done! mama received $50.00.");
  });
});

describe("SIMULATE_AI switches", () => {
  it("chat route uses the simulated agent and never calls Gemini's agent", async () => {
    vi.stubEnv("SIMULATE_AI", "true");
    const res = await chat(new Request("http://x/api/chat", { method: "POST", body: JSON.stringify({ messages: [{ role: "user", content: "Tuma dola hamsini kwa mama" }] }) }));
    const d = await res.json();
    expect(d.pending).toMatchObject({ language: "sw", amountUsd: 50 });
    expect(d.conversationId).toBe("C1");
    expect(h.runAgent).not.toHaveBeenCalled();
  });

  it("chat route still uses the real agent when SIMULATE_AI is off", async () => {
    vi.stubEnv("SIMULATE_AI", "");
    h.runAgent.mockResolvedValue({ reply: "real", pending: null, checkout: false });
    const res = await chat(new Request("http://x/api/chat", { method: "POST", body: JSON.stringify({ messages: [{ role: "user", content: "hi" }] }) }));
    expect((await res.json()).reply).toBe("real");
  });

  it("voice returns the demo phrases in turn without calling Gemini", async () => {
    vi.stubEnv("SIMULATE_AI", "true");
    const rec = () => transcribe(new Request("http://x", { method: "POST", headers: { "Content-Type": "audio/wav" }, body: new Uint8Array(2000) })).then((r) => r.json());
    const got = [await rec(), await rec(), await rec(), await rec()];
    expect(got.map((g) => g.language).sort()).toEqual(["en", "fr", "pcm", "sw"]);
    expect(got.every((g) => g.simulated && g.text)).toBe(true);
    expect(h.generate).not.toHaveBeenCalled();
  });

  it("receipts use the simulated text in the sender's language without calling Gemini", async () => {
    vi.stubEnv("SIMULATE_AI", "true");
    const { getReceipt } = await vi.importActual<typeof import("@/lib/receipt")>("@/lib/receipt");
    h.query.mockImplementation(async (sql: string) => {
      if (sql.startsWith("SELECT * FROM transfers")) return { rows: [{ id: "T1", status: "delivered", recipient_name: "mama", amount_usd_cents: 5000, fee_usd_cents: 105, payout_local_amount: "6450", language: "sw", receipt_text: null }] };
      return { rows: [] };
    });
    expect(await getReceipt("T1")).toBe("Imekamilika! mama amepokea $50.00 kwenye akaunti yake ya PayPal. Ulilipa $51.05 pamoja na ada.");
    expect(h.generate).not.toHaveBeenCalled();
  });
});

describe("simReceipt", () => {
  it("covers delivered, refunded and not refunded in each language", () => {
    for (const lang of ["en", "sw", "fr", "pcm"] as const) {
      expect(simReceipt(lang, { outcome: "delivered", recipient: "mama", amount_usd: 50, total_paid_usd: 51.05 })).toContain("50.00");
      expect(simReceipt(lang, { outcome: "failed", recipient: "mama", total_paid_usd: 51.05, refunded: true })).toContain("51.05");
      expect(simReceipt(lang, { outcome: "failed", recipient: "mama", total_paid_usd: 51.05, refunded: false })).toContain("mama");
    }
  });
});
