#!/usr/bin/env node
/**
 * Local Gemini call extract (one call at a time). Use when production cron 504s.
 *
 *   node --env-file=.env.local scripts/crm-gemini-extract-local.mjs
 *   node --env-file=.env.local scripts/crm-gemini-extract-local.mjs --call-id <uuid>
 *   node --env-file=.env.local scripts/crm-gemini-extract-local.mjs --limit 4
 */
import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

const OWNER = "brianna@illuminairy.com";
const MODEL = process.env.GEMINI_MODEL?.trim() || "gemini-flash-latest";

function arg(name, fallback) {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : fallback;
}

const limit = Number(arg("--limit", "4"));
const callIdFilter = arg("--call-id", null);

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
});

function decryptToken(packed) {
  const key = Buffer.from(process.env.INTEGRATION_TOKEN_ENC_KEY, "base64");
  const parts = packed.split(":");
  const iv = Buffer.from(parts[1], "base64");
  const tag = Buffer.from(parts[2], "base64");
  const ct = Buffer.from(parts[3], "base64");
  const decipher = createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(ct), decipher.final()]).toString("utf8");
}

function encryptToken(plaintext) {
  const key = Buffer.from(process.env.INTEGRATION_TOKEN_ENC_KEY, "base64");
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const enc = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  return ["v1", iv.toString("base64"), cipher.getAuthTag().toString("base64"), enc.toString("base64")].join(":");
}

async function getAccessToken() {
  const { data } = await supabase
    .from("integration_tokens")
    .select("id, refresh_token_enc, access_token_enc, access_token_expires_at")
    .eq("provider", "google")
    .eq("owner_email", OWNER)
    .maybeSingle();
  if (!data) throw new Error("no google token");

  const exp = data.access_token_expires_at ? new Date(data.access_token_expires_at).getTime() : 0;
  if (data.access_token_enc && exp - 60_000 > Date.now()) {
    return decryptToken(data.access_token_enc);
  }

  const refresh = decryptToken(data.refresh_token_enc);
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_OAUTH_CLIENT_ID,
      client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      refresh_token: refresh,
      grant_type: "refresh_token"
    })
  });
  const tok = await res.json();
  if (!tok.access_token) throw new Error(`token refresh failed: ${JSON.stringify(tok).slice(0, 200)}`);

  await supabase
    .from("integration_tokens")
    .update({
      access_token_enc: encryptToken(tok.access_token),
      access_token_expires_at: new Date(Date.now() + tok.expires_in * 1000).toISOString(),
      last_refreshed_at: new Date().toISOString()
    })
    .eq("id", data.id);

  return tok.access_token;
}

async function gfetch(base, path) {
  const token = await getAccessToken();
  const res = await fetch(`${base}${path}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" }
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`google ${res.status}: ${text.slice(0, 300)}`);
  return text ? JSON.parse(text) : null;
}

const DRIVE = "https://www.googleapis.com";
const DOCS = "https://docs.googleapis.com";

async function findDocs(callStart, callEnd, nameHint) {
  const startWindow = new Date(callStart.getTime() - 3600_000).toISOString();
  const endWindow = new Date(callEnd.getTime() + 48 * 3600_000).toISOString();
  const q = [
    "mimeType = 'application/vnd.google-apps.document'",
    `modifiedTime > '${startWindow}'`,
    `modifiedTime < '${endWindow}'`,
    "trashed = false",
    "(name contains 'Gemini' or name contains 'Transcript' or name contains 'Notes by Gemini')"
  ];
  if (nameHint) q.push(`name contains '${nameHint.replace(/'/g, "\\'")}'`);
  const params = new URLSearchParams({
    q: q.join(" and "),
    pageSize: "25",
    fields: "files(id,name,mimeType,webViewLink,modifiedTime)"
  });
  const data = await gfetch(DRIVE, `/drive/v3/files?${params}`);
  let notes = null;
  let transcript = null;
  for (const f of data.files ?? []) {
    const lower = f.name.toLowerCase();
    if (lower.includes("transcript")) {
      if (!transcript || f.modifiedTime > transcript.modifiedTime) transcript = f;
    } else if (lower.includes("notes") || lower.includes("gemini")) {
      if (!notes || f.modifiedTime > notes.modifiedTime) notes = f;
    }
  }
  return { notes, transcript };
}

async function docText(documentId) {
  const doc = await gfetch(DOCS, `/v1/documents/${encodeURIComponent(documentId)}`);
  const out = [];
  for (const el of doc.body?.content ?? []) {
    for (const pe of el.paragraph?.elements ?? []) {
      if (pe.textRun?.content) out.push(pe.textRun.content);
    }
  }
  return out.join("").trim();
}

