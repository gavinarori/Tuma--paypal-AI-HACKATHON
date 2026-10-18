import { describe, it, expect, vi, beforeEach } from "vitest";

const h = vi.hoisted(() => ({ query: vi.fn(), generate: vi.fn(), getReceipt: vi.fn() }));
vi.mock("@/lib/db", () => ({ pool: { query: h.query } }));
vi.mock("@/lib/gemini", () => ({ generate: h.generate, MODELS: ["m1", "m2"] }));
vi.mock("@/lib/receipt", () => ({ getReceipt: h.getReceipt }));
import { runAgent } from "@/lib/agent";

const text = (t: string, model = "m1") => ({ res: { functionCalls: [], text: t }, model });
const call = (name: string, args: Record<string, unknown>, model = "m1") => ({
  res: { functionCalls: [{ name, args }], text: "", candidates: [{ content: { role: "model", parts: [{ functionCall: { name, args } }] } }] },
  model,
});
const mama = { name: "mama", paypal_email: "mama@example.com", country: "KE" };
const ask = (t = "Tuma $50 kwa mama") => runAgent([{ role: "assistant", content: "Hi!" }, { role: "user", content: t }]);
const toolReplyFor = (callIndex: number) => JSON.stringify(h.generate.mock.calls[callIndex][0].contents.at(-1));

beforeEach(() => { h.query.mockReset(); h.generate.mockReset(); h.getReceipt.mockReset(); });

