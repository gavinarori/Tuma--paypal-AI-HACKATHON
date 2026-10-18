import { describe, it, expect, vi, beforeEach } from "vitest";

const h = vi.hoisted(() => ({ gen: vi.fn() }));
vi.mock("@google/genai", () => ({ GoogleGenAI: class { models = { generateContent: h.gen }; } }));
import { generate } from "@/lib/gemini";

const err = (status: number) => Object.assign(new Error(`status ${status}`), { status });
const req = { contents: [{ role: "user", parts: [{ text: "hi" }] }] } as never;

beforeEach(() => { h.gen.mockReset(); });

describe("generate (model fallback for free-tier limits)", () => {
  it("uses the first model when it works", async () => {
    h.gen.mockResolvedValueOnce({ text: "ok" });
    const out = await generate(req, ["a", "b"]);
    expect(out.model).toBe("a");
    expect(h.gen).toHaveBeenCalledTimes(1);
    expect(h.gen.mock.calls[0][0].model).toBe("a");
  });

  it.each([404, 429, 500, 503])("falls back to the next model on a %s", async (status) => {
    h.gen.mockRejectedValueOnce(err(status)).mockResolvedValueOnce({ text: "from b" });
    const out = await generate(req, ["a", "b"]);
    expect(out.model).toBe("b");
    expect(out.res.text).toBe("from b");
    expect(h.gen.mock.calls.map((c) => c[0].model)).toEqual(["a", "b"]);
  });

  it.each([400, 401, 403])("does not retry on a %s (a real error)", async (status) => {
    h.gen.mockRejectedValue(err(status));
    await expect(generate(req, ["a", "b"])).rejects.toThrow(`status ${status}`);
    expect(h.gen).toHaveBeenCalledTimes(1);
  });

  it("throws the last error when every model is rate limited", async () => {
    h.gen.mockRejectedValueOnce(err(429)).mockRejectedValueOnce(err(503));
    await expect(generate(req, ["a", "b"])).rejects.toThrow("status 503");
  });

  it("passes the rest of the request through unchanged", async () => {
    h.gen.mockResolvedValueOnce({ text: "ok" });
    await generate({ ...(req as object), config: { maxOutputTokens: 100 } } as never, ["a"]);
    expect(h.gen.mock.calls[0][0]).toMatchObject({ model: "a", config: { maxOutputTokens: 100 } });
  });
});