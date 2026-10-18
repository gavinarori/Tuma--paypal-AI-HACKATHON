import { describe, it, expect } from "vitest";
import { getQuote } from "@/lib/quote";

describe("getQuote", () => {
  it("computes fee, total and the indicative local amount for $50", () => {
    expect(getQuote(5000)).toEqual({
      amountUsdCents: 5000, feeUsdCents: 105, totalUsdCents: 5105,
      fxRate: 129, payoutCurrency: "KES", payoutLocalAmount: 6450,
    });
  });

  it("handles the minimum ($1) and maximum ($1,000) amounts", () => {
    expect(getQuote(100)).toMatchObject({ feeUsdCents: 32, totalUsdCents: 132, payoutLocalAmount: 129 });
    expect(getQuote(100_000)).toMatchObject({ feeUsdCents: 1530, totalUsdCents: 101_530, payoutLocalAmount: 129_000 });
  });

  it.each([99, 100_001, 5000.5, -100, 0, NaN, Infinity])("rejects invalid amount %s", (cents) => {
    expect(() => getQuote(cents)).toThrow(/between \$1 and \$1,000/);
  });

  it("rejects unsupported destinations and defaults to Kenya", () => {
    expect(() => getQuote(5000, "NG")).toThrow(/Unsupported destination: NG/);
    expect(getQuote(5000).payoutCurrency).toBe("KES");
  });

  it("always keeps total = amount + fee with whole-cent integers", () => {
    for (let cents = 100; cents <= 100_000; cents += 777) {
      const q = getQuote(cents);
      expect(Number.isInteger(q.feeUsdCents)).toBe(true);
      expect(q.feeUsdCents).toBeGreaterThan(0);
      expect(q.totalUsdCents).toBe(cents + q.feeUsdCents);
    }
  });
});
