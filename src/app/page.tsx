"use client";

import { useCallback, useRef, useState, useEffect, useSyncExternalStore, type FormEvent, type CSSProperties, type KeyboardEvent as RKeyboardEvent } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { startRecording } from "@/lib/voice";
import { Diamonds, Mark, Savanna } from "./art";

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
// PayPal's checkout has no Swahili or Pidgin, so those users get English there (Tuma's own messages stay in their language)
const PAYPAL_LOCALE: Record<string, string> = { en: "en_US", fr: "fr_FR", sw: "en_US", pcm: "en_US" };
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

const HELLOS = [
  { w: "Karibu", l: "sw" }, { w: "Bienvenue", l: "fr" }, { w: "Akwaaba", l: "tw" }, { w: "Barka da zuwa", l: "ha" },
  { w: "Ẹ káàbọ̀", l: "yo" }, { w: "Siyakwamukela", l: "zu" }, { w: "Welcome", l: "en" },
];

// First thing people see: a welcome that moves through the languages Tuma understands
function Welcome() {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setI((n) => (n + 1) % HELLOS.length), 2800);
    return () => clearInterval(id);
  }, []);
  const h = HELLOS[i];
  return (
    <div className="pt-2 text-center">
      <span className="sr-only">Welcome to Tuma</span>
      <p aria-hidden="true" className="flex h-12 items-center justify-center">
        <span key={i} lang={h.l} className="hello font-display text-4xl font-extrabold tracking-tight text-brand-ink">{h.w}</span>
      </p>
      <Diamonds className="mt-2" />
      <p className="mx-auto mt-3 max-w-[18rem] text-sm text-muted">Write in the language you speak at home.</p>
      <Savanna className="mt-2" />
    </div>
  );
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

function RecipientForm({ p, onSubmit, onCancel }: { p: Pending; onSubmit: (d: { name: string; email: string }) => void; onCancel: () => void }) {
  const [name, setName] = useState(p.recipientName);
  const [email, setEmail] = useState(String(p.recipientEmail ?? ""));
  const [save, setSave] = useState(true);
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);
  const field = "min-h-11 w-full rounded-xl bg-background px-3 text-[0.9375rem] outline-none ring-1 ring-edge focus:ring-2 focus:ring-brand";

  async function submit(e: FormEvent) {
    e.preventDefault();
    const n = name.trim(), em = email.trim();
    if (!n) return setErr("Enter the recipient's name.");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)) return setErr("Enter a valid PayPal email, like name@example.com.");
    setErr(""); setSaving(true);
    if (save) {
      try { await fetch("/api/recipients", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: n, email: em, country: p.country }) }); } catch { /* saving is optional */ }
    }
    setSaving(false);
    onSubmit({ name: n, email: em });
  }

  return (
    <section ref={focusOnMount} tabIndex={-1} aria-label="Recipient details" className="slide-up card rounded-3xl bg-surface p-5 ring-1 ring-line">
      <h2 className="text-lg font-bold">Who is receiving {usd(p.quote.amountUsdCents)}?</h2>
      <p className="mt-1 text-sm text-muted">PayPal needs the email of the recipient&apos;s PayPal account. Check it carefully: a payment to the wrong email can&apos;t be undone.</p>
      <form onSubmit={submit} noValidate className="mt-4 space-y-3">
        <div>
          <label htmlFor="r-name" className="mb-1 block text-sm font-medium">Recipient name</label>
          <input id="r-name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="off" className={field} />
        </div>
        <div>
          <label htmlFor="r-email" className="mb-1 block text-sm font-medium">Recipient&apos;s PayPal email</label>
          <input id="r-email" type="email" inputMode="email" autoComplete="off" autoCapitalize="none" spellCheck={false} value={email} onChange={(e) => setEmail(e.target.value)}
            aria-describedby="r-email-help r-err" aria-invalid={Boolean(err)} placeholder="name@example.com" className={field} />
          <p id="r-email-help" className="mt-1 text-xs text-muted">If they don&apos;t have a PayPal account yet, PayPal emails them a link to claim the money.</p>
        </div>
        <label className="flex min-h-11 items-center gap-3 text-sm">
          <input type="checkbox" checked={save} onChange={(e) => setSave(e.target.checked)} className="h-5 w-5 accent-[var(--brand)]" />
          Remember this recipient for next time
        </label>
        <p id="r-err" role="alert" className="text-sm font-medium text-danger">{err}</p>
        <div className="flex gap-2">
          <button type="submit" disabled={saving} className="min-h-12 flex-1 rounded-full bg-brand py-3 font-semibold text-on-brand transition active:scale-[.98] disabled:opacity-60">Continue to review</button>
          <button type="button" onClick={onCancel} className="min-h-12 rounded-full px-4 text-sm font-medium text-muted hover:text-foreground">Cancel</button>
        </div>
      </form>
    </section>
  );
}

