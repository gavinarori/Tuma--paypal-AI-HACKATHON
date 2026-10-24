"use client";
// Stand-in for "@paypal/react-paypal-js" when NEXT_PUBLIC_PAYPAL_MODE=simulate (see next.config.ts).
// It exports the same two components the page uses, but shows a clearly labelled simulated PayPal window.
import { useEffect, useRef, useState, type ReactNode } from "react";

export function PayPalScriptProvider({ children }: { children?: ReactNode; options?: unknown }) {
  return <>{children}</>;
}

type Props = {
  style?: unknown;
  createOrder?: () => Promise<string>;
  onApprove?: (data: { orderID: string }, actions?: unknown) => Promise<void> | void;
  onCancel?: (data?: unknown) => void;
  onError?: (err: unknown) => void;
};
type Order = { id: string; amount_usd_cents: number; description: string };
type Outcome = "approve" | "decline" | "insufficient";

const OUTCOMES: { value: Outcome; label: string }[] = [
  { value: "approve", label: "Pay successfully" },
  { value: "decline", label: "Card is declined" },
  { value: "insufficient", label: "Not enough funds" },
];

export function PayPalButtons({ createOrder, onApprove, onCancel, onError }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [outcome, setOutcome] = useState<Outcome>("approve");
  const [working, setWorking] = useState(false);

  useEffect(() => { if (order) dialog.current?.showModal(); }, [order]);

  async function open() {
    try {
      const id = await createOrder?.();
      const r = await fetch(`/api/sim/orders/${id}`);
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      setOutcome("approve");
      setOrder(d);
    } catch (e) { onError?.(e); }
  }

  function close() { dialog.current?.close(); setOrder(null); setWorking(false); }

  async function pay() {
    if (!order) return;
    setWorking(true);
    try {
      await new Promise((r) => setTimeout(r, 900)); // PayPal takes a moment, so does this
      const r = await fetch(`/api/sim/orders/${order.id}/approve`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ outcome }) });
      if (!r.ok) throw new Error((await r.json()).error);
      const orderID = order.id;
      close();
      if (outcome === "approve") await onApprove?.({ orderID }, {});
      else onError?.(new Error(outcome === "decline" ? "INSTRUMENT_DECLINED" : "INSUFFICIENT_FUNDS"));
    } catch (e) { close(); onError?.(e); }
  }

  function cancel() { const orderID = order?.id; close(); onCancel?.({ orderID }); }

  return (
    <div>
      <button type="button" onClick={open} className="min-h-12 w-full rounded-full bg-[#ffc439] px-4 font-bold text-[#10231c] transition active:scale-[.98]">
        Pay with PayPal <span className="text-xs font-semibold opacity-70">(simulator)</span>
      </button>
      <dialog ref={dialog} onCancel={(e) => { e.preventDefault(); cancel(); }} aria-labelledby="sim-title"
        className="m-auto w-[min(92vw,26rem)] rounded-3xl bg-surface p-0 text-foreground shadow-2xl backdrop:bg-black/50">
        {order && (
          <div className="p-5">
            <p className="rounded-xl bg-warn-soft px-3 py-2 text-xs font-medium text-warn">Simulation: this is not PayPal and no real money moves.</p>
            <h2 id="sim-title" className="mt-4 text-lg font-bold">Pay Tuma</h2>
            <p className="text-3xl font-bold tabular-nums" dir="ltr">${(order.amount_usd_cents / 100).toFixed(2)}</p>
            <p className="mt-1 text-sm text-muted">{order.description}</p>
            <dl className="mt-4 space-y-1 rounded-xl bg-background p-3 text-sm">
              <div className="flex justify-between gap-3"><dt className="text-muted">Account</dt><dd dir="ltr">buyer@sim.test</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-muted">Pay with</dt><dd>PayPal balance ($5,000.00)</dd></div>
            </dl>
            <fieldset className="mt-4">
              <legend className="text-sm font-medium">What should happen? (test the real cases)</legend>
              {OUTCOMES.map((o) => (
                <label key={o.value} className="flex min-h-11 items-center gap-3 text-sm">
                  <input type="radio" name="sim-outcome" value={o.value} checked={outcome === o.value} onChange={() => setOutcome(o.value)} className="h-5 w-5 accent-[var(--brand)]" />
                  {o.label}
                </label>
              ))}
            </fieldset>
            <div className="mt-4 flex gap-2">
              <button type="button" onClick={pay} disabled={working} aria-busy={working} className="min-h-12 flex-1 rounded-full bg-[#ffc439] font-bold text-[#10231c] disabled:opacity-60">
                {working ? "Contacting PayPal…" : "Pay now"}
              </button>
              <button type="button" onClick={cancel} disabled={working} className="min-h-12 rounded-full px-4 text-sm font-medium text-muted hover:text-foreground">Cancel</button>
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}