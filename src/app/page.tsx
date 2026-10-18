"use client";

import { useRef, useState, useEffect, useSyncExternalStore } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { startRecording } from "@/lib/voice";

type Quote = { amountUsdCents: number; feeUsdCents: number; totalUsdCents: number; fxRate: number; payoutCurrency: string; payoutLocalAmount: number };
type Pending = { recipientName: string; recipientEmail?: string; amountUsd: number; quote: Quote; [k: string]: unknown };
type Msg = { role: "user" | "assistant"; content: string };
type Tracking = { transfer: { status: string; recipient_name: string }; events: { to_status: string; created_at: string }[]; payoutStatus?: string | null };

const usd = (c: number) => `$${(c / 100).toFixed(2)}`;
const mask = (e?: string) => (e && e.includes("@") ? `${e[0]}•••@${e.split("@")[1]}` : "");
const time = (iso: string) => new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
const STAGES = ["Ask", "Review", "Pay", "Arrives"];
const STEPS = [
  { key: "paid", label: "Payment received" },
  { key: "payout_pending", label: "Sent to their PayPal" },
  { key: "delivered", label: "Arrived" },
];
const L = {
  en: { get: "They get", amount: "Transfer amount", fee: "Fee", pay: "You pay", forr: "For", confirm: "Confirm and pay", change: "Change details" },
  sw: { get: "Anapokea", amount: "Kiasi cha kutuma", fee: "Ada", pay: "Unalipa", forr: "Kwa ajili ya", confirm: "Thibitisha na ulipe", change: "Badilisha maelezo" },
  fr: { get: "Il reçoit", amount: "Montant du transfert", fee: "Frais", pay: "Vous payez", forr: "Pour", confirm: "Confirmer et payer", change: "Modifier les détails" },
  pcm: { get: "Dem go get", amount: "Money wey you dey send", fee: "Fee", pay: "Wetin you go pay", forr: "For", confirm: "Confirm am and pay", change: "Change am" },
};
// Stable callback ref: moves keyboard/screen-reader focus to a card when it first appears.
const focusOnMount = (el: HTMLElement | null) => el?.focus({ preventScroll: true });
const subscribeOnline = (cb: () => void) => { window.addEventListener("online", cb); window.addEventListener("offline", cb); return () => { window.removeEventListener("online", cb); window.removeEventListener("offline", cb); }; };
const CHIPS = ["Send $50 to mama for rent", "Tuma $30 kwa mama", "Envoie 40 dollars à mama", "Abeg send $20 give mama"];

function useCountUp(target: number, ms = 700) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = reduce ? 1 : Math.min(1, (t - t0) / ms);
      setV(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return v;
}

function Stepper({ stage }: { stage: number }) {
  return (
    <ol className="flex gap-1.5" aria-label={`Progress: step ${stage + 1} of ${STAGES.length}`}>
      {STAGES.map((s, i) => (
        <li key={s} className="flex-1" aria-current={i === stage ? "step" : undefined}>
          <div className="h-1 overflow-hidden rounded-full bg-line">
            <div className="h-full rounded-full bg-brand transition-[width] duration-700 ease-out" style={{ width: i <= stage ? "100%" : "0%" }} />
          </div>
          <span className={`mt-1 block text-xs ${i === stage ? "font-semibold" : "text-muted"}`}>{s}</span>
        </li>
      ))}
    </ol>
  );
}

const Typing = () => (
  <div className="pop inline-flex gap-1 rounded-2xl rounded-tl-md bg-them px-4 py-3 ring-1 ring-line" role="status" aria-label="Tuma is typing">
    {[0, 1, 2].map((i) => <span key={i} className="dot h-1.5 w-1.5 rounded-full bg-muted" />)}
  </div>
);

const Row = ({ k, v, strong }: { k: string; v: string; strong?: boolean }) => (
  <div className={`flex justify-between ${strong ? "border-t border-line pt-2 font-semibold" : "text-muted"}`}>
    <dt>{k}</dt>
    <dd className={`tabular-nums ${strong ? "" : "text-foreground"}`}>{v}</dd>
  </div>
);