// Minimal schema — same shape as lib/integrations/gemini/extract-call.ts
const SCHEMA = {
  type: "object",
  required: ["summary", "next_step_decision", "call_score"],
  properties: {
    summary: { type: "string" },
    next_step_decision: {
      type: "string",
      enum: ["qualified", "follow_up", "no_fit", "no_decision"]
    },
    call_score: {
      type: "object",
      required: ["overall", "rapport", "discovery", "pitch_fit", "objection_handling", "next_step", "rationale"],
      properties: {
        overall: { type: "integer", minimum: 0, maximum: 100 },
        rapport: { type: "integer", minimum: 0, maximum: 100 },
        discovery: { type: "integer", minimum: 0, maximum: 100 },
        pitch_fit: { type: "integer", minimum: 0, maximum: 100 },
        objection_handling: { type: "integer", minimum: 0, maximum: 100 },
        next_step: { type: "integer", minimum: 0, maximum: 100 },
        rationale: { type: "string" }
      }
    }
  }
};

async function geminiExtract({ transcript, parentFirst, studentFirst, intake }) {
  const prompt = `${parentFirst ? `Parent: ${parentFirst}\n` : ""}${studentFirst ? `Student: ${studentFirst}\n` : ""}${intake ? `Context:\n${intake}\n\n` : ""}TRANSCRIPT:\n${transcript.slice(0, 60000)}`;
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${encodeURIComponent(process.env.GEMINI_API_KEY)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: {
          parts: [
            {
              text: "Extract Strategy Call intelligence. Score overall 0-100 honestly. No invented facts."
            }
          ]
        },
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 4096,
          thinkingConfig: { thinkingBudget: 0 },
          responseMimeType: "application/json",
          responseSchema: SCHEMA
        }
      })
    }
  );
  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  if (!text) throw new Error(`empty gemini: ${JSON.stringify(data).slice(0, 300)}`);
  return JSON.parse(text);
}

async function processCall(row) {
  const lead = Array.isArray(row.leads) ? row.leads[0] : row.leads;
  const start = new Date(row.scheduled_start ?? row.call_at);
  const end = new Date(row.scheduled_end ?? start.getTime() + 45 * 60_000);
  const hints = [lead?.parent_last, lead?.parent_first, lead?.student_first].filter(Boolean);

  let docs = { notes: null, transcript: null };
  for (const hint of hints) {
    docs = await findDocs(start, end, hint);
    if (docs.transcript || docs.notes) break;
  }
  if (!docs.transcript && !docs.notes) {
    docs = await findDocs(start, end, null);
  }

  const source = docs.transcript ?? docs.notes;
  if (!source) return { callId: row.id, skipped: "no_call_doc_found" };

  const transcript = await docText(source.id);
  if (transcript.length < 200) {
    return { callId: row.id, skipped: "doc_too_short", source: source.name };
  }

  const intake = [
    lead?.sat_baseline && `SAT baseline: ${lead.sat_baseline}`,
    lead?.main_goal && `Goal: ${lead.main_goal}`,
    lead?.sales_notes && `Notes: ${lead.sales_notes}`
  ]
    .filter(Boolean)
    .join("\n");

  const extracted = await geminiExtract({
    transcript,
    parentFirst: lead?.parent_first,
    studentFirst: lead?.student_first,
    intake
  });

  await supabase
    .from("lead_calls")
    .update({
      summary: extracted.summary,
      transcript,
      call_score: extracted.call_score,
      next_step_decision: extracted.next_step_decision,
      transcript_extracted_at: new Date().toISOString(),
      notes_doc_url: docs.notes?.webViewLink ?? null,
      transcript_doc_url: docs.transcript?.webViewLink ?? null
    })
    .eq("id", row.id);

  if (row.lead_id) {
    await supabase.rpc("recompute_lead_score", { p_lead_id: row.lead_id });
  }

  return {
    callId: row.id,
    email: lead?.parent_email,
    call_score_overall: extracted.call_score.overall,
    decision: extracted.next_step_decision,
    doc: source.name
  };
}

let q = supabase
  .from("lead_calls")
  .select(
    "id, lead_id, call_at, scheduled_start, scheduled_end, call_status, transcript_extracted_at, leads:lead_id(parent_email, parent_first, parent_last, student_first, sat_baseline, main_goal, sales_notes)"
  )
  .eq("call_status", "attended")
  .is("transcript_extracted_at", null)
  .order("call_at", { ascending: true })
  .limit(limit);

if (callIdFilter) q = q.eq("id", callIdFilter);

const { data: pending, error } = await q;
if (error) {
  console.error(error.message);
  process.exit(1);
}

console.log(`Processing ${pending?.length ?? 0} attended call(s) without extract…`);
for (const row of pending ?? []) {
  const lead = Array.isArray(row.leads) ? row.leads[0] : row.leads;
  console.log(`\n→ ${lead?.parent_email ?? row.id}`);
  try {
    console.log(JSON.stringify(await processCall(row), null, 2));
  } catch (e) {
    console.error("  failed:", e.message);
  }
}
