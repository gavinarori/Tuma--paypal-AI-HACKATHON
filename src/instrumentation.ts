// Next.js runs register() once when the server starts. We use it to create the database tables
// automatically, so a missing migration can never break the chat. Set AUTO_MIGRATE=false to skip.
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs" || process.env.AUTO_MIGRATE === "false") return;
  try {
    const { migrate } = await import("./lib/migrate");
    await migrate();
    console.log("database ready");
  } catch (e) {
    console.error("automatic database setup failed:", (e as Error).message);
  }
}