describe("runAgent: conversation handling", () => {
  it("returns the model's reply when no tool is needed", async () => {
    h.generate.mockResolvedValueOnce(text("Habari! Unataka kutuma pesa kwa nani?"));
    expect(await ask("Habari")).toEqual({ reply: "Habari! Unataka kutuma pesa kwa nani?", pending: null });
  });

  it("drops the leading assistant greeting so the conversation starts with the user", async () => {
    h.generate.mockResolvedValueOnce(text("ok"));
    await ask();
    const contents = h.generate.mock.calls[0][0].contents;
    expect(contents[0]).toMatchObject({ role: "user" });
    expect(contents).toHaveLength(1);
  });

  it("maps assistant messages to the 'model' role", async () => {
    h.generate.mockResolvedValueOnce(text("ok"));
    await runAgent([{ role: "user", content: "a" }, { role: "assistant", content: "b" }, { role: "user", content: "c" }]);
    expect(h.generate.mock.calls[0][0].contents.map((c: { role: string }) => c.role)).toEqual(["user", "model", "user"]);
  });

  it("falls back to a friendly message when the model returns empty text", async () => {
    h.generate.mockResolvedValueOnce(text("   "));
    expect((await ask()).reply).toBe("Sorry, I didn't catch that. Could you say it again?");
  });

  it("stays on the model that worked for the rest of the turn", async () => {
    h.query.mockResolvedValue({ rows: [mama], rowCount: 1 });
    h.generate.mockResolvedValueOnce(call("find_recipient", { name: "mama" }, "m2")).mockResolvedValueOnce(text("ok", "m2"));
    await ask();
    expect(h.generate.mock.calls[0][1]).toEqual(["m1", "m2"]);
    expect(h.generate.mock.calls[1][1]).toEqual(["m2"]);
  });

  it("gives up with an apology after 6 tool rounds instead of looping forever", async () => {
    h.query.mockResolvedValue({ rows: [], rowCount: 0 });
    h.generate.mockResolvedValue(call("find_recipient", { name: "x" }));
    const out = await ask();
    expect(h.generate).toHaveBeenCalledTimes(6);
    expect(out.reply).toMatch(/couldn't finish/);
    expect(out.pending).toBeNull();
  });
});

describe("runAgent: prepare_quote", () => {
  it("prepares a quote from the address book and never moves money", async () => {
    h.query.mockResolvedValue({ rows: [mama], rowCount: 1 });
    h.generate
      .mockResolvedValueOnce(call("prepare_quote", { recipient_name: "mama", amount_usd: 50, purpose: "rent", language: "sw" }))
      .mockResolvedValueOnce(text("Tafadhali thibitisha."));
    const out = await ask();
    expect(out.reply).toBe("Tafadhali thibitisha.");
    expect(out.pending).toMatchObject({
      recipientName: "mama", recipientEmail: "mama@example.com", country: "KE",
      amountUsd: 50, purpose: "rent", language: "sw",
      quote: { amountUsdCents: 5000, feeUsdCents: 105, totalUsdCents: 5105, payoutLocalAmount: 6450 },
    });
    // every query was a read (SELECT); the agent cannot write transfers
    expect(h.query.mock.calls.every(([sql]) => String(sql).startsWith("SELECT"))).toBe(true);
  });

  it("feeds only computed numbers back to the model, never the recipient's email", async () => {
    h.query.mockResolvedValue({ rows: [mama], rowCount: 1 });
    h.generate.mockResolvedValueOnce(call("prepare_quote", { recipient_name: "mama", amount_usd: 50, language: "en" })).mockResolvedValueOnce(text("ok"));
    await ask();
    const back = toolReplyFor(1);
    expect(back).toContain("6450");
    expect(back).toContain("51.05");
    expect(back).not.toContain("mama@example.com");
  });

  it("prepares the quote for a new recipient and lets the on-screen form collect the email", async () => {
    h.query.mockResolvedValue({ rows: [], rowCount: 0 });
    h.generate.mockResolvedValueOnce(call("prepare_quote", { recipient_name: "shosho", amount_usd: 20, language: "en" })).mockResolvedValueOnce(text("Please fill in the details."));
    const out = await ask();
    expect(out.pending).toMatchObject({ recipientName: "shosho", recipientEmail: "", country: "KE", amountUsd: 20, quote: { totalUsdCents: 2060 } });
    expect(toolReplyFor(1)).toContain('"details_needed":true');
    expect(toolReplyFor(1)).toContain("Do not ask for the email in chat");
  });

  it("treats a placeholder email as missing so the form asks for the real one", async () => {
    h.query.mockResolvedValue({ rows: [{ ...mama, paypal_email: "REPLACE-WITH-SANDBOX-PERSONAL-EMAIL" }], rowCount: 1 });
    h.generate.mockResolvedValueOnce(call("prepare_quote", { recipient_name: "mama", amount_usd: 20, language: "en" })).mockResolvedValueOnce(text("ok"));
    const out = await ask();
    expect(out.pending).toMatchObject({ recipientName: "mama", recipientEmail: "" });
    expect(toolReplyFor(1)).toContain('"details_needed":true');
  });

  it.each([5000, 0.5, -10])("rejects an out-of-range amount of $%s", async (amount) => {
    h.query.mockResolvedValue({ rows: [mama], rowCount: 1 });
    h.generate.mockResolvedValueOnce(call("prepare_quote", { recipient_name: "mama", amount_usd: amount, language: "en" })).mockResolvedValueOnce(text("ok"));
    const out = await ask();
    expect(out.pending).toBeNull();
    expect(toolReplyFor(1)).toContain("between $1 and $1,000");
  });
});

describe("runAgent: recipients", () => {
  it.each([["Maman"], ["mum"], ["Mother"], ["mama"]])("finds a recipient saved as 'mama' when the user says %s", async (name) => {
    h.query.mockResolvedValue({ rows: [mama], rowCount: 1 });
    h.generate.mockResolvedValueOnce(call("find_recipient", { name })).mockResolvedValueOnce(text("ok"));
    await ask();
    expect(h.query.mock.calls[0][1][1]).toEqual(expect.arrayContaining(["mama", "maman", "mum"]));
  });

  it("searches only the typed name for words outside the nickname groups", async () => {
    h.query.mockResolvedValue({ rows: [], rowCount: 0 });
    h.generate.mockResolvedValueOnce(call("find_recipient", { name: "  Shosho " })).mockResolvedValueOnce(text("ok"));
    await ask();
    expect(h.query.mock.calls[0][1]).toEqual(["demo", ["shosho"]]);
  });

  it("does not leak the saved email when looking a recipient up", async () => {
    h.query.mockResolvedValue({ rows: [mama], rowCount: 1 });
    h.generate.mockResolvedValueOnce(call("find_recipient", { name: "mama" })).mockResolvedValueOnce(text("ok"));
    await ask();
    expect(toolReplyFor(1)).not.toContain("mama@example.com");
    expect(toolReplyFor(1)).toContain("has_paypal_email");
  });

  it("saves a valid recipient with a normalised name", async () => {
    h.query.mockResolvedValue({ rows: [], rowCount: 1 });
    h.generate.mockResolvedValueOnce(call("save_recipient", { name: "Maman", email: " maman@example.com " })).mockResolvedValueOnce(text("Saved"));
    await ask("Envoie 40 dollars à maman");
    const [sql, vals] = h.query.mock.calls[0];
    expect(String(sql)).toContain("INSERT INTO recipients");
    expect(vals).toEqual(["demo", "maman", "maman@example.com", "KE"]);
  });

  it.each(["bad", "a@b", "two words@x.com", ""])("refuses to save the invalid email %j", async (email) => {
    h.generate.mockResolvedValueOnce(call("save_recipient", { name: "mama", email })).mockResolvedValueOnce(text("ok"));
    await ask();
    expect(h.query).not.toHaveBeenCalled();
    expect(toolReplyFor(1)).toContain("valid email");
  });
});

describe("runAgent: other tools", () => {
  it("reports the status and timeline of the latest transfer", async () => {
    h.query
      .mockResolvedValueOnce({ rowCount: 1, rows: [{ id: "T1", recipient_name: "mama", status: "payout_pending", amount_usd_cents: 5000 }] })
      .mockResolvedValueOnce({ rows: [{ to_status: "awaiting_payment" }, { to_status: "paid" }, { to_status: "payout_pending" }] });
    h.generate.mockResolvedValueOnce(call("get_transfer_status", {})).mockResolvedValueOnce(text("Inakuja"));
    await ask("Pesa yangu iko wapi?");
    const back = toolReplyFor(1);
    expect(back).toContain("payout_pending");
    expect(back).toContain("\"amount_usd\":50");
  });

  it("says nothing was found when there are no transfers", async () => {
    h.query.mockResolvedValue({ rowCount: 0, rows: [] });
    h.generate.mockResolvedValueOnce(call("get_transfer_status", {})).mockResolvedValueOnce(text("ok"));
    await ask("where is my money");
    expect(toolReplyFor(1)).toContain("\"found\":false");
  });

  it("answers unknown tool calls with an error instead of crashing", async () => {
    h.generate.mockResolvedValueOnce(call("send_money_now", { amount: 1000 })).mockResolvedValueOnce(text("ok"));
    const out = await ask();
    expect(out.pending).toBeNull();
    expect(toolReplyFor(1)).toContain("Unknown tool");
  });

  it("turns database errors inside a tool into a tool error the model can see", async () => {
    h.query.mockRejectedValue(new Error("db down"));
    h.generate.mockResolvedValueOnce(call("find_recipient", { name: "mama" })).mockResolvedValueOnce(text("Sorry"));
    const out = await ask();
    expect(out.reply).toBe("Sorry");
    expect(toolReplyFor(1)).toContain("db down");
  });
});

describe("runAgent: receipts and the confirmation guard", () => {
  it("returns the receipt of a finished transfer", async () => {
    h.query.mockResolvedValue({ rowCount: 1, rows: [{ id: "abcdef12-0000", status: "delivered" }] });
    h.getReceipt.mockResolvedValue("Mama received $50.00.");
    h.generate.mockResolvedValueOnce(call("get_receipt", {})).mockResolvedValueOnce(text("ok"));
    await ask("produce the receipt");
    expect(h.getReceipt).toHaveBeenCalledWith("abcdef12-0000");
    expect(toolReplyFor(1)).toContain("Mama received $50.00.");
    expect(toolReplyFor(1)).toContain("ABCDEF12");
  });

  it("does not produce a receipt while the transfer is unfinished", async () => {
    h.query.mockResolvedValue({ rowCount: 1, rows: [{ id: "T1", status: "payout_pending" }] });
    h.generate.mockResolvedValueOnce(call("get_receipt", {})).mockResolvedValueOnce(text("ok"));
    await ask("receipt please");
    expect(h.getReceipt).not.toHaveBeenCalled();
    expect(toolReplyFor(1)).toContain("isn't finished");
    expect(toolReplyFor(1)).toContain("payout_pending");
  });

  it("reports that nothing was found when there are no transfers", async () => {
    h.query.mockResolvedValue({ rowCount: 0, rows: [] });
    h.generate.mockResolvedValueOnce(call("get_receipt", {})).mockResolvedValueOnce(text("ok"));
    await ask("receipt please");
    expect(toolReplyFor(1)).toContain('"found":false');
  });

  it("tells the model a quote is waiting when the UI says so (so it never claims the transfer is processing)", async () => {
    h.generate.mockResolvedValueOnce(text("Press Confirm and pay on the card."));
    await runAgent([{ role: "user", content: "i have reviewed it" }], { awaiting: { recipient: "mama", amountUsd: 50 } });
    const sys = h.generate.mock.calls[0][0].config.systemInstruction;
    expect(sys).toContain("CURRENT STATE");
    expect(sys).toContain("$50 for mama");
    expect(sys).toContain("Nothing has been paid or sent yet");
  });

  it("adds no state note when nothing is waiting", async () => {
    h.generate.mockResolvedValueOnce(text("ok"));
    await ask("hello");
    expect(h.generate.mock.calls[0][0].config.systemInstruction).not.toContain("CURRENT STATE");
  });

  it("always instructs the model that only the card button moves money", async () => {
    h.generate.mockResolvedValueOnce(text("ok"));
    await ask("hello");
    const sys = h.generate.mock.calls[0][0].config.systemInstruction;
    expect(sys).toContain('presses "Confirm and pay" on the card');
    expect(sys).toContain("do NOT say the transfer is processing or sent");
    expect(sys).toContain("do not ask for the email in chat");
  });
});