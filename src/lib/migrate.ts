import fs from "node:fs";
import path from "node:path";
import { pool } from "./db";

// Every file is idempotent (IF NOT EXISTS / ON CONFLICT), so this is safe to run on every start.
const FILES = ["schema.sql", "002_recipients.sql", "003_paypal_payouts.sql", "004_receipts.sql", "005_conversations.sql"];

export async function migrate() {
  for (const f of FILES) {
    await pool.query(fs.readFileSync(path.join(process.cwd(), "db", f), "utf8"));
  }
}