import { NextResponse } from "next/server";
import { runAgent, type ChatMsg } from "@/lib/agent";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    if (!Array.isArray(messages) || !messages.length) {
      return NextResponse.json({ error: "messages required" }, { status: 400 });
    }
    const clean: ChatMsg[] = messages.slice(-20).map((m: ChatMsg) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: String(m.content).slice(0, 2000),
    }));
    return NextResponse.json(await runAgent(clean));
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
