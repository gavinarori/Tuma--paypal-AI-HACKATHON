import { describe, it, expect, vi, beforeEach } from "vitest";

const h = vi.hoisted(() => ({ query: vi.fn() }));
vi.mock("@/lib/db", () => ({ pool: { query: h.query } }));
import { titleFrom, isUuid, saveTurn, listConversations, getConversation, deleteConversation, listTransfers } from "@/lib/conversations";
import { GET as listConvosRoute } from "@/app/api/conversations/route";
import { GET as getConvoRoute, DELETE as deleteConvoRoute } from "@/app/api/conversations/[id]/route";
import { GET as listTransfersRoute } from "@/app/api/transfers/route";

const ID = "7b0d0b0e-8c43-4b3a-9d0a-0a5c2f1f6a11";
const params = (id: string) => ({ params: Promise.resolve({ id }) });
const sqls = () => h.query.mock.calls.map(([sql]) => String(sql).trim().split(/\s+/).slice(0, 3).join(" "));

beforeEach(() => { h.query.mockReset(); });

describe("titleFrom / isUuid", () => {
  it("builds a short one-line title from the first message", () => {
    expect(titleFrom("  Send $50   to mama\nfor rent ")).toBe("Send $50 to mama for rent");
    expect(titleFrom("x".repeat(100))).toHaveLength(48);
    expect(titleFrom("x".repeat(100)).endsWith("…")).toBe(true);
    expect(titleFrom("   ")).toBe("New chat");
  });
  it("only accepts real UUIDs", () => {
    expect(isUuid(ID)).toBe(true);
    for (const bad of ["", "abc", `${ID}; DROP TABLE x`, 5, null, undefined]) expect(isUuid(bad)).toBe(false);
  });
});

describe("saveTurn", () => {
  it("creates a conversation titled after the first message, then stores the user message and reply in order", async () => {
    h.query.mockResolvedValueOnce({ rows: [{ id: ID }] }).mockResolvedValueOnce({ rows: [] });
    expect(await saveTurn(undefined, "Send $50 to mama for rent", "Here is your quote")).toBe(ID);
    expect(sqls()).toEqual(["INSERT INTO conversations", "INSERT INTO messages"]);
    expect(h.query.mock.calls[0][1]).toEqual(["demo", "Send $50 to mama for rent"]);
    expect(h.query.mock.calls[1][1]).toEqual([ID, "Send $50 to mama for rent", "Here is your quote"]);
    expect(String(h.query.mock.calls[1][0])).toMatch(/'user'.*'assistant'/s);
  });

  it("adds to an existing conversation without creating a new one", async () => {
    h.query.mockResolvedValueOnce({ rows: [{ id: ID }] }).mockResolvedValueOnce({ rows: [] });
    expect(await saveTurn(ID, "next", "reply")).toBe(ID);
    expect(sqls()).toEqual(["UPDATE conversations SET", "INSERT INTO messages"]);
  });

  it("starts a fresh conversation if the id no longer exists (e.g. it was deleted)", async () => {
    h.query.mockResolvedValueOnce({ rows: [] }).mockResolvedValueOnce({ rows: [{ id: "new-id" }] }).mockResolvedValueOnce({ rows: [] });
    expect(await saveTurn(ID, "hello", "hi")).toBe("new-id");
    expect(sqls()).toEqual(["UPDATE conversations SET", "INSERT INTO conversations", "INSERT INTO messages"]);
  });

  it("never sends an invalid id to the database", async () => {
    h.query.mockResolvedValueOnce({ rows: [{ id: ID }] }).mockResolvedValueOnce({ rows: [] });
    await saveTurn("bad-id'; --", "hello", "hi");
    expect(sqls()[0]).toBe("INSERT INTO conversations");
  });

  it("returns null (and logs) instead of breaking the chat when the database fails", async () => {
    const err = vi.spyOn(console, "error").mockImplementation(() => {});
    h.query.mockRejectedValue(new Error("db down"));
    expect(await saveTurn(undefined, "hello", "hi")).toBeNull();
    expect(err.mock.calls.flat().join(" ")).toContain("saving the conversation failed: db down");
  });
});

