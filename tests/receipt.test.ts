import { describe, it, expect, vi, beforeEach } from "vitest";

const h = vi.hoisted(() => ({ query: vi.fn(), generate: vi.fn() }));
vi.mock("@/lib/db", () => ({ pool: { query: h.query } }));
vi.mock("@/lib/gemini", () => ({ generate: h.generate }));
import { getReceipt } from "@/lib/receipt";

const base = {
  id: "T1", status: "delivered", recipient_name: "mama", amount_usd_cents: 5000, fee_usd_cents: 105,
  payout_local_amount: "6450.00", language: "sw", receipt_text: null as string | null,
};
function db(t: Record<string, unknown> | null, failedDetail?: unknown) {
  h.query.mockImplementation(async (sql: string) => {
    if (sql.startsWith("SELECT * FROM transfers")) return { rows: t ? [t] : [] };
    if (sql.startsWith("SELECT detail")) return { rows: failedDetail ? [{ detail: failedDetail }] : [] };
    return { rows: [] };
  });
}
const saved = () => h.query.mock.calls.find(([sql]) => String(sql).startsWith("UPDATE transfers SET receipt_text"))?.[1];

beforeEach(() => {
  h.query.mockReset(); h.generate.mockReset();
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("getReceipt", () => {
  it.each([["missing", null], ["draft", { ...base, status: "draft" }], ["paid", { ...base, status: "paid" }], ["payout_pending", { ...base, status: "payout_pending" }]])(
    "returns null while the transfer is %s", async (_, t) => {
      db(t);
      expect(await getReceipt("T1")).toBeNull();
      expect(h.generate).not.toHaveBeenCalled();
    });

  it("returns the cached receipt without calling the model again", async () => {
    db({ ...base, receipt_text: "Asante, imefika." });
    expect(await getReceipt("T1")).toBe("Asante, imefika.");
    expect(h.generate).not.toHaveBeenCalled();
    expect(saved()).toBeUndefined();
  });

  it("writes a delivered receipt in the sender's language from facts only, then caches it", async () => {
    db(base);
    h.generate.mockResolvedValue({ res: { text: "  Mama amepokea $50. Asante!  " }, model: "m1" });
    expect(await getReceipt("T1")).toBe("Mama amepokea $50. Asante!");
    const req = h.generate.mock.calls[0][0];
    expect(req.config.systemInstruction).toContain("Swahili");
    expect(JSON.parse(req.contents[0].parts[0].text)).toEqual({
      outcome: "delivered", recipient: "mama", amount_usd: 50, fee_usd: 1.05, total_paid_usd: 51.05, indicative_kes: 6450,
    });
    expect(saved()).toEqual(["T1", "Mama amepokea $50. Asante!"]);
  });

  it.each([["fr", "French"], ["pcm", "Nigerian Pidgin"], ["en", "English"], ["xx", "English"]])("uses the right language name for %s", async (language, name) => {
    db({ ...base, language });
    h.generate.mockResolvedValue({ res: { text: "ok" }, model: "m1" });
    await getReceipt("T1");
    expect(h.generate.mock.calls[0][0].config.systemInstruction).toContain(name);
  });

  it("falls back to a plain English receipt when the model fails, and still caches it", async () => {
    db(base);
    h.generate.mockRejectedValue(new Error("quota"));
    const text = await getReceipt("T1");
    expect(text).toBe("Delivered: mama received $50.00 in their PayPal account. You paid $51.05 including fees.");
    expect(saved()).toEqual(["T1", text]);
  });

  it("falls back when the model returns empty text", async () => {
    db(base);
    h.generate.mockResolvedValue({ res: { text: " " }, model: "m1" });
    expect(await getReceipt("T1")).toMatch(/^Delivered: mama received/);
  });

  it("tells the sender the money was refunded when a transfer failed and the refund went through", async () => {
    db({ ...base, status: "failed" }, { reason: "payout_rejected", refunded: true });
    h.generate.mockRejectedValue(new Error("quota"));
    const text = await getReceipt("T1");
    expect(text).toContain("could not be completed");
    expect(text).toContain("$51.05 was refunded");
  });

  it("asks the sender to contact support when a failed transfer could not be refunded", async () => {
    db({ ...base, status: "failed" }, { reason: "payout_rejected", refunded: false });
    h.generate.mockRejectedValue(new Error("quota"));
    expect(await getReceipt("T1")).toContain("contact support");
  });

  it("gives the model the refund outcome for failed transfers", async () => {
    db({ ...base, status: "failed" }, { refunded: true });
    h.generate.mockResolvedValue({ res: { text: "Pole, pesa zimerudishwa." }, model: "m1" });
    await getReceipt("T1");
    expect(JSON.parse(h.generate.mock.calls[0][0].contents[0].parts[0].text)).toEqual({ outcome: "failed", recipient: "mama", total_paid_usd: 51.05, refunded: true });
  });
});

describe("getReceipt: recording the transaction in the chat history", () => {
  const inChat = { ...base, conversation_id: "C9" };
  const inserted = () => h.query.mock.calls.find(([sql]) => String(sql).startsWith("INSERT INTO messages"));

  it("adds the receipt and reference to the conversation once, when it is first generated", async () => {
    db(inChat);
    h.generate.mockResolvedValue({ res: { text: "Mama amepokea $50." }, model: "m1" });
    await getReceipt("abcdef12-3456", { record: true });
    expect(inserted()?.[1]).toEqual(["C9", "Mama amepokea $50.\n\nReference: ABCDEF12"]);
    expect(h.query.mock.calls.some(([sql]) => String(sql).startsWith("UPDATE conversations SET updated_at"))).toBe(true);
  });

  it("does not record again when the receipt is already cached", async () => {
    db({ ...inChat, receipt_text: "Cached receipt" });
    await getReceipt("T1", { record: true });
    expect(inserted()).toBeUndefined();
  });

  it("does not record when asked not to (the agent's get_receipt tool) or when the transfer has no conversation", async () => {
    db(inChat);
    h.generate.mockResolvedValue({ res: { text: "ok" }, model: "m1" });
    await getReceipt("T1");
    expect(inserted()).toBeUndefined();
    db(base);
    await getReceipt("T1", { record: true });
    expect(inserted()).toBeUndefined();
  });

  it("still returns the receipt if saving it to the chat fails", async () => {
    h.query.mockImplementation(async (sql: string) => {
      if (sql.startsWith("SELECT * FROM transfers")) return { rows: [inChat] };
      if (sql.startsWith("INSERT INTO messages")) throw new Error("db down");
      return { rows: [] };
    });
    h.generate.mockResolvedValue({ res: { text: "Asante" }, model: "m1" });
    expect(await getReceipt("T1", { record: true })).toBe("Asante");
  });
});