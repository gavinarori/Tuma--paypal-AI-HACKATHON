module.exports = [
(()=>{"use strict";return[
"[project]/src/app/api/health/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
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
;
async function GET() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const env = process.env;
    const checks = [];
    const add = (name, ok, detail, fix)=>checks.push({
            name,
            ok,
            detail,
            ...ok || !fix ? {} : {
                fix
            }
        });
    for (const k of [
        "DATABASE_URL",
        "PAYPAL_CLIENT_ID",
        "PAYPAL_CLIENT_SECRET",
        "NEXT_PUBLIC_PAYPAL_CLIENT_ID",
        "GEMINI_API_KEY"
    ]){
        const set = Boolean(env[k]?.trim());
        add(`Setting ${k}`, set, set ? "set" : "missing", `Add ${k} to .env.local, then restart npm run dev`);
    }
    if (env.PAYPAL_CLIENT_ID && ("TURBOPACK compile-time value", "Ad15u4BqG4AF1bGzRx-VKmgma3BTYwQhRSnOg9EOkslvNeuc6ZxlbCQ2Pb2s3S-xA93p2DkLSIAEOFCM") && env.PAYPAL_CLIENT_ID.trim() !== ("TURBOPACK compile-time value", "Ad15u4BqG4AF1bGzRx-VKmgma3BTYwQhRSnOg9EOkslvNeuc6ZxlbCQ2Pb2s3S-xA93p2DkLSIAEOFCM").trim()) {
        add("NEXT_PUBLIC_PAYPAL_CLIENT_ID matches PAYPAL_CLIENT_ID", false, "different values", "Both must be the same sandbox client ID");
    }
    const base = (env.PAYPAL_API_BASE ?? "https://api-m.sandbox.paypal.com").trim();
    const baseOk = /^https:\/\/api-m\.(sandbox\.)?paypal\.com$/.test(base);
    add("Setting PAYPAL_API_BASE", baseOk, base, "Use https://api-m.sandbox.paypal.com (not sandbox.paypal.com)");
    // Database: reachable, migrated, and a usable demo recipient
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pool"].query("SELECT 1");
        add("Database connection", true, "connected");
        const t = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pool"].query("SELECT table_name FROM information_schema.tables WHERE table_schema='public'");
        const tables = new Set(t.rows.map((r)=>r.table_name));
        const missingTables = [
            "transfers",
            "transfer_events",
            "webhook_events",
            "recipients",
            "conversations",
            "messages"
        ].filter((x)=>!tables.has(x));
        add("Database tables", !missingTables.length, missingTables.length ? `missing: ${missingTables.join(", ")}` : "all present", "Restart npm run dev: the tables are created automatically on start. If this stays red, look for 'automatic database setup failed' in the terminal.");
        if (!missingTables.length) {
            const c = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pool"].query("SELECT table_name || '.' || column_name AS c FROM information_schema.columns WHERE table_schema='public'");
            const cols = new Set(c.rows.map((r)=>r.c));
            const missingCols = [
                "recipients.paypal_email",
                "transfers.recipient_email",
                "transfers.payout_batch_id",
                "transfers.receipt_text",
                "transfers.conversation_id"
            ].filter((x)=>!cols.has(x));
            add("Database columns", !missingCols.length, missingCols.length ? `missing: ${missingCols.join(", ")}` : "up to date", "Restart npm run dev: the tables are created automatically on start. If this stays red, look for 'automatic database setup failed' in the terminal.");
            if (!missingCols.length) {
                const r = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pool"].query("SELECT name, paypal_email FROM recipients WHERE owner='demo' ORDER BY name");
                const usable = r.rows.filter((x)=>x.paypal_email && !String(x.paypal_email).startsWith("REPLACE"));
                add("Recipient with a PayPal email", usable.length > 0, usable.length ? usable.map((x)=>x.name).join(", ") : "none yet", "Chat \"Send $10 to mama\" and give the email when Tuma asks, or run: UPDATE recipients SET paypal_email='<sandbox personal email>' WHERE lower(name)='mama';");
            }
        }
    } catch (e) {
        add("Database connection", false, e.message, "Start Postgres and make sure DATABASE_URL points at a database that exists");
    }
    // PayPal sandbox login
    if (baseOk && env.PAYPAL_CLIENT_ID && env.PAYPAL_CLIENT_SECRET) {
        try {
            const res = await fetch(`${base}/v1/oauth2/token`, {
                method: "POST",
                headers: {
                    Authorization: `Basic ${Buffer.from(`${env.PAYPAL_CLIENT_ID}:${env.PAYPAL_CLIENT_SECRET}`).toString("base64")}`,
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: "grant_type=client_credentials",
                cache: "no-store"
            });
            add("PayPal sandbox login", res.ok, res.ok ? "credentials accepted" : `PayPal answered ${res.status}`, "Use the Client ID and Secret of a Sandbox app from developer.paypal.com");
        } catch (e) {
            add("PayPal sandbox login", false, e.message, "Check your internet connection");
        }
    }
    // Gemini
    if (env.GEMINI_API_KEY?.trim()) {
        try {
            const { res, model } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$gemini$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generate"])({
                contents: [
                    {
                        role: "user",
                        parts: [
                            {
                                text: "Reply with the single word OK"
                            }
                        ]
                    }
                ],
                config: {
                    thinkingConfig: {
                        thinkingLevel: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$google$2f$genai$2f$dist$2f$node$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ThinkingLevel"].LOW
                    }
                }
            });
            add("Gemini", true, `answered with ${model}${res.text ? "" : " (empty text)"}`);
        } catch (e) {
            const status = e.status;
            add("Gemini", false, status === 404 ? "model not available" : status === 429 ? "free quota is busy right now" : status === 400 || status === 401 || status === 403 ? "API key rejected" : e.message.slice(0, 160), status === 404 ? "Set GEMINI_MODEL=gemini-3.8-flash and GEMINI_FALLBACK_MODEL=gemini-3.5-flash-lite" : "Create a key in Google AI Studio and put it in GEMINI_API_KEY");
        }
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        ok: checks.every((c)=>c.ok),
        checks
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

//# sourceMappingURL=%5Broot-of-the-server%5D__0-_la4c44za9d._.js.map