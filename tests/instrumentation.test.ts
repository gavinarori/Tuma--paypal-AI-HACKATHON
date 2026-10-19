import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const h = vi.hoisted(() => ({ migrate: vi.fn() }));
vi.mock("@/lib/migrate", () => ({ migrate: h.migrate }));
import { register } from "@/instrumentation";

beforeEach(() => { h.migrate.mockReset(); h.migrate.mockResolvedValue(undefined); });
afterEach(() => { vi.unstubAllEnvs(); });

describe("instrumentation register (automatic database setup)", () => {
  it("runs the migrations when the Node.js server starts", async () => {
    vi.stubEnv("NEXT_RUNTIME", "nodejs");
    vi.spyOn(console, "log").mockImplementation(() => {});
    await register();
    expect(h.migrate).toHaveBeenCalledOnce();
  });

  it("does nothing on the edge runtime", async () => {
    vi.stubEnv("NEXT_RUNTIME", "edge");
    await register();
    expect(h.migrate).not.toHaveBeenCalled();
  });

  it("can be switched off with AUTO_MIGRATE=false", async () => {
    vi.stubEnv("NEXT_RUNTIME", "nodejs");
    vi.stubEnv("AUTO_MIGRATE", "false");
    await register();
    expect(h.migrate).not.toHaveBeenCalled();
  });

  it("logs the real reason and does not crash the server when setup fails", async () => {
    vi.stubEnv("NEXT_RUNTIME", "nodejs");
    const err = vi.spyOn(console, "error").mockImplementation(() => {});
    h.migrate.mockRejectedValue(new Error("connect ECONNREFUSED 127.0.0.1:5432"));
    await expect(register()).resolves.toBeUndefined();
    expect(err.mock.calls.flat().join(" ")).toContain("automatic database setup failed: connect ECONNREFUSED");
  });
});