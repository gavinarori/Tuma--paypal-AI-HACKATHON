import { NextResponse } from "next/server";
import { Type, ThinkingLevel } from "@google/genai";
import { generate } from "@/lib/gemini";

const PROMPT = `Transcribe this audio exactly as spoken. The speaker is most likely asking to send money in US dollars to a family member (for example "mama"), and may speak English, Swahili, Sheng, French or Nigerian Pidgin, or mix them.
Do NOT translate. Write numbers as the speaker said them. If there is no clear speech, return an empty text.
Return JSON: text (the transcript) and language (one of: en, sw, fr, pcm).`;

export async function POST(req: Request) {
  try {
    const audio = Buffer.from(await req.arrayBuffer());
    if (audio.length < 1000) return NextResponse.json({ error: "No audio received" }, { status: 400 });
    if (audio.length > 3_000_000) return NextResponse.json({ error: "Recording too long. Keep it under 20 seconds." }, { status: 413 });

    const { res } = await generate({
      contents: [{ role: "user", parts: [{ inlineData: { mimeType: "audio/wav", data: audio.toString("base64") } }, { text: PROMPT }] }],
      config: {
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        responseMimeType: "application/json",
        responseSchema: { type: Type.OBJECT, properties: { text: { type: Type.STRING }, language: { type: Type.STRING } }, required: ["text", "language"] },
      },
    });
    const parsed = JSON.parse(res.text ?? "{}") as { text?: string; language?: string };
    return NextResponse.json({ text: (parsed.text ?? "").trim(), language: parsed.language ?? "en" });
  } catch (e) {
    console.error("transcribe failed:", (e as Error).message); // the real reason shows in the terminal running `npm run dev`
    const status = (e as { status?: number }).status;
    const msg =
      status === 429 ? "The free AI quota is busy. Wait a few seconds and try again."
      : status === 404 ? "The Gemini model isn't available. Check GEMINI_MODEL and GEMINI_FALLBACK_MODEL in .env.local."
      : status === 400 || status === 401 || status === 403 ? "Gemini rejected the request. Check that GEMINI_API_KEY in .env.local is correct."
      : "Couldn't understand the recording. Try again or type your request.";
    return NextResponse.json({ error: msg }, { status: status && status >= 400 && status < 600 ? status : 500 });
  }
}