module.exports = [
"[project]/src/instrumentation.ts [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Next.js runs register() once when the server starts. We use it to create the database tables
// automatically, so a missing migration can never break the chat. Set AUTO_MIGRATE=false to skip.
__turbopack_context__.s([
    "register",
    ()=>register
]);
async function register() {
    if (("TURBOPACK compile-time value", "nodejs") !== "nodejs" || process.env.AUTO_MIGRATE === "false") return;
    try {
        const { migrate } = await __turbopack_context__.A("[project]/src/lib/migrate.ts [instrumentation] (ecmascript, async loader)");
        await migrate();
        console.log("database ready");
    } catch (e) {
        console.error("automatic database setup failed:", e.message);
    }
}
}),
];

//# sourceMappingURL=src_instrumentation_ts_07j_8w1ivtswj._.js.map