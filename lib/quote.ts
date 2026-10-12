// Indicative demo rates. Replace with a live FX API later; always label as indicative.
const RATES: Record<string, { currency: string; perUsd: number }> = {
  KE: { currency: "KES", perUsd: 129.0 },
};

export type Quote = {
  amountUsdCents: number;
  feeUsdCents: number;
  totalUsdCents: number;
  fxRate: number;
  payoutCurrency: string;
  payoutLocalAmount: number;
};

export function getQuote(amountUsdCents: number, country = "KE"): Quote {
  if (!Number.isInteger(amountUsdCents) || amountUsdCents < 100 || amountUsdCents > 100_000) {
    throw new Error("Amount must be between $1 and $1,000");
  }
  const rate = RATES[country];
  if (!rate) throw new Error(`Unsupported destination: ${country}`);
  // Demo fee: 1.5% + $0.30
  const feeUsdCents = Math.round(amountUsdCents * 0.015) + 30;
  const payoutLocalAmount = Math.round((amountUsdCents / 100) * rate.perUsd * 100) / 100;
  return {
    amountUsdCents,
    feeUsdCents,
    totalUsdCents: amountUsdCents + feeUsdCents,
    fxRate: rate.perUsd,
    payoutCurrency: rate.currency,
    payoutLocalAmount,
  };
}
