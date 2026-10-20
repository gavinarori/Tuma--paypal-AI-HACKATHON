import { NextResponse } from "next/server";
import { getReceipt } from "@/lib/receipt";

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const text = await getReceipt(id, { record: true });
  if (!text) return NextResponse.json({ error: "Transfer not finished" }, { status: 409 });
  return NextResponse.json({ text });
}