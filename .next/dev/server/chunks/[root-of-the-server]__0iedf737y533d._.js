module.exports = [
(()=>{"use strict";return[
"[project]/src/app/api/transfers/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/db.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$quote$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/quote.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$paypal$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/paypal.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$transfers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/transfers.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$conversations$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/conversations.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$transfers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$conversations$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$transfers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$conversations$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
;
async function GET() {
    try {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            transfers: await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$conversations$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["listTransfers"])()
        });
    } catch (e) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: e.message
        }, {
            status: 500
        });
    }
}
async function POST(req) {
    try {
        const b = await req.json();
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(b.recipientEmail))) throw new Error("Recipient PayPal email required");
        const q = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$quote$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getQuote"])(Math.round(Number(b.amountUsd) * 100), b.country ?? "KE");
        const ins = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pool"].query(`INSERT INTO transfers (sender_name, recipient_name, recipient_email, recipient_country,
         amount_usd_cents, fee_usd_cents, fx_rate, payout_local_amount, payout_currency, purpose, language, conversation_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11, (SELECT id FROM conversations WHERE id = $12::uuid)) RETURNING id`, [
            b.senderName ?? "Sender",
            b.recipientName,
            b.recipientEmail,
            b.country ?? "KE",
            q.amountUsdCents,
            q.feeUsdCents,
            q.fxRate,
            q.payoutLocalAmount,
            q.payoutCurrency,
            b.purpose ?? null,
            b.language ?? "en",
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$conversations$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isUuid"])(b.conversationId) ? b.conversationId : null
        ]);
        const id = ins.rows[0].id;
        const order = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$paypal$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createOrder"])(id, q.totalUsdCents, `Transfer to ${b.recipientName}`);
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pool"].query("UPDATE transfers SET paypal_order_id=$2 WHERE id=$1", [
            id,
            order.id
        ]);
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$transfers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["transition"])(id, "awaiting_payment", {
            orderId: order.id
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            transferId: id,
            orderId: order.id,
            quote: q
        });
    } catch (e) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: e.message
        }, {
            status: 400
        });
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/lib/conversations.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s([
    "deleteConversation",
    ()=>deleteConversation,
    "getConversation",
    ()=>getConversation,
    "isUuid",
    ()=>isUuid,
    "listConversations",
    ()=>listConversations,
    "listTransfers",
    ()=>listTransfers,
    "saveTurn",
    ()=>saveTurn,
    "titleFrom",
    ()=>titleFrom
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/db.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
const OWNER = "demo"; // single demo user, like recipients; add real auth before using this with real people
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const isUuid = (s)=>typeof s === "string" && UUID.test(s);
function titleFrom(text) {
    const t = text.replace(/\s+/g, " ").trim();
    return !t ? "New chat" : t.length > 48 ? `${t.slice(0, 47)}…` : t;
}
async function saveTurn(conversationId, userText, assistantText) {
    try {
        let id = null;
        if (isUuid(conversationId)) {
            const r = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pool"].query("UPDATE conversations SET updated_at = now() WHERE id = $1 AND owner = $2 RETURNING id", [
                conversationId,
                OWNER
            ]);
            if (r.rows[0]) id = r.rows[0].id;
        }
        if (!id) {
            const r = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pool"].query("INSERT INTO conversations (owner, title) VALUES ($1, $2) RETURNING id", [
                OWNER,
                titleFrom(userText)
            ]);
            id = r.rows[0].id;
        }
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pool"].query("INSERT INTO messages (conversation_id, role, content) VALUES ($1, 'user', $2), ($1, 'assistant', $3)", [
            id,
            userText,
            assistantText
        ]);
        return id;
    } catch (e) {
        console.error("saving the conversation failed:", e.message); // the chat itself keeps working
        return null;
    }
}
async function listConversations() {
    const r = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pool"].query("SELECT id, title, updated_at FROM conversations WHERE owner = $1 ORDER BY updated_at DESC LIMIT 50", [
        OWNER
    ]);
    return r.rows;
}
async function getConversation(id) {
    if (!isUuid(id)) return null;
    const c = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pool"].query("SELECT id, title, created_at, updated_at FROM conversations WHERE id = $1 AND owner = $2", [
        id,
        OWNER
    ]);
    if (!c.rows[0]) return null;
    const m = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pool"].query("SELECT role, content, created_at FROM messages WHERE conversation_id = $1 ORDER BY id", [
        id
    ]);
    const t = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pool"].query("SELECT id, recipient_name, amount_usd_cents, status, created_at FROM transfers WHERE conversation_id = $1 AND status <> 'draft' ORDER BY created_at", [
        id
    ]);
    return {
        conversation: c.rows[0],
        messages: m.rows,
        transfers: t.rows
    };
}
async function deleteConversation(id) {
    if (!isUuid(id)) return false;
    const r = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pool"].query("DELETE FROM conversations WHERE id = $1 AND owner = $2", [
        id,
        OWNER
    ]);
    return (r.rowCount ?? 0) > 0;
}
async function listTransfers() {
    const r = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pool"].query(`SELECT id, recipient_name, amount_usd_cents, fee_usd_cents, status, created_at, conversation_id
       FROM transfers WHERE status <> 'draft' ORDER BY created_at DESC LIMIT 50`);
    return r.rows;
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
"[project]/src/lib/paypal.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PayPalError",
    ()=>PayPalError,
    "captureOrder",
    ()=>captureOrder,
    "createOrder",
    ()=>createOrder,
    "createPayout",
    ()=>createPayout,
    "getPayoutBatch",
    ()=>getPayoutBatch,
    "refundCapture",
    ()=>refundCapture,
    "verifyWebhook",
    ()=>verifyWebhook
]);
class PayPalError extends Error {
    status;
    constructor(status, message){
        super(message), this.status = status;
    }
}
const BASE = process.env.PAYPAL_API_BASE ?? "https://api-m.sandbox.paypal.com";
async function accessToken() {
    const creds = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString("base64");
    const res = await fetch(`${BASE}/v1/oauth2/token`, {
        method: "POST",
        headers: {
            Authorization: `Basic ${creds}`,
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: "grant_type=client_credentials",
        cache: "no-store"
    });
    if (!res.ok) throw new Error(`PayPal auth failed: ${res.status}`);
    return (await res.json()).access_token;
}
async function pp(path, init = {}) {
    const token = await accessToken();
    const res = await fetch(`${BASE}${path}`, {
        ...init,
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            ...init.requestId ? {
                "PayPal-Request-Id": init.requestId
            } : {}
        },
        cache: "no-store"
    });
    const body = await res.json().catch(()=>({}));
    if (!res.ok) throw new PayPalError(res.status, `PayPal ${path} ${res.status}: ${JSON.stringify(body)}`);
    return body;
}
const usd = (cents)=>(cents / 100).toFixed(2);
function createOrder(transferId, totalUsdCents, description) {
    return pp("/v2/checkout/orders", {
        method: "POST",
        requestId: `order-${transferId}`,
        body: JSON.stringify({
            intent: "CAPTURE",
            purchase_units: [
                {
                    custom_id: transferId,
                    description: description.slice(0, 120),
                    amount: {
                        currency_code: "USD",
                        value: usd(totalUsdCents)
                    }
                }
            ]
        })
    });
}
function captureOrder(orderId) {
    return pp(`/v2/checkout/orders/${orderId}/capture`, {
        method: "POST",
        requestId: `capture-${orderId}`,
        body: "{}"
    });
}
async function verifyWebhook(headers, rawBody) {
    const result = await pp("/v1/notifications/verify-webhook-signature", {
        method: "POST",
        body: JSON.stringify({
            auth_algo: headers.get("paypal-auth-algo"),
            cert_url: headers.get("paypal-cert-url"),
            transmission_id: headers.get("paypal-transmission-id"),
            transmission_sig: headers.get("paypal-transmission-sig"),
            transmission_time: headers.get("paypal-transmission-time"),
            webhook_id: process.env.PAYPAL_WEBHOOK_ID,
            webhook_event: JSON.parse(rawBody)
        })
    });
    return result.verification_status === "SUCCESS";
}
function createPayout(transferId, email, amountUsdCents, note) {
    return pp("/v1/payments/payouts", {
        method: "POST",
        requestId: `payout-${transferId}`,
        body: JSON.stringify({
            sender_batch_header: {
                sender_batch_id: `tuma-${transferId}`,
                email_subject: "You received money via Tuma",
                email_message: "Someone sent you money with Tuma."
            },
            items: [
                {
                    recipient_type: "EMAIL",
                    receiver: email,
                    sender_item_id: transferId,
                    note: note.slice(0, 200),
                    amount: {
                        currency_code: "USD",
                        value: usd(amountUsdCents)
                    }
                }
            ]
        })
    });
}
function getPayoutBatch(batchId) {
    return pp(`/v1/payments/payouts/${batchId}`);
}
function refundCapture(captureId, transferId) {
    return pp(`/v2/payments/captures/${captureId}/refund`, {
        method: "POST",
        requestId: `refund-${transferId}`,
        body: "{}"
    });
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
"[project]/src/lib/transfers.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s([
    "transition",
    ()=>transition
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/db.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
const ALLOWED = {
    draft: [
        "awaiting_payment",
        "failed"
    ],
    awaiting_payment: [
        "paid",
        "failed"
    ],
    paid: [
        "payout_pending",
        "failed"
    ],
    payout_pending: [
        "delivered",
        "failed"
    ],
    delivered: [],
    failed: []
};
async function transition(transferId, to, detail = {}, extra = {}) {
    const client = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pool"].connect();
    try {
        await client.query("BEGIN");
        const cur = await client.query("SELECT status FROM transfers WHERE id=$1 FOR UPDATE", [
            transferId
        ]);
        if (!cur.rowCount) throw new Error("Transfer not found");
        const from = cur.rows[0].status;
        if (from === to) {
            await client.query("COMMIT");
            return;
        }
        if (!ALLOWED[from].includes(to)) throw new Error(`Illegal transition ${from} -> ${to}`);
        const sets = [
            "status=$2",
            "updated_at=now()"
        ];
        const vals = [
            transferId,
            to
        ];
        for (const [col, v] of Object.entries(extra)){
            if (![
                "paypal_order_id",
                "paypal_capture_id",
                "payout_batch_id"
            ].includes(col)) throw new Error("bad column");
            vals.push(v);
            sets.push(`${col}=$${vals.length}`);
        }
        await client.query(`UPDATE transfers SET ${sets.join(", ")} WHERE id=$1`, vals);
        await client.query("INSERT INTO transfer_events (transfer_id, from_status, to_status, detail) VALUES ($1,$2,$3,$4)", [
            transferId,
            from,
            to,
            JSON.stringify(detail)
        ]);
        await client.query("COMMIT");
    } catch (e) {
        await client.query("ROLLBACK");
        throw e;
    } finally{
        client.release();
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
]})(),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("crypto", () => require("crypto"));

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
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0iedf737y533d._.js.map