describe("reading and deleting history", () => {
  it("lists conversations newest first, for the demo owner only", async () => {
    h.query.mockResolvedValue({ rows: [{ id: ID, title: "Send $50", updated_at: "2026-10-18" }] });
    expect(await listConversations()).toHaveLength(1);
    expect(String(h.query.mock.calls[0][0])).toContain("ORDER BY updated_at DESC");
    expect(h.query.mock.calls[0][1]).toEqual(["demo"]);
  });

  it("loads a conversation with its messages (in order) and its transactions, without drafts", async () => {
    h.query
      .mockResolvedValueOnce({ rows: [{ id: ID, title: "t" }] })
      .mockResolvedValueOnce({ rows: [{ role: "user", content: "a" }, { role: "assistant", content: "b" }] })
      .mockResolvedValueOnce({ rows: [{ id: "T1", status: "delivered" }] });
    const d = await getConversation(ID);
    expect(d?.messages.map((m) => m.role)).toEqual(["user", "assistant"]);
    expect(d?.transfers).toHaveLength(1);
    expect(String(h.query.mock.calls[1][0])).toContain("ORDER BY id");
    expect(String(h.query.mock.calls[2][0])).toContain("status <> 'draft'");
  });

  it("returns null for unknown or malformed ids", async () => {
    expect(await getConversation("nope")).toBeNull();
    expect(h.query).not.toHaveBeenCalled();
    h.query.mockResolvedValueOnce({ rows: [] });
    expect(await getConversation(ID)).toBeNull();
  });

  it("deletes only the conversation row (transfers are unlinked by the database, not deleted)", async () => {
    h.query.mockResolvedValue({ rowCount: 1 });
    expect(await deleteConversation(ID)).toBe(true);
    expect(String(h.query.mock.calls[0][0])).toMatch(/^DELETE FROM conversations/);
    expect(h.query.mock.calls.every(([sql]) => !/transfers/i.test(String(sql)))).toBe(true);
    h.query.mockResolvedValue({ rowCount: 0 });
    expect(await deleteConversation(ID)).toBe(false);
    expect(await deleteConversation("bad")).toBe(false);
  });

  it("lists transactions newest first without drafts", async () => {
    h.query.mockResolvedValue({ rows: [{ id: "T1" }] });
    await listTransfers();
    const sql = String(h.query.mock.calls[0][0]);
    expect(sql).toContain("status <> 'draft'");
    expect(sql).toContain("ORDER BY created_at DESC");
  });
});

describe("history routes", () => {
  it("GET /api/conversations", async () => {
    h.query.mockResolvedValue({ rows: [{ id: ID, title: "t", updated_at: "x" }] });
    expect(await (await listConvosRoute()).json()).toEqual({ conversations: [{ id: ID, title: "t", updated_at: "x" }] });
  });

  it("GET /api/transfers returns the transaction history", async () => {
    h.query.mockResolvedValue({ rows: [{ id: "T1", recipient_name: "mama", status: "delivered" }] });
    expect((await (await listTransfersRoute()).json()).transfers[0]).toMatchObject({ id: "T1", status: "delivered" });
  });

  it("GET /api/conversations/[id]: 200 with data, 404 when missing", async () => {
    h.query.mockResolvedValueOnce({ rows: [{ id: ID }] }).mockResolvedValueOnce({ rows: [] }).mockResolvedValueOnce({ rows: [] });
    expect((await getConvoRoute(new Request("http://x"), params(ID))).status).toBe(200);
    expect((await getConvoRoute(new Request("http://x"), params("not-a-uuid"))).status).toBe(404);
    h.query.mockResolvedValueOnce({ rows: [] });
    expect((await getConvoRoute(new Request("http://x"), params(ID))).status).toBe(404);
  });

  it("DELETE /api/conversations/[id]: 200 when deleted, 404 when missing", async () => {
    h.query.mockResolvedValueOnce({ rowCount: 1 });
    expect(await (await deleteConvoRoute(new Request("http://x"), params(ID))).json()).toEqual({ deleted: true });
    h.query.mockResolvedValueOnce({ rowCount: 0 });
    expect((await deleteConvoRoute(new Request("http://x"), params(ID))).status).toBe(404);
  });

  it("reports database errors as 500 with the message", async () => {
    h.query.mockRejectedValue(new Error("db down"));
    const res = await listConvosRoute();
    expect(res.status).toBe(500);
    expect((await res.json()).error).toBe("db down");
  });
});