function QuoteCard({ p, onConfirm, onChange, confirming }: { p: Pending; onConfirm: () => void; onChange: () => void; confirming: boolean }) {
  const q = p.quote;
  const shown = useCountUp(q.amountUsdCents / 100);
  const lang = (String(p.language) in L ? String(p.language) : "en") as keyof typeof L;
  const t = L[lang];
  return (
    <section ref={focusOnMount} tabIndex={-1} lang={lang} className="slide-up rounded-3xl bg-surface p-5 ring-1 ring-line" aria-label={`Review transfer to ${p.recipientName}`}>
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-full bg-brand-soft font-semibold text-brand-ink">{p.recipientName.slice(0, 1).toUpperCase()}</div>
        <div className="min-w-0">
          <p className="font-semibold capitalize">{p.recipientName}</p>
          <p className="truncate text-xs text-muted">PayPal {mask(p.recipientEmail)}</p>
        </div>
      </div>
      <p className="mt-5 text-sm text-muted">{t.get}</p>
      <p className="text-4xl font-bold tabular-nums tracking-tight"><span aria-hidden="true">${shown.toFixed(2)}</span><span className="sr-only">${(q.amountUsdCents / 100).toFixed(2)}</span></p>
      <p className="text-xs text-muted">in their PayPal account, about {q.payoutLocalAmount.toLocaleString()} {q.payoutCurrency} at an indicative rate</p>
      <dl className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
        {typeof p.purpose === "string" && p.purpose && <Row k={t.forr} v={p.purpose} />}
        <Row k={t.amount} v={usd(q.amountUsdCents)} />
        <Row k={t.fee} v={usd(q.feeUsdCents)} />
        <Row k={t.pay} v={usd(q.totalUsdCents)} strong />
      </dl>
      <button onClick={onConfirm} disabled={confirming} aria-busy={confirming} className="mt-4 min-h-12 w-full rounded-full bg-brand py-3 font-semibold text-on-brand transition active:scale-[.98] disabled:opacity-60">{confirming ? "Starting payment…" : t.confirm}</button>
      <button onClick={onChange} className="mt-1 min-h-11 w-full rounded-full py-2 text-sm font-medium text-muted hover:text-foreground">{t.change}</button>
    </section>
  );
}

