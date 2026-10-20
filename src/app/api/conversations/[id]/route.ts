import { NextResponse } from "next/server";
import { deleteConversation, getConversation } from "@/lib/conversations";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_: Request, { params }: Ctx) {
  try {
    const data = await getConversation((await params).id);
    return data ? NextResponse.json(data) : NextResponse.json({ error: "Conversation not found" }, { status: 404 });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

// Removes the chat only. Its transfers and receipts are kept.
export async function DELETE(_: Request, { params }: Ctx) {
  try {
    const ok = await deleteConversation((await params).id);
    return ok ? NextResponse.json({ deleted: true }) : NextResponse.json({ error: "Conversation not found" }, { status: 404 });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}