function QuoteCard({ p, onConfirm, onChange, confirming }: { p: Pending; onConfirm: () => void; onChange: () => void; confirming: boolean }) {
  const q = p.quote;
  const shown = useCountUp(q.amountUsdCents / 100);
  const lang = (String(p.language) in L ? String(p.language) : "en") as keyof typeof L;
  const t = L[lang];
  return (
    <section ref={focusOnMount} tabIndex={-1} lang={lang} className="slide-up card rounded-3xl bg-surface p-5 ring-1 ring-line" aria-label={`Review transfer to ${p.recipientName}`}>
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-full bg-brand-soft font-semibold text-brand-ink ring-2 ring-gold/70">{p.recipientName.slice(0, 1).toUpperCase()}</div>
        <div className="min-w-0">
          <p className="font-semibold capitalize">{p.recipientName}</p>
          <p className="truncate text-xs text-muted">PayPal {mask(p.recipientEmail)}</p>
        </div>
      </div>
      <p className="mt-5 text-sm text-muted">{t.get}</p>
      <p className="font-display text-4xl font-extrabold tabular-nums tracking-tight"><span aria-hidden="true">${shown.toFixed(2)}</span><span className="sr-only">${(q.amountUsdCents / 100).toFixed(2)}</span></p>
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
    <span className="relative inline-block h-14 w-14 shrink-0">
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a, k) => (
        <span key={a} aria-hidden="true" className="burst absolute left-1/2 top-1/2 -ml-1 -mt-1 h-2 w-2" style={{ "--a": `${a}deg`, background: k % 2 ? "var(--clay)" : "var(--gold)" } as CSSProperties} />
      ))}
      <svg viewBox="0 0 52 52" className="relative h-14 w-14 text-brand" aria-hidden="true">
        <circle cx="26" cy="26" r="24" className="draw-circle" fill="none" stroke="currentColor" strokeWidth="3" />
        <path d="M15 27l8 8 14-16" className="draw-check" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
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

type ConvoItem = { id: string; title: string; updated_at: string };
type TransferItem = { id: string; recipient_name: string; amount_usd_cents: number; status: string; created_at: string; conversation_id: string | null };