function Check() {
  return (
    <svg viewBox="0 0 52 52" className="h-14 w-14 text-brand" aria-hidden="true">
      <circle cx="26" cy="26" r="24" className="draw-circle" fill="none" stroke="currentColor" strokeWidth="3" />
      <path d="M15 27l8 8 14-16" className="draw-check" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Timeline({ t }: { t: Tracking }) {
  const done = new Set(t.events.map((e) => e.to_status));
  const failed = t.transfer.status === "failed";
  const firstOpen = STEPS.findIndex((s) => !done.has(s.key));
  return (
    <ol className="space-y-3">
      {STEPS.map((s, i) => {
        const isDone = done.has(s.key);
        const active = !isDone && i === firstOpen && !failed;
        const label = s.key === "delivered" && active && t.payoutStatus === "UNCLAIMED" ? "Waiting for them to claim it" : s.label;
        const at = t.events.find((e) => e.to_status === s.key)?.created_at;
        return (
          <li key={s.key} className="flex items-center gap-3 text-sm">
            <span className={`relative grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs ${isDone ? "bg-brand text-on-brand" : active ? "bg-warn-soft text-warn" : "bg-line text-muted"}`}>
              <span aria-hidden="true">{isDone ? "✓" : i + 1}</span>
              {active && <span aria-hidden="true" className="ring absolute inset-0 rounded-full bg-warn-soft" />}
            </span>
            <span className={isDone || active ? "font-medium" : "text-muted"}><span className="sr-only">{isDone ? "Done: " : active ? "In progress: " : "Not started: "}</span>{label}</span>
            {at && <span className="ml-auto text-xs text-muted">{time(at)}</span>}
          </li>
        );
      })}
    </ol>
  );
}

export default function Home() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "assistant", content: "Hi, I'm Tuma. Tell me who you're sending money to and how much. You can write in English, Swahili, French or Pidgin, or tap the mic." },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [pending, setPending] = useState<Pending | null>(null);
  const [checkout, setCheckout] = useState<{ transferId: string; orderId: string } | null>(null);
  const [captured, setCaptured] = useState(false);
  const [track, setTrack] = useState<Tracking | null>(null);
  const [error, setError] = useState("");
  const [receipt, setReceipt] = useState("");
  const [transcribing, setTranscribing] = useState(false);
  const recRef = useRef<{ stop: () => void } | null>(null);
  const [listening, setListening] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [confirming, setConfirming] = useState(false);
  const online = useSyncExternalStore(subscribeOnline, () => navigator.onLine, () => true);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "end" });
  }, [msgs, pending, checkout, captured, track, receipt, busy]);

  const stage = captured || track ? 3 : checkout ? 2 : pending ? 1 : 0;
  const finished = track ? ["delivered", "failed"].includes(track.transfer.status) : false;
  // Spoken to screen readers whenever the transfer moves forward
  const announce = track
    ? track.transfer.status === "delivered" ? `Delivered to ${track.transfer.recipient_name}.`
      : track.transfer.status === "failed" ? "The transfer didn't go through."
      : track.events.some((e) => e.to_status === "payout_pending") ? "Sent to their PayPal account." : "Payment received."
    : captured ? "Payment approved. Confirming with PayPal." : "";

  async function send(override?: string) {
    const text = (override ?? input).trim();
    if (!text || busy || !online) return;
    const next = [...msgs, { role: "user" as const, content: text }];
    setMsgs(next); setInput(""); setBusy(true); setError(""); setPending(null); setCheckout(null);
    try {
      const res = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: next }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMsgs([...next, { role: "assistant", content: data.reply }]);
      if (data.pending) setPending(data.pending);
    } catch (e) {
      setMsgs(msgs); setInput(text); // put the message back so nothing is lost
      setError(`Tuma couldn't reply: ${(e as Error).message}. Your message is back in the box. Check your connection, then press Send.`);
    }
    setBusy(false);
  }

  async function toggleVoice() {
    if (listening) { recRef.current?.stop(); return; }
    if (transcribing || busy) return;
    try {
      const rec = await startRecording();
      recRef.current = rec;
      setListening(true); setError("");
      const wav = await rec.result;
      setListening(false); setTranscribing(true);
      const res = await fetch("/api/transcribe", { method: "POST", headers: { "Content-Type": "audio/wav" }, body: wav });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      if (!data.text) setError("I couldn't hear anything. Tap the mic and try again, closer to your phone.");
      else await send(data.text); // the confirmation card re-checks the amount before any money moves
    } catch (e) {
      setListening(false);
      setError((e as Error).name === "NotAllowedError" ? "Microphone access is blocked. Allow it in your browser settings, or type your message." : (e as Error).message);
    }
    setTranscribing(false);
  }

  async function confirm() {
    if (!pending || confirming) return;
    setConfirming(true); setError("");
    try {
      const res = await fetch("/api/transfers", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(pending) });
      const data = await res.json();
      if (!res.ok) setError(`Couldn't start the payment: ${data.error}`);
      else { setTrack(null); setReceipt(""); setCaptured(false); setCheckout({ transferId: data.transferId, orderId: data.orderId }); }
    } catch {
      setError("Couldn't reach the server. Check your connection, then press Confirm again.");
    }
    setConfirming(false);
  }

  async function poll(id: string) {
    for (let i = 0; i < 30; i++) {
      const r = await fetch(`/api/transfers/${id}`);
      if (!r.ok) break;
      const d: Tracking = await r.json();
      setTrack(d);
      if (["delivered", "failed"].includes(d.transfer.status)) {
        const rr = await fetch(`/api/transfers/${id}/receipt`, { method: "POST" });
        if (rr.ok) setReceipt((await rr.json()).text);
        return;
      }
      await new Promise((r) => setTimeout(r, 2000));
    }
    setError("This is taking longer than usual. Send “where is my money?” to check again.");
  }

  function reset() {
    setTrack(null); setReceipt(""); setPending(null); setCheckout(null); setCaptured(false); setError("");
    inputRef.current?.focus();
  }

  return (
    <main className="mx-auto flex h-dvh max-w-md flex-col bg-background md:my-4 md:h-[calc(100dvh-2rem)] md:overflow-hidden md:rounded-[2rem] md:shadow-xl md:ring-1 md:ring-line">
      <p className="sr-only" role="status" aria-live="polite">{announce}</p>
      <header className="px-5 pb-3 pt-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand text-on-brand">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </span>
            <div>
              <h1 className="text-lg font-bold leading-none">Tuma</h1>
              <p className="text-xs text-muted">Send money home</p>
            </div>
          </div>
          <span className="rounded-full bg-warn-soft px-2.5 py-1 text-xs font-semibold text-warn">Sandbox: no real money</span>
        </div>
        <Stepper stage={stage} />
      </header>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 pb-4" role="log" aria-live="polite" aria-label="Conversation with Tuma" tabIndex={0}>
        {msgs.map((m, i) => {
          const me = m.role === "user";
          return (
            <div key={i} className={me ? "flex justify-end" : "flex"}>
              <p className={`pop max-w-[85%] whitespace-pre-wrap px-3.5 py-2 text-[0.9375rem] leading-snug ${me ? "pop-me rounded-2xl rounded-tr-md bg-me" : "rounded-2xl rounded-tl-md bg-them ring-1 ring-line"}`}><span className="sr-only">{me ? "You: " : "Tuma: "}</span>{m.content}</p>
            </div>
          );
        })}
        {busy && <Typing />}

        {msgs.length === 1 && !busy && (
          <div className="flex flex-wrap gap-2 pt-1">
            {CHIPS.map((c) => (
              <button key={c} onClick={() => send(c)} className="min-h-11 rounded-full bg-surface px-4 py-2 text-sm font-medium text-brand-ink ring-1 ring-edge transition hover:bg-brand-soft active:scale-95">{c}</button>
            ))}
          </div>
        )}

        {pending && !checkout && <QuoteCard p={pending} confirming={confirming} onConfirm={confirm} onChange={() => { setPending(null); inputRef.current?.focus(); }} />}

        {pending && checkout && !captured && (
          <section className="slide-up rounded-3xl bg-surface p-5 ring-1 ring-line" aria-label="Pay with PayPal" ref={focusOnMount} tabIndex={-1}>
            <p className="text-sm text-muted">You pay</p>
            <p className="text-3xl font-bold tabular-nums">{usd(pending.quote.totalUsdCents)}</p>
            <p className="mb-4 text-sm text-muted">to send {usd(pending.quote.amountUsdCents)} to <span className="capitalize">{pending.recipientName}</span>, including the {usd(pending.quote.feeUsdCents)} fee.</p>
            <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!, currency: "USD" }}>
              <PayPalButtons
                style={{ layout: "vertical", shape: "pill", label: "pay" }}
                createOrder={async () => checkout.orderId}
                onApprove={async () => {
                  setCaptured(true);
                  const r = await fetch(`/api/transfers/${checkout.transferId}/capture`, { method: "POST" });
                  if (!r.ok) { setCaptured(false); return setError(`PayPal approved the payment, but we couldn't confirm it: ${(await r.json()).error}`); }
                  poll(checkout.transferId);
                }}
                onCancel={() => setError("Payment cancelled. Press the PayPal button to try again, or change the details.")}
                onError={() => setError("PayPal couldn't complete the payment. Try again, or use a different payment method.")}
              />
            </PayPalScriptProvider>
          </section>
        )}

        {captured && !track && (
          <section className="slide-up flex items-center gap-3 rounded-3xl bg-surface p-5 text-sm ring-1 ring-line" role="status">
            <span className="spinner h-5 w-5 rounded-full border-2 border-line border-t-brand" />
            Payment approved. Confirming with PayPal…
          </section>
        )}

        {track && (
          <section className="slide-up rounded-3xl bg-surface p-5 ring-1 ring-line" aria-label="Transfer status" ref={focusOnMount} tabIndex={-1}>
            <div className="mb-4 flex items-center gap-3">
              {track.transfer.status === "delivered" && <Check />}
              <div>
                <h2 className="text-lg font-bold">
                  {track.transfer.status === "delivered" ? `Delivered to ${track.transfer.recipient_name}` : track.transfer.status === "failed" ? "Transfer didn't go through" : `On its way to ${track.transfer.recipient_name}`}
                </h2>
                {track.payoutStatus === "UNCLAIMED" && <p className="text-sm text-warn">That email has no PayPal account yet. PayPal emailed them a link to claim the money.</p>}
              </div>
            </div>
            {track.transfer.status !== "failed" && <Timeline t={track} />}
            {finished && !receipt && <p className="mt-4 text-sm text-muted">Writing your receipt…</p>}
            {receipt && (
              <p className={`slide-up mt-4 rounded-2xl p-3.5 text-sm ${track.transfer.status === "failed" ? "bg-warn-soft text-warn" : "bg-brand-soft text-brand-ink"}`}>{receipt}</p>
            )}
            {finished && checkout && <p className="mt-3 text-xs text-muted">Reference <span className="select-all font-semibold text-foreground">{checkout.transferId.slice(0, 8).toUpperCase()}</span></p>}
            {finished && (
              <button onClick={reset} className="mt-4 w-full rounded-full bg-brand py-3 font-semibold text-on-brand transition active:scale-[.98]">Send another</button>
            )}
          </section>
        )}

        {error && <div role="alert" className="slide-up rounded-2xl bg-danger/10 p-3 text-sm text-danger">{error}</div>}
        <div ref={endRef} />
      </div>

      <footer className="border-t border-line bg-surface/80 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur">
        <form onSubmit={(e) => { e.preventDefault(); send(); }} aria-label="Message Tuma" className="flex items-center gap-1 rounded-full bg-background py-1.5 pl-3 pr-1.5 ring-1 ring-edge focus-within:ring-2 focus-within:ring-brand">
          <label htmlFor="message" className="sr-only">Message to Tuma. Say who to pay and how much.</label>
          <input id="message" ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} enterKeyHint="send" autoComplete="off" placeholder="Send $50 to mama…" className="min-w-0 flex-1 bg-transparent px-1 py-2 text-[0.9375rem] outline-none placeholder:text-muted" />
          <button type="button" onClick={toggleVoice} disabled={transcribing || !online} aria-label={listening ? "Stop and send" : "Speak your request"} className="relative grid h-11 w-11 place-items-center rounded-full text-muted hover:text-foreground">
            {listening && <span className="ring absolute inset-0 rounded-full bg-danger/30" />}
            {transcribing && <span className="spinner absolute h-5 w-5 rounded-full border-2 border-line border-t-brand" />}
            <svg viewBox="0 0 24 24" className={`relative h-5 w-5 ${listening ? "text-danger" : ""} ${transcribing ? "opacity-0" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></svg>
          </button>
          <button type="submit" disabled={busy || !online || !input.trim()} aria-label="Send message" className="grid h-11 w-11 place-items-center rounded-full bg-brand text-on-brand transition active:scale-90 disabled:opacity-40">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </button>
        </form>
        <p className="mt-1.5 h-4 text-center text-xs text-muted" aria-live="polite">{!online ? "You're offline. Reconnect to send." : listening ? "Listening… tap the mic when you're done" : transcribing ? "Understanding what you said…" : ""}</p>
      </footer>
    </main>
  );
}