#!/usr/bin/env node
/**
 * Query Supabase CRM without MCP — for when Cursor Supabase OAuth is stuck.
 *
 * One-time setup: paste real values into .env.local (Supabase → Settings → API):
 *   SUPABASE_URL=https://agujbietvwcudihfgkef.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY=<service_role secret>
 *
 * Usage:
 *   npm run crm:query -- crisafulli
 *   npm run crm:query -- moniquedreynolds@gmail.com
 */
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const envPath = resolve(root, ".env.local");

function loadEnvFile() {
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq);
    let val = trimmed.slice(eq + 1);
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

loadEnvFile();

const term = process.argv.slice(2).join(" ").trim();
if (!term) {
  console.error("Usage: npm run crm:query -- <email-or-search-term>");
  process.exit(1);
}

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || url.length < 20 || !key || key.length < 20) {
  console.error(`
Missing Supabase credentials in .env.local.

Add (Supabase dashboard → Project Settings → API):
  SUPABASE_URL=https://agujbietvwcudihfgkef.supabase.co
  SUPABASE_SERVICE_ROLE_KEY=<service_role key — never commit>

Your file currently has placeholders. This bypasses MCP entirely.
`);
  process.exit(1);
}

const sb = createClient(url, key);
const pattern = term.includes("%") ? term : `%${term}%`;

const { data: leads, error: leadErr } = await sb
  .from("leads")
  .select(
    "id,parent_email,parent_first,parent_last,parent_phone,student_first,stage,booked_call_at,intake_submitted_at,sat_baseline,target_score,sat_next_test,gpa_band,quiz_trigger,quiz_stakes,promised_gain_pts,utm_campaign,calendly_event_uri,visitor_id,quiz_answers"
  )
  .or(
    `parent_email.ilike.${pattern},parent_first.ilike.${pattern},parent_last.ilike.${pattern},student_first.ilike.${pattern},parent_phone.ilike.${pattern}`
  )
  .order("created_at", { ascending: false })
  .limit(10);

if (leadErr) {
  console.error("leads query failed:", leadErr.message);
  process.exit(1);
}

console.log("\n=== LEADS ===");
console.log(JSON.stringify(leads ?? [], null, 2));

const { data: visitors, error: visErr } = await sb
  .from("visitors")
  .select("id,quiz_furthest_step,first_seen_at,last_seen_at,quiz_answers")
  .filter("quiz_answers->>parentEmail", "ilike", pattern)
  .limit(5);

if (!visErr) {
  console.log("\n=== VISITORS ===");
  console.log(JSON.stringify(visitors ?? [], null, 2));
}

const leadIds = (leads ?? []).map((l) => l.id);
let touchQuery = sb
  .from("touch_events")
  .select("event_type,source,created_at,lead_id,visitor_id,payload")
  .order("created_at", { ascending: false })
  .limit(100);

if (leadIds.length > 0) {
  touchQuery = touchQuery.in("lead_id", leadIds);
} else {
  touchQuery = touchQuery.filter("payload->>invitee_email", "ilike", pattern);
}

const { data: touch, error: touchErr } = await touchQuery;
if (touchErr) {
  const { data: touchFallback } = await sb
    .from("touch_events")
    .select("event_type,source,created_at,lead_id,visitor_id,payload")
    .filter("payload->>parent_email", "ilike", pattern)
    .order("created_at", { ascending: false })
    .limit(50);
  console.log("\n=== TOUCH EVENTS ===");
  console.log(JSON.stringify(touchFallback ?? [], null, 2));
} else {
  console.log("\n=== TOUCH EVENTS ===");
  console.log(JSON.stringify(touch ?? [], null, 2));
}
