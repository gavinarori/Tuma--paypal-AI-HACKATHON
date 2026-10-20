import { NextResponse } from "next/server";
import { listConversations } from "@/lib/conversations";

export async function GET() {
  try {
    return NextResponse.json({ conversations: await listConversations() });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}