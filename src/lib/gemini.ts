import { GoogleGenAI } from "@google/genai";

export const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Free-tier friendly: try the main model, fall back to the lighter one if rate limited or overloaded.
export const MODELS = [
  process.env.GEMINI_MODEL ?? "gemini-3.8-flash",
  process.env.GEMINI_FALLBACK_MODEL ?? "gemini-3.5-flash-lite",
];

type Req = Parameters<typeof ai.models.generateContent>[0];

export async function generate(req: Omit<Req, "model">, models: string[] = MODELS) {
  let last: unknown;
  for (const model of models) {
    try {
      const res = await ai.models.generateContent({ ...req, model });
      return { res, model };
    } catch (e) {
      last = e;
      const status = (e as { status?: number }).status;
      // 404 = this model was retired or isn't available to this key, so try the next one
      if (![404, 429, 500, 503].includes(status as number)) throw e;
    }
  }
  throw last;
}