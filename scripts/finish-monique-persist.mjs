// Finish the manual Monique-call persistence:
// 1. Update lead_calls.transcript with the full transcript text.
// 2. Insert the 5 owner-assigned action items as lead_tasks.
// 3. Insert the 15 lead_tags (buying_trigger / objection / priority).
// 4. Set leads.urgency_level + urgency_reason + urgency_source.
// 5. Audit-log everything as source=gemini for parity with the cron.
//
// Run: node --env-file=.env.local scripts/finish-monique-persist.mjs
//
// One-off script tied to lead fe11cd61... and call b0289872....

import { readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });

const LEAD_ID = "fe11cd61-20b9-4d74-9be7-3bb4788d1eec";
const CALL_ID = "b0289872-3c0b-478b-b3af-9a2d3681a0fb";

const transcript = readFileSync("/tmp/monique-transcript.txt", "utf8");
const data = JSON.parse(readFileSync("/tmp/monique-extract.json", "utf8"));

const SOURCE_DETAIL = "gemini-extract-manual-monique-2026-06-12";

async function run() {
  // 1. Transcript on the call row.
  const tx = await supabase
    .from("lead_calls")
    .update({ transcript })
    .eq("id", CALL_ID);
  if (tx.error) throw new Error(`transcript update: ${tx.error.message}`);
  console.log("transcript updated, length =", transcript.length);

  // 2. Lead tasks.
  const now = new Date();
  const offsets = ["12 hours", "7 days", "5 days", "43 days", "7 days"];
  const tasks = data.action_items
    .filter((a) => !a.assignee || a.assignee === "owner")
    .map((a, i) => {
      const due = new Date(now);
      const [n, unit] = offsets[i].split(" ");
      if (unit.startsWith("hour")) due.setHours(due.getHours() + Number(n));
      else due.setDate(due.getDate() + Number(n));
      return {
        lead_id: LEAD_ID,
        lead_call_id: CALL_ID,
        kind: a.kind,
        title: a.title,
        body: a.notes ?? null,
        due_at: due.toISOString(),
        source: "gemini",
        source_detail: SOURCE_DETAIL,
        status: "open",
        is_highlighted: a.kind === "post_call"
      };
    });
  const existingTasks = await supabase
    .from("lead_tasks")
    .select("title")
    .eq("lead_id", LEAD_ID)
    .eq("source_detail", SOURCE_DETAIL);
  if (existingTasks.error) throw new Error(`tasks fetch: ${existingTasks.error.message}`);
  const seenTitles = new Set((existingTasks.data ?? []).map((r) => r.title));
  const newTasks = tasks.filter((t) => !seenTitles.has(t.title));
  let tasksCreated = [];
  if (newTasks.length) {
    const tk = await supabase.from("lead_tasks").insert(newTasks).select("id, kind, title");
    if (tk.error) throw new Error(`tasks insert: ${tk.error.message}`);
    tasksCreated = tk.data;
  }
  console.log("tasks inserted:", tasksCreated.length, "(already there:", tasks.length - newTasks.length + ")");
  for (const t of tasksCreated) console.log(`  - [${t.kind}] ${t.title}`);

  // 3. Lead tags.
  const tagRows = [
    ...data.buying_triggers.map((t) => ({ category: "buying_trigger", ...t })),
    ...data.objections.map((t) => ({ category: "objection", ...t })),
    ...data.priorities.map((t) => ({ category: "priority", ...t }))
  ].map((t) => ({
    lead_id: LEAD_ID,
    category: t.category,
    tag: t.tag,
    note: t.note,
    source: "gemini",
    source_detail: SOURCE_DETAIL,
    evidence: { call_id: CALL_ID },
    created_by: "gemini-extract"
  }));
  const existing = await supabase
    .from("lead_tags")
    .select("category, tag")
    .eq("lead_id", LEAD_ID)
    .is("resolved_at", null);
  if (existing.error) throw new Error(`tags fetch: ${existing.error.message}`);
  const seen = new Set((existing.data ?? []).map((r) => `${r.category}:${r.tag}`));
  const toInsert = tagRows.filter((r) => !seen.has(`${r.category}:${r.tag}`));
  let tagsCreated = [];
  if (toInsert.length) {
    const tg = await supabase.from("lead_tags").insert(toInsert).select("id, category, tag");
    if (tg.error) throw new Error(`tags insert: ${tg.error.message}`);
    tagsCreated = tg.data ?? [];
  }
  console.log("tags inserted:", tagsCreated.length, "(skipped existing:", tagRows.length - toInsert.length + ")");
  for (const t of tagsCreated) console.log(`  - [${t.category}] ${t.tag}`);

  // 4. Lead urgency.
  const up = await supabase
    .from("leads")
    .update({
      urgency_level: data.urgency.level,
      urgency_reason: data.urgency.reason,
      urgency_source: "gemini",
      urgency_set_at: now.toISOString(),
      last_activity_at: now.toISOString()
    })
    .eq("id", LEAD_ID);
  if (up.error) throw new Error(`urgency update: ${up.error.message}`);
  console.log("urgency set:", data.urgency.level);

  // 5. Audit log entries.
  const auditRows = [
    {
      entity_type: "lead_call",
      entity_id: CALL_ID,
      action: "gemini_extract:applied",
      source: "gemini",
      after: {
        next_step_decision: data.next_step_decision,
        call_score_overall: data.call_score.overall
      },
      notes: data.call_score.rationale.slice(0, 1000)
    },
    {
      entity_type: "lead",
      entity_id: LEAD_ID,
      action: "lead:urgency_set",
      source: "gemini",
      after: { urgency_level: data.urgency.level },
      notes: data.urgency.reason
    }
  ];
  const au = await supabase.from("audit_log").insert(auditRows);
  if (au.error) console.warn("audit log insert non-fatal:", au.error.message);
  else console.log("audit rows inserted:", auditRows.length);

  console.log("\nDONE. CallId =", CALL_ID);
}

run().catch((e) => {
  console.error("FAILED:", e.message);
  process.exit(1);
});
