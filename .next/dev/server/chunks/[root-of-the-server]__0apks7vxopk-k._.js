module.exports = [
(()=>{"use strict";return[
"[project]/src/app/api/transfers/[id]/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/db.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$payout$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/payout.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$payout$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$payout$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
async function GET(_, { params }) {
    const { id } = await params;
    // Advance payout state on each poll so the demo works even without payout webhooks
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$payout$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["startPayout"])(id).catch(()=>{});
    const payoutStatus = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$payout$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["syncPayout"])(id).catch(()=>null);
    const t = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pool"].query("SELECT id, recipient_name, status, amount_usd_cents, payout_local_amount, payout_currency FROM transfers WHERE id=$1", [
        id
    ]);
    if (!t.rowCount) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        error: "Not found"
    }, {
        status: 404
    });
    const ev = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pool"].query("SELECT to_status, created_at FROM transfer_events WHERE transfer_id=$1 ORDER BY id", [
        id
    ]);
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        transfer: t.rows[0],
        events: ev.rows,
        payoutStatus
    });
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
"[project]/src/lib/payout.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s([
    "startPayout",
    ()=>startPayout,
    "syncPayout",
    ()=>syncPayout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/db.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$paypal$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/paypal.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$transfers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/transfers.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$transfers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$transfers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
/** Payment was captured but the payout cannot complete: refund the sender and mark failed. */ async function failAndRefund(t, reason) {
    let refundId = null;
    try {
        if (t.paypal_capture_id) refundId = (await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$paypal$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["refundCapture"])(t.paypal_capture_id, t.id)).id;
    } catch (e) {
        console.error("refund failed", t.id, e.message); // recorded below as refunded:false
    }
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$transfers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["transition"])(t.id, "failed", {
        reason,
        refundId,
        refunded: Boolean(refundId)
    });
}
async function startPayout(transferId) {
    const r = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pool"].query("SELECT * FROM transfers WHERE id=$1", [
        transferId
    ]);
    const t = r.rows[0];
    if (!t || t.status !== "paid" || t.payout_batch_id || !t.recipient_email) return;
    try {
        const batch = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$paypal$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createPayout"])(t.id, t.recipient_email, t.amount_usd_cents, `Transfer from ${t.sender_name} via Tuma`);
        const batchId = batch.batch_header.payout_batch_id;
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$transfers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["transition"])(t.id, "payout_pending", {
            batchId
        }, {
            payout_batch_id: batchId
        });
    } catch (e) {
        const permanent = e instanceof __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$paypal$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PayPalError"] && e.status >= 400 && e.status < 500 && e.status !== 429;
        if (permanent) await failAndRefund(t, "payout_rejected");
        else console.error("payout error (will retry)", transferId, e.message); // stays "paid"
    }
}
async function syncPayout(transferId) {
    const r = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pool"].query("SELECT status, payout_batch_id, paypal_capture_id FROM transfers WHERE id=$1", [
        transferId
    ]);
    const t = r.rows[0];
    if (!t || t.status !== "payout_pending" || !t.payout_batch_id) return null;
    const batch = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$paypal$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getPayoutBatch"])(t.payout_batch_id);
    const s = batch.items?.[0]?.transaction_status ?? null;
    if (s === "SUCCESS") await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$transfers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["transition"])(transferId, "delivered", {
        payoutStatus: s
    });
    else if (s && [
        "FAILED",
        "RETURNED",
        "BLOCKED",
        "REFUNDED",
        "REVERSED"
    ].includes(s)) await failAndRefund({
        id: transferId,
        paypal_capture_id: t.paypal_capture_id
    }, `payout_${s.toLowerCase()}`);
    return s; // UNCLAIMED / PENDING / ONHOLD stay pending
}
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

//# sourceMappingURL=%5Broot-of-the-server%5D__0apks7vxopk-k._.js.map