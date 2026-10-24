import { NextResponse } from "next/server";
import { isSimulated, getOrder, approveOrder } from "@/lib/paypal-sim";
import { PayPalError } from "@/lib/paypal-error";
import { simState, seedDemo, resetAll, fastForward } from "@/lib/sim-admin";

// The simulator's control routes. All of them answer 404 unless NEXT_PUBLIC_PAYPAL_MODE=simulate.
//   GET  /api/sim/state                    what the /simulator page shows
//   GET  /api/sim/orders/:id               what the simulated PayPal window shows
//   POST /api/sim/orders/:id/approve       the buyer's choice: approve | decline | insufficient
//   POST /api/sim/seed | reset | fast-forward
type Ctx = { params: Promise<{ path: string[] }> };
const off = () => NextResponse.json({ error: "The simulator is off. Set NEXT_PUBLIC_PAYPAL_MODE=simulate in .env.local and restart." }, { status: 404 });
const fail = (e: unknown, status = 500) => NextResponse.json({ error: (e as Error).message }, { status: e instanceof PayPalError ? e.status : status });

export async function GET(_: Request, { params }: Ctx) {
  const [a, id] = (await params).path;
  if (a === "state" && !isSimulated()) return NextResponse.json({ enabled: false });
  if (!isSimulated()) return off();
  try {
    if (a === "state") return NextResponse.json({ enabled: true, ai: process.env.SIMULATE_AI === "true", speed: process.env.SIM_SPEED === "fast" ? "fast" : "realistic", ...(await simState()) });
    if (a === "orders" && id) {
      const o = await getOrder(id);
      return o ? NextResponse.json({ id: o.id, amount_usd_cents: o.amountCents, description: o.description, status: o.status }) : NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  } catch (e) { return fail(e); }
}

export async function POST(req: Request, { params }: Ctx) {
  if (!isSimulated()) return off();
  const [a, id, b] = (await params).path;
  try {
    if (a === "seed") return NextResponse.json({ ok: true, result: await seedDemo() });
    if (a === "reset") return NextResponse.json({ ok: true, result: await resetAll() });
    if (a === "fast-forward") return NextResponse.json({ ok: true, result: await fastForward() });
    if (a === "orders" && id && b === "approve") {
      const { outcome } = await req.json();
      if (!["approve", "decline", "insufficient"].includes(outcome)) return NextResponse.json({ error: "outcome must be approve, decline or insufficient" }, { status: 400 });
      const o = await approveOrder(id, outcome);
      return NextResponse.json({ id: o.id, status: o.status });
    }
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  } catch (e) { return fail(e, 400); }
}