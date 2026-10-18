module.exports = [
(()=>{"use strict";return[
"[project]/src/app/api/chat/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$agent$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/agent.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$agent$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$agent$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
async function POST(req) {
    try {
        const { messages, awaiting } = await req.json();
        if (!Array.isArray(messages) || !messages.length) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "messages required"
            }, {
                status: 400
            });
        }
        const clean = messages.slice(-20).map((m)=>({
                role: m.role === "assistant" ? "assistant" : "user",
                content: String(m.content).slice(0, 2000)
            }));
        const aw = awaiting && typeof awaiting.recipient === "string" && Number.isFinite(Number(awaiting.amountUsd)) ? {
            recipient: awaiting.recipient.slice(0, 60),
            amountUsd: Number(awaiting.amountUsd)
        } : null;
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$agent$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["runAgent"])(clean, {
            awaiting: aw
        }));
    } catch (e) {
        const status = e.status;
        const msg = status === 429 ? "The free AI quota is busy. Wait a few seconds and try again." : e.message;
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: msg
        }, {
            status: status === 429 ? 429 : 500
        });
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/lib/agent.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s([
    "runAgent",
    ()=>runAgent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$google$2f$genai$2f$dist$2f$node$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@google/genai/dist/node/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/db.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$quote$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/quote.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$receipt$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/receipt.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$gemini$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/gemini.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$receipt$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$receipt$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
const OWNER = "demo"; // single demo user; replace with real auth later
const SYSTEM = `You are Tuma, a friendly assistant that helps people abroad send money to family in Kenya through PayPal.

LANGUAGE
- The user may write or speak English, Swahili (including Sheng), French or Nigerian Pidgin, and may mix them. Always reply in the language of the user's latest message, in 1 or 2 short sentences.
- Set the language argument of prepare_quote to en, sw, fr or pcm to match.

UNDERSTANDING REQUESTS
- Amounts are US dollars. "dola", "dollars", "$" all mean USD. Convert number words to digits:
  Swahili: kumi 10, ishirini 20, thelathini 30, arobaini 40, hamsini 50, sitini 60, sabini 70, themanini 80, tisini 90, mia 100, mia mbili 200, mia tano 500; "ishirini na tano" is 25.
  French: vingt 20, trente 30, quarante 40, cinquante 50, cent 100. English/Pidgin: "fifty" 50, "one hundred" 100.
- If the user gives an amount in shillings, KES or "bob", do not convert it yourself. Ask for the amount in dollars.
- Family words are recipient names: mama/maman/mum/mother, baba/papa/dad, dada (sister), kaka (brother), bibi (grandmother).
- Examples: "Nitumie mama dola hamsini kwa kodi" means prepare_quote(mama, 50, purpose "kodi", sw). "Envoie quarante dollars à maman" means (mama, 40, fr). "Abeg send mama twenty dollars for rent" means (mama, 20, pcm).

RULES
- The recipient receives USD in their own PayPal account (they can withdraw it locally). Local-currency figures are indicative only.
- You can only PREPARE a transfer with prepare_quote. The app then shows a confirmation card. Never say money has been sent; tell the user to review the card and confirm.
- Never invent or calculate amounts, fees or exchange rates. Only repeat numbers returned by tools.
- The app collects the recipient's name and PayPal email in a form on screen, so do not ask for the email in chat. Call prepare_quote even when the recipient is new or has no email saved; the app then shows the form.
- Money only moves when the user presses "Confirm and pay" on the card and approves in PayPal. If the user says in chat that they reviewed, agree or confirm, do NOT say the transfer is processing or sent. Tell them to press the button on the card.
- For a receipt or "what happened to my transfer", call get_receipt or get_transfer_status. Only describe outcomes a tool returned; if a tool fails or returns nothing, say you couldn't find it and never invent one.
- If the amount or recipient is unclear, ask one short question.
- For "where is my money" questions, call get_transfer_status.
- Decline anything unrelated to sending money or checking a transfer.`;
const declarations = [
    {
        name: "find_recipient",
        description: "Look up a saved recipient by name or family word (e.g. mama, maman, baba).",
        parameters: {
            type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$google$2f$genai$2f$dist$2f$node$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Type"].OBJECT,
            properties: {
                name: {
                    type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$google$2f$genai$2f$dist$2f$node$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Type"].STRING
                }
            },
            required: [
                "name"
            ]
        }
    },
    {
        name: "save_recipient",
        description: "Save a new recipient identified by their PayPal email address.",
        parameters: {
            type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$google$2f$genai$2f$dist$2f$node$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Type"].OBJECT,
            properties: {
                name: {
                    type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$google$2f$genai$2f$dist$2f$node$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Type"].STRING
                },
                email: {
                    type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$google$2f$genai$2f$dist$2f$node$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Type"].STRING,
                    description: "The recipient's PayPal email address"
                },
                country: {
                    type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$google$2f$genai$2f$dist$2f$node$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Type"].STRING,
                    description: "ISO country code, default KE"
                }
            },
            required: [
                "name",
                "email"
            ]
        }
    },
    {
        name: "prepare_quote",
        description: "Prepare a transfer quote for the user to confirm. Does NOT move money.",
        parameters: {
            type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$google$2f$genai$2f$dist$2f$node$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Type"].OBJECT,
            properties: {
                recipient_name: {
                    type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$google$2f$genai$2f$dist$2f$node$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Type"].STRING
                },
                amount_usd: {
                    type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$google$2f$genai$2f$dist$2f$node$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Type"].NUMBER,
                    description: "Amount in USD the recipient should receive"
                },
                purpose: {
                    type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$google$2f$genai$2f$dist$2f$node$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Type"].STRING,
                    description: "Why they are sending, in the user's own words"
                },
                language: {
                    type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$google$2f$genai$2f$dist$2f$node$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Type"].STRING,
                    description: "User's language: en, sw, fr or pcm"
                }
            },
            required: [
                "recipient_name",
                "amount_usd",
                "language"
            ]
        }
    },
    {
        name: "get_transfer_status",
        description: "Get status and timeline of a transfer. Omit transfer_id for the latest one.",
        parameters: {
            type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$google$2f$genai$2f$dist$2f$node$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Type"].OBJECT,
            properties: {
                transfer_id: {
                    type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$google$2f$genai$2f$dist$2f$node$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Type"].STRING
                }
            }
        }
    },
    {
        name: "get_receipt",
        description: "Get the receipt of a finished transfer (delivered or failed). Omit transfer_id for the latest one.",
        parameters: {
            type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$google$2f$genai$2f$dist$2f$node$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Type"].OBJECT,
            properties: {
                transfer_id: {
                    type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$google$2f$genai$2f$dist$2f$node$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Type"].STRING
                }
            }
        }
    }
];
// "maman", "mum" and "mother" should all find a recipient saved as "mama".
const GROUPS = [
    [
        "mama",
        "maman",
        "mum",
        "mom",
        "mother",
        "mummy",
        "mami"
    ],
    [
        "baba",
        "papa",
        "dad",
        "daddy",
        "father"
    ]
];
const strip = (s)=>s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase();
const variants = (n)=>GROUPS.find((g)=>g.includes(strip(n))) ?? [
        strip(n)
    ];
async function findRecipient(name) {
    const r = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pool"].query("SELECT name, paypal_email, country FROM recipients WHERE owner=$1 AND lower(name)=ANY($2) LIMIT 1", [
        OWNER,
        variants(name)
    ]);
    return r.rows[0];
}
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
async function runTool(name, input, ctx) {
    try {
        if (name === "find_recipient") {
            const r = await findRecipient(String(input.name));
            return JSON.stringify(r ? {
                name: r.name,
                country: r.country,
                has_paypal_email: Boolean(r.paypal_email)
            } : {
                found: false
            });
        }
        if (name === "save_recipient") {
            const email = String(input.email).trim();
            if (!EMAIL.test(email)) return JSON.stringify({
                error: "That doesn't look like a valid email address."
            });
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pool"].query(`INSERT INTO recipients (owner, name, paypal_email, country) VALUES ($1,$2,$3,$4)
         ON CONFLICT (owner, lower(name)) DO UPDATE SET paypal_email=EXCLUDED.paypal_email`, [
                OWNER,
                strip(String(input.name)),
                email,
                String(input.country ?? "KE")
            ]);
            return JSON.stringify({
                saved: true
            });
        }
        if (name === "prepare_quote") {
            const r = await findRecipient(String(input.recipient_name));
            // A new recipient (or one with no usable email) is fine: the on-screen form collects the details.
            const email = r?.paypal_email && !r.paypal_email.startsWith("REPLACE") ? r.paypal_email : "";
            const recipientName = r?.name ?? String(input.recipient_name).trim();
            const country = r?.country ?? "KE";
            const amountUsd = Number(input.amount_usd);
            const quote = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$quote$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getQuote"])(Math.round(amountUsd * 100), country);
            ctx.pending = {
                senderName: "Demo Sender",
                recipientName,
                recipientEmail: email,
                country,
                purpose: input.purpose ? String(input.purpose) : null,
                language: String(input.language ?? "en"),
                amountUsd,
                quote
            };
            return JSON.stringify({
                ok: true,
                recipient: recipientName,
                details_needed: !email,
                amount_usd: amountUsd,
                fee_usd: quote.feeUsdCents / 100,
                total_usd: quote.totalUsdCents / 100,
                fx_rate_indicative: quote.fxRate,
                recipient_receives: `${amountUsd} USD in their PayPal account (about ${quote.payoutLocalAmount} ${quote.payoutCurrency}, indicative)`,
                note: "The app now shows the user a form for the recipient's name and PayPal email, then a review card. Do not ask for the email in chat."
            });
        }
        if (name === "get_transfer_status") {
            const r = input.transfer_id ? await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pool"].query("SELECT * FROM transfers WHERE id=$1", [
                String(input.transfer_id)
            ]) : await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pool"].query("SELECT * FROM transfers ORDER BY created_at DESC LIMIT 1");
            if (!r.rowCount) return JSON.stringify({
                found: false
            });
            const t = r.rows[0];
            const ev = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pool"].query("SELECT to_status, created_at FROM transfer_events WHERE transfer_id=$1 ORDER BY id", [
                t.id
            ]);
            return JSON.stringify({
                id: t.id,
                recipient: t.recipient_name,
                status: t.status,
                amount_usd: t.amount_usd_cents / 100,
                timeline: ev.rows
            });
        }
        if (name === "get_receipt") {
            const r = input.transfer_id ? await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pool"].query("SELECT id, status FROM transfers WHERE id=$1", [
                String(input.transfer_id)
            ]) : await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pool"].query("SELECT id, status FROM transfers ORDER BY created_at DESC LIMIT 1");
            if (!r.rowCount) return JSON.stringify({
                found: false
            });
            const { id, status } = r.rows[0];
            if (![
                "delivered",
                "failed"
            ].includes(status)) return JSON.stringify({
                status,
                note: "This transfer isn't finished yet, so there is no receipt. Tell the user its current status."
            });
            return JSON.stringify({
                status,
                reference: String(id).slice(0, 8).toUpperCase(),
                receipt: await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$receipt$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getReceipt"])(id)
            });
        }
        return JSON.stringify({
            error: "Unknown tool"
        });
    } catch (e) {
        console.error(`tool ${name} failed:`, e.message); // shows the real cause in the npm run dev terminal
        return JSON.stringify({
            error: e.message
        });
    }
}
async function runAgent(history, opts = {}) {
    // Gemini wants the conversation to start with the user, so drop the leading assistant greeting.
    const first = history.findIndex((m)=>m.role === "user");
    const contents = history.slice(Math.max(first, 0)).map((m)=>({
            role: m.role === "assistant" ? "model" : "user",
            parts: [
                {
                    text: m.content
                }
            ]
        }));
    const ctx = {
        pending: null
    };
    // The UI tells us when a quote is on screen so the model never claims it was already paid
    const awaitingNote = opts.awaiting ? `\n\nCURRENT STATE: A quote of $${opts.awaiting.amountUsd} for ${opts.awaiting.recipient} is on screen, waiting for the user to press "Confirm and pay". Nothing has been paid or sent yet.` : "";
    let models = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$gemini$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["MODELS"];
    for(let i = 0; i < 6; i++){
        const { res, model } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$gemini$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generate"])({
            contents,
            config: {
                systemInstruction: SYSTEM + awaitingNote,
                tools: [
                    {
                        functionDeclarations: declarations
                    }
                ],
                thinkingConfig: {
                    thinkingLevel: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$google$2f$genai$2f$dist$2f$node$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ThinkingLevel"].LOW
                }
            }
        }, models);
        models = [
            model
        ]; // stay on the model that worked for the rest of this turn
        const calls = res.functionCalls ?? [];
        if (!calls.length) {
            return {
                reply: (res.text ?? "").trim() || "Sorry, I didn't catch that. Could you say it again?",
                pending: ctx.pending
            };
        }
        const modelContent = res.candidates?.[0]?.content;
        if (modelContent) contents.push(modelContent);
        const parts = [];
        for (const c of calls){
            const out = await runTool(c.name ?? "", c.args ?? {}, ctx);
            parts.push({
                functionResponse: {
                    name: c.name,
                    response: {
                        output: JSON.parse(out)
                    }
                }
            });
        }
        contents.push({
            role: "user",
            parts
        });
    }
    return {
        reply: "Sorry, I couldn't finish that. Please try again.",
        pending: ctx.pending
    };
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/lib/db.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s([
    "pool",
    ()=>pool
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$pg$29$__ = __turbopack_context__.i("[externals]/pg [external] (pg, esm_import, [project]/node_modules/pg)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$pg$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$pg$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
const globalForPg = globalThis;
const pool = globalForPg.pool ?? new __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$pg$29$__["Pool"]({
    connectionString: process.env.DATABASE_URL
});
if ("TURBOPACK compile-time truthy", 1) globalForPg.pool = pool;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/lib/gemini.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MODELS",
    ()=>MODELS,
    "ai",
    ()=>ai,
    "generate",
    ()=>generate
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$google$2f$genai$2f$dist$2f$node$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@google/genai/dist/node/index.mjs [app-route] (ecmascript)");
;
const ai = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$google$2f$genai$2f$dist$2f$node$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["GoogleGenAI"]({
    apiKey: process.env.GEMINI_API_KEY
});
const MODELS = [
    process.env.GEMINI_MODEL ?? "gemini-3.8-flash",
    process.env.GEMINI_FALLBACK_MODEL ?? "gemini-3.5-flash-lite"
];
async function generate(req, models = MODELS) {
    let last;
    for (const model of models){
        try {
            const res = await ai.models.generateContent({
                ...req,
                model
            });
            return {
                res,
                model
            };
        } catch (e) {
            last = e;
            const status = e.status;
            // 404 = this model was retired or isn't available to this key, so try the next one
            if (![
                404,
                429,
                500,
                503
            ].includes(status)) throw e;
        }
    }
    throw last;
}
}),
"[project]/src/lib/quote.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getQuote",
    ()=>getQuote
]);
// Indicative demo rates. Replace with a live FX API later; always label as indicative.
const RATES = {
    KE: {
        currency: "KES",
        perUsd: 129.0
    }
};
function getQuote(amountUsdCents, country = "KE") {
    if (!Number.isInteger(amountUsdCents) || amountUsdCents < 100 || amountUsdCents > 100_000) {
        throw new Error("Amount must be between $1 and $1,000");
    }
    const rate = RATES[country];
    if (!rate) throw new Error(`Unsupported destination: ${country}`);
    // Demo fee: 1.5% + $0.30
    const feeUsdCents = Math.round(amountUsdCents * 0.015) + 30;
    const payoutLocalAmount = Math.round(amountUsdCents / 100 * rate.perUsd * 100) / 100;
    return {
        amountUsdCents,
        feeUsdCents,
        totalUsdCents: amountUsdCents + feeUsdCents,
        fxRate: rate.perUsd,
        payoutCurrency: rate.currency,
        payoutLocalAmount
    };
}
}),
"[project]/src/lib/receipt.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s([
    "getReceipt",
    ()=>getReceipt
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$google$2f$genai$2f$dist$2f$node$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@google/genai/dist/node/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/db.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$gemini$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/gemini.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
const LANGS = {
    en: "English",
    sw: "Swahili",
    fr: "French",
    pcm: "Nigerian Pidgin"
};
async function getReceipt(transferId) {
    const r = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pool"].query("SELECT * FROM transfers WHERE id=$1", [
        transferId
    ]);
    const t = r.rows[0];
    if (!t || ![
        "delivered",
        "failed"
    ].includes(t.status)) return null;
    if (t.receipt_text) return t.receipt_text;
    const amount = t.amount_usd_cents / 100;
    const total = (t.amount_usd_cents + t.fee_usd_cents) / 100;
    let facts;
    let fallback;
    if (t.status === "delivered") {
        facts = {
            outcome: "delivered",
            recipient: t.recipient_name,
            amount_usd: amount,
            fee_usd: t.fee_usd_cents / 100,
            total_paid_usd: total,
            indicative_kes: Number(t.payout_local_amount)
        };
        fallback = `Delivered: ${t.recipient_name} received $${amount.toFixed(2)} in their PayPal account. You paid $${total.toFixed(2)} including fees.`;
    } else {
        const ev = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pool"].query("SELECT detail FROM transfer_events WHERE transfer_id=$1 AND to_status='failed' ORDER BY id DESC LIMIT 1", [
            transferId
        ]);
        const refunded = Boolean(ev.rows[0]?.detail?.refunded);
        facts = {
            outcome: "failed",
            recipient: t.recipient_name,
            total_paid_usd: total,
            refunded
        };
        fallback = refunded ? `The transfer to ${t.recipient_name} could not be completed. Your $${total.toFixed(2)} was refunded to PayPal.` : `The transfer to ${t.recipient_name} could not be completed and we could not confirm a refund automatically. Please contact support.`;
    }
    let text = fallback;
    try {
        const { res } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$gemini$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generate"])({
            contents: [
                {
                    role: "user",
                    parts: [
                        {
                            text: JSON.stringify(facts)
                        }
                    ]
                }
            ],
            config: {
                thinkingConfig: {
                    thinkingLevel: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$google$2f$genai$2f$dist$2f$node$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ThinkingLevel"].LOW
                },
                systemInstruction: `You write short, warm payment receipts (max 3 sentences, plain text, no markdown) in ${LANGS[t.language] ?? "English"}. Use ONLY the facts given. Never invent or recompute numbers. If the outcome is failed, apologise briefly and say whether the money was refunded.`
            }
        });
        const out = (res.text ?? "").trim();
        if (out) text = out;
    } catch (e) {
        console.error("receipt generation failed", e.message);
    }
    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pool"].query("UPDATE transfers SET receipt_text=$2 WHERE id=$1", [
        transferId,
        text
    ]);
    return text;
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
]})(),
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[externals]/child_process [external] (child_process, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("child_process", () => require("child_process"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/fs/promises [external] (fs/promises, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("fs/promises", () => require("fs/promises"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/net [external] (net, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("net", () => require("net"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/runtime-reacts.external.js [external] (next/dist/server/runtime-reacts.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/runtime-reacts.external.js", () => require("next/dist/server/runtime-reacts.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/node:stream [external] (node:stream, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:stream", () => require("node:stream"));

module.exports = mod;
}),
"[externals]/node:stream/promises [external] (node:stream/promises, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:stream/promises", () => require("node:stream/promises"));

module.exports = mod;
}),
"[externals]/os [external] (os, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("os", () => require("os"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/process [external] (process, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("process", () => require("process"));

module.exports = mod;
}),
"[externals]/querystring [external] (querystring, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("querystring", () => require("querystring"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/tls [external] (tls, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("tls", () => require("tls"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__00c445nbbjfkw._.js.map