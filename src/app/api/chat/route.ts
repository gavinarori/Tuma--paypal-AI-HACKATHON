import { NextResponse } from "next/server";
import { runAgent, type ChatMsg } from "@/lib/agent";
import { saveTurn } from "@/lib/conversations";

export async function POST(req: Request) {
  try {
    const { messages, awaiting, conversationId } = await req.json();
    if (!Array.isArray(messages) || !messages.length) {
      return NextResponse.json({ error: "messages required" }, { status: 400 });
    }
    const clean: ChatMsg[] = messages.slice(-20).map((m: ChatMsg) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: String(m.content).slice(0, 2000),
    }));
    const aw = awaiting && typeof awaiting.recipient === "string" && Number.isFinite(Number(awaiting.amountUsd))
      ? {
          recipient: awaiting.recipient.slice(0, 60),
          amountUsd: Number(awaiting.amountUsd),
          detailsConfirmed: awaiting.detailsConfirmed === true,
          purpose: typeof awaiting.purpose === "string" ? awaiting.purpose.slice(0, 200) : null,
          language: ["en", "sw", "fr", "pcm"].includes(awaiting.language) ? awaiting.language : "en",
          country: /^[A-Z]{2}$/.test(String(awaiting.country)) ? String(awaiting.country) : "KE",
        }
      : null;
    const result = await runAgent(clean, { awaiting: aw });
    // Save only after a successful reply, so a failed send (which the page lets the user retry) is never stored twice
    const lastUser = [...clean].reverse().find((m) => m.role === "user");
    const savedId = lastUser ? await saveTurn(conversationId, lastUser.content, result.reply.slice(0, 4000)) : null;
    return NextResponse.json({ ...result, conversationId: savedId });
  } catch (e) {
    const status = (e as { status?: number }).status;
    const msg = status === 429 ? "The free AI quota is busy. Wait a few seconds and try again." : (e as Error).message;
    return NextResponse.json({ error: msg }, { status: status === 429 ? 429 : 500 });
  }
}