const GREETING: Msg = { role: "assistant", content: "Hi, I'm Tuma. Tell me who you're sending money to and how much. You can write in English, Swahili, French or Pidgin, or tap the mic." };
const STATUS_LABEL: Record<string, { text: string; cls: string }> = {
  delivered: { text: "Delivered", cls: "bg-brand-soft text-brand-ink" },
  failed: { text: "Failed", cls: "bg-warn-soft text-warn" },
  payout_pending: { text: "Sending", cls: "bg-line text-foreground" },
  paid: { text: "Paid", cls: "bg-line text-foreground" },
  awaiting_payment: { text: "Not paid yet", cls: "bg-line text-muted" },
};
const when = (iso: string) => new Date(iso).toLocaleString(undefined, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

function HistoryPanel({ convos, transfers, activeId, tab, onTab, onOpenConvo, onOpenTransfer, onDelete, onNew }: {
  convos: ConvoItem[]; transfers: TransferItem[]; activeId: string | null; tab: "chats" | "transfers";
  onTab: (t: "chats" | "transfers") => void; onOpenConvo: (id: string) => void; onOpenTransfer: (t: TransferItem) => void; onDelete: (c: ConvoItem) => void; onNew: () => void;
}) {
  const row = "min-h-11 w-full rounded-xl px-3 py-2 text-left text-sm transition hover:bg-brand-soft";
  return (
    <nav aria-label="History" className="flex min-h-0 flex-1 flex-col">
      <button onClick={onNew} className="mx-3 mb-3 mt-2 min-h-11 rounded-full bg-brand px-4 font-semibold text-on-brand transition active:scale-[.98]">New chat</button>
      <div role="group" aria-label="Show" className="mx-3 mb-2 flex rounded-full bg-background p-1 ring-1 ring-edge">
        {(["chats", "transfers"] as const).map((k) => (
          <button key={k} aria-pressed={tab === k} onClick={() => onTab(k)}
            className={`min-h-10 flex-1 rounded-full px-3 text-sm font-medium ${tab === k ? "bg-brand text-on-brand" : "text-muted hover:text-foreground"}`}>
            {k === "chats" ? "Chats" : "Transactions"}
          </button>
        ))}
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-3">
        {tab === "chats" ? (
          convos.length ? (
            <ul className="space-y-1">
              {convos.map((c) => (
                <li key={c.id} className="flex items-center gap-1">
                  <button onClick={() => onOpenConvo(c.id)} aria-current={c.id === activeId ? "true" : undefined} className={`${row} min-w-0 flex-1 ${c.id === activeId ? "bg-brand-soft" : ""}`}>
                    <span className="block truncate font-medium">{c.title}</span>
                    <span className="block text-xs text-muted">{when(c.updated_at)}</span>
                  </button>
                  <button onClick={() => onDelete(c)} aria-label={`Delete chat: ${c.title}`} className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-muted hover:text-danger">
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" /></svg>
                  </button>
                </li>
              ))}
            </ul>
          ) : <p className="px-3 py-6 text-sm text-muted">No chats yet. Your conversations will appear here.</p>
        ) : transfers.length ? (
          <ul className="space-y-1">
            {transfers.map((t) => {
              const st = STATUS_LABEL[t.status] ?? { text: t.status, cls: "bg-line text-muted" };
              return (
                <li key={t.id}>
                  <button onClick={() => onOpenTransfer(t)} className={row}>
                    <span className="flex items-center justify-between gap-2">
                      <span className="truncate font-medium capitalize">{t.recipient_name}</span>
                      <span className="shrink-0 font-semibold tabular-nums">{usd(t.amount_usd_cents)}</span>
                    </span>
                    <span className="mt-0.5 flex items-center justify-between gap-2">
                      <span className="text-xs text-muted">{when(t.created_at)}</span>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${st.cls}`}>{st.text}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        ) : <p className="px-3 py-6 text-sm text-muted">No transactions yet. Money you send will be listed here.</p>}
      </div>
    </nav>
  );
}

export default function Home() {
  const [msgs, setMsgs] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [pending, setPending] = useState<Pending | null>(null);
  const [checkout, setCheckout] = useState<{ transferId: string; orderId: string } | null>(null);
  const [details, setDetails] = useState<{ name: string; email: string } | null>(null);
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
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [convos, setConvos] = useState<ConvoItem[]>([]);
  const [history, setHistory] = useState<TransferItem[]>([]);
  const [tab, setTab] = useState<"chats" | "transfers">("chats");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const logRef = useRef<HTMLDivElement>(null);

  // History is a convenience: if loading it fails, the chat still works
  const refreshLists = useCallback(async () => {
    try {
      const [c, t] = await Promise.all([fetch("/api/conversations"), fetch("/api/transfers")]);
      if (c.ok) setConvos((await c.json()).conversations);
      if (t.ok) setHistory((await t.json()).transfers);
    } catch { /* ignore */ }
  }, []);
  useEffect(() => { refreshLists(); }, [refreshLists]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "end" });
  }, [msgs, pending, checkout, captured, track, receipt, busy]);

  // the quote plus the recipient details the sender confirmed in the form
  const effective = pending && details ? { ...pending, recipientName: details.name, recipientEmail: details.email } : null;
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
    const awaiting = pending && !checkout && !track
      ? { recipient: pending.recipientName, amountUsd: pending.amountUsd, detailsConfirmed: Boolean(details), purpose: pending.purpose ?? null, language: pending.language, country: pending.country }
      : null;
    setMsgs(next); setInput(""); setBusy(true); setError("");
    try {
      const res = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: next, awaiting, conversationId }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMsgs([...next, { role: "assistant", content: data.reply }]);
      if (data.conversationId) setConversationId(data.conversationId);
      if (data.pending) {
        // a new quote replaces the old state; keep the confirmed details only if it is the same recipient
        const np = data.pending as Pending;
        setDetails((d) => (d && d.name.toLowerCase() === np.recipientName.toLowerCase() && (!np.recipientEmail || String(np.recipientEmail).toLowerCase() === d.email.toLowerCase()) ? d : null));
        setPending(np); setCheckout(null); setTrack(null); setReceipt(""); setCaptured(false);
      }
      if (data.checkout) await confirm(); // the user agreed in chat: open the PayPal step for them
    } catch (e) {
      setMsgs(msgs); setInput(text); // put the message back so nothing is lost
      setError(`Tuma couldn't reply: ${(e as Error).message}. Your message is back in the box. Check your connection, then press Send.`);
    }
    setBusy(false);
    refreshLists();
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
    if (!effective || confirming) return;
    setConfirming(true); setError("");
    try {
      const res = await fetch("/api/transfers", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...effective, conversationId }) });
      const data = await res.json();
      if (!res.ok) setError(`Couldn't start the payment: ${data.error}`);
      else { setTrack(null); setReceipt(""); setCaptured(false); setCheckout({ transferId: data.transferId, orderId: data.orderId }); refreshLists(); }
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
        if (rr.ok) {
          const text = (await rr.json()).text as string;
          setReceipt(text);
          // keep a record of the transaction in the conversation itself
          setMsgs((m) => [...m, { role: "assistant", content: `${text}\n\nReference: ${id.slice(0, 8).toUpperCase()}` }]);
        }
        refreshLists();
        return;
      }
      await new Promise((r) => setTimeout(r, 2000));
    }
    setError("This is taking longer than usual. Send “where is my money?” to check again.");
  }

  function closeDrawer() { setDrawerOpen(false); menuBtnRef.current?.focus(); }

  // keep Tab inside the open drawer, and let Escape close it
  function trapTab(e: RKeyboardEvent<HTMLDivElement>) {
    if (e.key === "Escape") { closeDrawer(); return; }
    if (e.key !== "Tab") return;
    const els = Array.from(e.currentTarget.querySelectorAll<HTMLElement>("button, [href], input, [tabindex]:not([tabindex='-1'])")).filter((el) => !el.hasAttribute("disabled"));
    if (!els.length) return;
    const first = els[0], last = els[els.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  function clearTransferState() {
    setPending(null); setDetails(null); setCheckout(null); setCaptured(false); setTrack(null); setReceipt(""); setInput(""); setError("");
  }

  function newChat() {
    if (busy) return;
    setConversationId(null); setMsgs([GREETING]); clearTransferState();
    setDrawerOpen(false);
    inputRef.current?.focus();
  }

  async function openConversation(id: string) {
    if (busy) return;
    setError("");
    try {
      const r = await fetch(`/api/conversations/${id}`);
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      setConversationId(id);
      setMsgs([GREETING, ...(d.messages as Msg[]).map((m) => ({ role: m.role, content: m.content }))]);
      clearTransferState();
      setDrawerOpen(false);
      logRef.current?.focus();
    } catch (e) { setError(`Couldn't open that chat: ${(e as Error).message}`); }
  }

  async function deleteConversation(c: ConvoItem) {
    if (!window.confirm(`Delete the chat "${c.title}"? Its transactions and receipts are kept.`)) return;
    try {
      const r = await fetch(`/api/conversations/${c.id}`, { method: "DELETE" });
      if (!r.ok) throw new Error((await r.json()).error);
      if (c.id === conversationId) newChat();
      refreshLists();
    } catch (e) { setError(`Couldn't delete that chat: ${(e as Error).message}`); }
  }

  // Open a past transaction: its chat plus the live status card
  async function openTransfer(t: TransferItem) {
    if (busy) return;
    setError("");
    try {
      const r = await fetch(`/api/transfers/${t.id}`);
      const d: Tracking = await r.json();
      if (!r.ok) throw new Error("Transfer not found");
      const isDone = ["delivered", "failed"].includes(d.transfer.status);
      if (isDone) await fetch(`/api/transfers/${t.id}/receipt`, { method: "POST" }); // makes sure the receipt is in the chat history
      if (t.conversation_id) await openConversation(t.conversation_id);
      else { setConversationId(null); setMsgs([GREETING]); clearTransferState(); setDrawerOpen(false); }
      setCheckout({ transferId: t.id, orderId: "" });
      setTrack(d);
      if (!isDone) poll(t.id);
    } catch (e) { setError(`Couldn't open that transaction: ${(e as Error).message}`); }
  }

  function reset() {
    setTrack(null); setReceipt(""); setPending(null); setDetails(null); setCheckout(null); setCaptured(false); setError("");
    inputRef.current?.focus();
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl md:justify-center md:gap-4 md:p-4">
      <aside aria-label="Chat and transaction history" className="hidden w-72 shrink-0 flex-col overflow-hidden rounded-[2rem] bg-surface shadow-xl ring-1 ring-line md:flex md:h-[calc(100dvh-2rem)]">
        <h2 className="px-5 pb-1 pt-5 text-lg font-bold">History</h2>
        <HistoryPanel convos={convos} transfers={history} activeId={conversationId} tab={tab} onTab={setTab} onOpenConvo={openConversation} onOpenTransfer={openTransfer} onDelete={deleteConversation} onNew={newChat} />
      </aside>
      {drawerOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <button className="absolute inset-0 bg-black/40" aria-label="Close history" tabIndex={-1} onClick={closeDrawer} />
          <div role="dialog" aria-modal="true" aria-label="History" onKeyDown={trapTab} className="slide-up absolute inset-y-0 left-0 flex w-[85%] max-w-xs flex-col bg-surface shadow-xl">
            <div className="flex items-center justify-between px-5 pb-1 pt-4">
              <h2 ref={focusOnMount} tabIndex={-1} className="text-lg font-bold">History</h2>
              <button onClick={closeDrawer} aria-label="Close history" className="-mr-2 grid h-11 w-11 place-items-center rounded-full text-muted hover:text-foreground">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
              </button>
            </div>
            <HistoryPanel convos={convos} transfers={history} activeId={conversationId} tab={tab} onTab={setTab} onOpenConvo={openConversation} onOpenTransfer={openTransfer} onDelete={deleteConversation} onNew={newChat} />
          </div>
        </div>
      )}
    <main className="flex h-dvh min-w-0 flex-1 flex-col bg-background md:h-[calc(100dvh-2rem)] md:max-w-lg md:overflow-hidden md:rounded-[2rem] md:shadow-xl md:ring-1 md:ring-line">
      <p className="sr-only" role="status" aria-live="polite">{announce}</p>
      <div aria-hidden="true" className="kente weave h-2.5 shrink-0" />
      <header className="px-5 pb-3 pt-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <button ref={menuBtnRef} onClick={() => setDrawerOpen(true)} aria-haspopup="dialog" aria-expanded={drawerOpen} aria-label="Open history" className="-ml-2 grid h-11 w-11 place-items-center rounded-full text-muted hover:text-foreground md:hidden">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
            </button>
            <Mark />
            <div>
              <h1 className="font-display text-xl font-extrabold leading-none">Tuma</h1>
              <p className="text-xs text-muted">Send money in your language</p>
            </div>
          </div>
          <span className="rounded-full bg-warn-soft px-2.5 py-1 text-xs font-semibold text-warn">Sandbox: no real money</span>
        </div>
        <Stepper stage={stage} />
      </header>

      <div ref={logRef} className="cloth min-h-0 flex-1 space-y-3 overflow-y-auto px-4 pb-4" role="log" aria-live="polite" aria-label="Conversation with Tuma" tabIndex={0}>
        {msgs.length === 1 && <Welcome />}
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

        {pending && !checkout && !details && <RecipientForm p={pending} onSubmit={setDetails} onCancel={() => { setPending(null); inputRef.current?.focus(); }} />}
        {effective && !checkout && <QuoteCard p={effective} confirming={confirming} onConfirm={confirm} onChange={() => setDetails(null)} />}

        {pending && checkout && !captured && (
          <section className="slide-up card rounded-3xl bg-surface p-5 ring-1 ring-line" aria-label="Pay with PayPal" ref={focusOnMount} tabIndex={-1}>
            <p className="text-sm text-muted">You pay</p>
            <p className="text-3xl font-bold tabular-nums">{usd(pending.quote.totalUsdCents)}</p>
            <p className="mb-4 text-sm text-muted">to send {usd(pending.quote.amountUsdCents)} to <span className="capitalize">{(effective ?? pending).recipientName}</span>, including the {usd(pending.quote.feeUsdCents)} fee.</p>
            <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!, currency: "USD", locale: PAYPAL_LOCALE[String(pending?.language)] ?? "en_US" }}>
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
          <section className="slide-up card flex items-center gap-3 rounded-3xl bg-surface p-5 text-sm ring-1 ring-line" role="status">
            <span className="spinner h-5 w-5 rounded-full border-2 border-line border-t-brand" />
            Payment approved. Confirming with PayPal…
          </section>
        )}

        {track && (
          <section className="slide-up card rounded-3xl bg-surface p-5 ring-1 ring-line" aria-label="Transfer status" ref={focusOnMount} tabIndex={-1}>
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
            {finished && checkout && <p className="mt-3 text-xs text-muted">Reference <span className="select-all font-semibold text-foreground">{checkout.transferId.slice(0, 8).toUpperCase()}</span></p>}
            {finished && (
              <button onClick={reset} className="mt-4 w-full rounded-full bg-brand py-3 font-semibold text-on-brand transition active:scale-[.98]">Send another</button>
            )}
          </section>
        )}

        {error && <div role="alert" className="slide-up rounded-2xl bg-danger/10 p-3 text-sm text-danger">{error}</div>}
        <div ref={endRef} />
      </div>

      <footer className="edge-top bg-surface/80 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur">
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
    </div>
  );
}