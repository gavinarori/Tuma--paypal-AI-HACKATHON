"use client";
import { useCallback, useEffect, useState } from "react";

type State = {
  enabled: boolean; ai?: boolean; speed?: string; error?: string;
  orders?: { id: string; status: string; amountCents: number; at: string }[];
  payouts?: { id: string; email: string; status: string; amountCents: number; at: string }[];
  refunds?: { id: string; transferId: string; at: string }[];
  webhooks?: { id: string; type: string; result: string | number; at: string }[];
};
const usd = (c: number) => `$${(c / 100).toFixed(2)}`;
const time = (iso: string) => new Date(iso).toLocaleTimeString();
const btn = "min-h-11 rounded-full px-4 text-sm font-semibold transition active:scale-[.98]";

function Table({ caption, head, rows, empty }: { caption: string; head: string[]; rows: (string | number)[][]; empty: string }) {
  return (
    <section className="rounded-2xl bg-surface p-4 ring-1 ring-line">
      <h2 className="mb-2 text-base font-bold">{caption}</h2>
      {rows.length === 0 ? <p className="text-sm text-muted">{empty}</p> : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">{caption}</caption>
            <thead><tr>{head.map((h) => <th key={h} scope="col" className="pb-1 pe-3 font-semibold text-muted">{h}</th>)}</tr></thead>
            <tbody>{rows.map((r, i) => <tr key={i} className="border-t border-line">{r.map((c, j) => <td key={j} className="py-1.5 pe-3 align-top" dir="auto">{c}</td>)}</tr>)}</tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default function Simulator() {
  const [st, setSt] = useState<State | null>(null);
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    try { setSt(await (await fetch("/api/sim/state", { cache: "no-store" })).json()); } catch { /* offline: keep what we have */ }
  }, []);
  useEffect(() => { load(); const t = setInterval(load, 2000); return () => clearInterval(t); }, [load]);

  async function act(name: "seed" | "reset" | "fast-forward") {
    if (name === "reset" && !window.confirm("Delete all chats, transfers and recipients?")) return;
    const r = await fetch(`/api/sim/${name}`, { method: "POST" });
    const d = await r.json();
    setMsg(!r.ok ? d.error : name === "seed" ? "Demo data loaded." : name === "reset" ? "Everything was reset." : `Finished ${d.result} pending payout(s).`);
    load();
  }

  return (
    <main className="mx-auto max-w-3xl space-y-4 p-4">
      <header className="rounded-2xl bg-surface p-4 ring-1 ring-line">
        <h1 className="text-xl font-bold">Tuma simulator</h1>
        <p className="mt-1 text-sm text-muted">Try the whole flow without a PayPal account or an AI key. Nothing here is real money.</p>
        <p className="mt-3 text-sm" role="status">
          {!st ? "Loading…" : !st.enabled ? "Simulation is OFF." : `PayPal simulation is ON (${st.speed}). AI simulation is ${st.ai ? "ON" : "OFF (using Gemini)"}.`}
        </p>
      </header>

      {st && !st.enabled && (
        <section className="rounded-2xl bg-warn-soft p-4 text-sm text-warn">
          Add <code>NEXT_PUBLIC_PAYPAL_MODE=simulate</code> to <code>.env.local</code> (and <code>SIMULATE_AI=true</code> to skip Gemini too), then restart <code>npm run dev</code>.
        </section>
      )}

      {st?.enabled && (
        <>
          <section className="rounded-2xl bg-surface p-4 ring-1 ring-line">
            <h2 className="mb-2 text-base font-bold">Controls</h2>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => act("seed")} className={`${btn} bg-brand text-on-brand`}>Load demo data</button>
              <button onClick={() => act("fast-forward")} className={`${btn} bg-brand-soft text-brand-ink`}>Finish pending payouts now</button>
              <button onClick={() => act("reset")} className={`${btn} text-danger ring-1 ring-edge`}>Reset everything</button>
            </div>
            <p className="mt-2 min-h-5 text-sm" role="status" aria-live="polite">{msg}</p>
          </section>

          <section className="rounded-2xl bg-surface p-4 ring-1 ring-line">
            <h2 className="mb-2 text-base font-bold">What to type as the recipient&apos;s PayPal email</h2>
            <p className="mb-2 text-sm text-muted">The email decides what happens to the payout, like a real PayPal account would.</p>
            <table className="w-full text-left text-sm">
              <caption className="sr-only">Recipient emails and what they do</caption>
              <thead><tr><th scope="col" className="pb-1 pe-3 text-muted">Email</th><th scope="col" className="pb-1 text-muted">Result</th></tr></thead>
              <tbody>
                {[["mama@sim.test (anything else)", "Arrives after about 5 seconds"], ["baba.unclaimed@sim.test", "Stays \"sending\": no PayPal account yet"], ["shosho.fail@sim.test", "Fails after about 5 seconds, sender refunded"], ["wanjiru.reject@sim.test", "Refused at once, sender refunded"], ["juma.slow@sim.test", "Pending about 20 seconds, then arrives"]].map(([e, r]) => (
                  <tr key={e} className="border-t border-line"><td className="py-1.5 pe-3 font-mono text-xs" dir="ltr">{e}</td><td className="py-1.5">{r}</td></tr>
                ))}
              </tbody>
            </table>
            <p className="mt-3 text-sm text-muted">In the PayPal window (buyer@sim.test) you choose: pay, card declined, not enough funds, or cancel.</p>
          </section>

          <section className="rounded-2xl bg-surface p-4 ring-1 ring-line">
            <h2 className="mb-2 text-base font-bold">Things to say</h2>
            <ul className="space-y-1 text-sm">
              <li dir="auto">Send $50 to mama for rent</li>
              <li dir="auto">Tuma dola hamsini kwa mama kwa kodi</li>
              <li dir="auto">Envoie quarante dollars à maman</li>
              <li dir="auto">Abeg send mama twenty dollars for rent</li>
              <li dir="auto">yes · where is my money? · receipt</li>
            </ul>
            <p className="mt-2 text-xs text-muted">With the real AI (Gemini) any language works, for example Hausa, Yoruba, Amharic, Zulu, Arabic or Portuguese. The simulated AI understands the four above. The mic returns these phrases in turn.</p>
          </section>

          <Table caption="Payments" head={["Order", "Status", "Amount", "Time"]} rows={(st.orders ?? []).map((o) => [o.id, o.status, usd(o.amountCents), time(o.at)])} empty="No payments yet." />
          <Table caption="Payouts" head={["Batch", "To", "Status", "Amount"]} rows={(st.payouts ?? []).map((p) => [p.id, p.email, p.status, usd(p.amountCents)])} empty="No payouts yet." />
          <Table caption="Refunds" head={["Refund", "Transfer", "Time"]} rows={(st.refunds ?? []).map((r) => [r.id, r.transferId.slice(0, 8).toUpperCase(), time(r.at)])} empty="No refunds." />
          <Table caption="Webhooks delivered to the app" head={["Event", "Result", "Time"]} rows={(st.webhooks ?? []).map((w) => [w.type, String(w.result), time(w.at)])} empty="No webhooks yet." />
        </>
      )}
    </main>
  );
}