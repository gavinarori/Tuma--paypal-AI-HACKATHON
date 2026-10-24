(()=>{"use strict";module.exports = [
"[project]/src/app/api/paypal/webhook/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/db.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$paypal$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/lib/paypal.ts [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$transfers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/transfers.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$payout$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/payout.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$paypal$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$transfers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$payout$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$paypal$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$transfers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$payout$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
async function POST(req) {
    const raw = await req.text();
    if (!await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$paypal$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["verifyWebhook"])(req.headers, raw)) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Invalid signature"
        }, {
            status: 401
        });
    }
    const event = JSON.parse(raw);
    // Idempotency: ignore events we've already processed
    const seen = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pool"].query("INSERT INTO webhook_events (id) VALUES ($1) ON CONFLICT DO NOTHING RETURNING id", [
        event.id
    ]);
    if (!seen.rowCount) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        ok: true,
        duplicate: true
    });
    if (event.event_type === "PAYMENT.CAPTURE.COMPLETED") {
        const transferId = event.resource?.custom_id;
        if (transferId) {
            // Capture route may have already moved it to paid; transition() is a no-op then.
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$transfers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["transition"])(transferId, "paid", {
                via: "webhook"
            }, {
                paypal_capture_id: event.resource.id
            }).catch(()=>{});
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$payout$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["startPayout"])(transferId).catch(()=>{});
        }
    }
    if (String(event.event_type).startsWith("PAYMENT.PAYOUTS-ITEM.")) {
        const batchId = event.resource?.payout_batch_id;
        if (batchId) {
            const r = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pool"].query("SELECT id FROM transfers WHERE payout_batch_id=$1", [
                batchId
            ]);
            if (r.rowCount) await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$payout$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["syncPayout"])(r.rows[0].id).catch(()=>{});
        }
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        ok: true
    });
}
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
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$paypal$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/lib/paypal.ts [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$paypal$2d$error$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/paypal-error.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$transfers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/transfers.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$paypal$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$transfers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$paypal$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$transfers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
/** Payment was captured but the payout cannot complete: refund the sender and mark failed. */ async function failAndRefund(t, reason) {
    let refundId = null;
    try {
        if (t.paypal_capture_id) refundId = (await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$paypal$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["refundCapture"])(t.paypal_capture_id, t.id)).id;
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
        const batch = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$paypal$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createPayout"])(t.id, t.recipient_email, t.amount_usd_cents, `Transfer from ${t.sender_name} via Tuma`);
        const batchId = batch.batch_header.payout_batch_id;
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$transfers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["transition"])(t.id, "payout_pending", {
            batchId
        }, {
            payout_batch_id: batchId
        });
    } catch (e) {
        const permanent = e instanceof __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$paypal$2d$error$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PayPalError"] && e.status >= 400 && e.status < 500 && e.status !== 429;
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
    const batch = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$paypal$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getPayoutBatch"])(t.payout_batch_id);
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
];})()

//# sourceMappingURL=src_1ugw3o_jh2-b-._.js.map