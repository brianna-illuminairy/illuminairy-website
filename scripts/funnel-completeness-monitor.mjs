#!/usr/bin/env node
/**
 * Attribution + audience completeness monitor for touch_events / visitors.
 *
 * Auth:
 * - SUPABASE_ACCESS_TOKEN (Management API), or
 * - DATABASE_URL, or
 * - SUPABASE_DB_PASSWORD (pool/direct host fallback).
 *
 * Exit code:
 * - 0: no critical threshold breaches
 * - 1: critical breach (or auth/query failure)
 */

import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const projectRef = "agujbietvwcudihfgkef";

const WINDOW_HOURS = Number(process.env.FUNNEL_COMPLETENESS_WINDOW_HOURS ?? "24");
const VISITOR_WINDOW_DAYS = Number(process.env.FUNNEL_COMPLETENESS_VISITOR_DAYS ?? "30");
const WARN_THRESHOLD = Number(process.env.FUNNEL_COMPLETENESS_WARN ?? "0.98");
const CRIT_THRESHOLD = Number(process.env.FUNNEL_COMPLETENESS_CRIT ?? "0.95");
const MIN_EVENTS = Number(process.env.FUNNEL_COMPLETENESS_MIN_EVENTS ?? "20");

const MONITORED_EVENTS = [
  "funnel_cta_click",
  "parent_confirmed",
  "quiz_started",
  "quiz_step_view",
  "quiz_lead_submitted",
  "booking_error",
  "call_booked",
  "attribution_return"
];

const REQUIRED_FIELDS = {
  funnel_cta_click: ["utm", "hero"],
  parent_confirmed: ["utm", "hero", "qWho"],
  quiz_started: ["utm", "hero"],
  quiz_step_view: ["utm", "hero"],
  quiz_lead_submitted: ["utm", "qWho"],
  booking_error: ["utm", "qWho"],
  call_booked: ["utm", "qWho"],
  attribution_return: ["utm", "hero"]
};

function loadEnvLocal() {
  const envPath = resolve(root, ".env.local");
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq);
    if (process.env[key]) continue;
    let val = trimmed.slice(eq + 1);
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    process.env[key] = val;
  }
}

function pct(numerator, denominator) {
  if (!denominator) return 1;
  return numerator / denominator;
}

function fmtRate(rate) {
  return `${(rate * 100).toFixed(1)}%`;
}

function parseCount(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function asString(value) {
  return typeof value === "string" ? value : String(value ?? "");
}

function printSection(title) {
  console.log(`\n${title}`);
}

function pad(value, width) {
  const s = String(value);
  return s.length >= width ? s : `${s}${" ".repeat(width - s.length)}`;
}

async function queryViaManagementApi(sql) {
  const token = process.env.SUPABASE_ACCESS_TOKEN?.trim();
  if (!token) return null;
  const res = await fetch(
    `https://api.supabase.com/v1/projects/${projectRef}/database/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ query: sql })
    }
  );
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Management API query failed (${res.status}): ${body.slice(0, 300)}`);
  }
  return res.json();
}

async function queryViaPg(sql) {
  let connectionString = process.env.DATABASE_URL;
  if (!connectionString && process.env.SUPABASE_DB_PASSWORD) {
    const password = encodeURIComponent(process.env.SUPABASE_DB_PASSWORD);
    connectionString = `postgresql://postgres.${projectRef}:${password}@aws-0-us-east-1.pooler.supabase.com:6543/postgres`;
  }
  if (!connectionString) return null;

  const pg = await import("pg");
  const client = new pg.default.Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });
  await client.connect();
  try {
    const result = await client.query(sql);
    return result.rows;
  } finally {
    await client.end();
  }
}

async function runQuery(sql) {
  const mgmtRows = await queryViaManagementApi(sql);
  if (mgmtRows) return mgmtRows;
  const pgRows = await queryViaPg(sql);
  if (pgRows) return pgRows;
  throw new Error(
    "Set one of SUPABASE_ACCESS_TOKEN, DATABASE_URL, or SUPABASE_DB_PASSWORD."
  );
}

function detectStatus(rate, total) {
  if (total < MIN_EVENTS) return "skip";
  if (rate < CRIT_THRESHOLD) return "critical";
  if (rate < WARN_THRESHOLD) return "warn";
  return "ok";
}

function eventRequirementStatus(eventType, total, rates) {
  const required = REQUIRED_FIELDS[eventType] ?? ["utm", "hero", "qWho"];
  const statuses = required.map((field) => {
    if (field === "utm") return detectStatus(rates.utmRate, total);
    if (field === "hero") return detectStatus(rates.heroRate, total);
    if (field === "qWho") return detectStatus(rates.qWhoRate, total);
    return "ok";
  });
  if (statuses.includes("critical")) return "critical";
  if (statuses.includes("warn")) return "warn";
  if (statuses.includes("skip")) return "skip";
  return "ok";
}

function monitorSql() {
  const quotedEvents = MONITORED_EVENTS.map((event) => `'${event}'`).join(",");
  return `
    with scoped as (
      select
        event_type,
        source,
        nullif(btrim(utm_content), '') as utm_content,
        nullif(btrim(coalesce(payload->>'hero_hook', payload->>'heroHook')), '') as hero_hook,
        nullif(btrim(coalesce(payload->>'qWho', payload->>'quiz_who')), '') as q_who
      from touch_events
      where created_at >= now() - interval '${WINDOW_HOURS} hours'
        and event_type in (${quotedEvents})
    ),
    rollup as (
      select
        event_type,
        source,
        count(*)::int as total,
        count(utm_content)::int as with_utm_content,
        count(hero_hook)::int as with_hero_hook,
        count(q_who)::int as with_q_who
      from scoped
      group by event_type, source
    ),
    overall as (
      select
        'ALL'::text as event_type,
        'all'::text as source,
        count(*)::int as total,
        count(utm_content)::int as with_utm_content,
        count(hero_hook)::int as with_hero_hook,
        count(q_who)::int as with_q_who
      from scoped
    )
    ),
    combined as (
      select * from rollup
      union all
      select * from overall
    )
    select *
    from combined
    order by (event_type = 'ALL') desc, total desc, event_type asc, source asc;
  `;
}

function visitorSql() {
  return `
    select
      count(*)::int as total_visitors,
      count(nullif(btrim(first_utm_content), ''))::int as with_first_utm_content,
      count(nullif(btrim(first_hero_hook), ''))::int as with_first_hero_hook,
      count(nullif(btrim(quiz_who), ''))::int as with_quiz_who
    from visitors
    where first_seen_at >= now() - interval '${VISITOR_WINDOW_DAYS} days';
  `;
}

async function main() {
  loadEnvLocal();

  printSection("Funnel completeness monitor");
  console.log(
    `window=${WINDOW_HOURS}h warn=${(WARN_THRESHOLD * 100).toFixed(0)}% critical=${(CRIT_THRESHOLD * 100).toFixed(0)}% min_events=${MIN_EVENTS}`
  );

  const rows = await runQuery(monitorSql());
  const visitorRows = await runQuery(visitorSql());

  const normalized = rows.map((row) => {
    const eventType = asString(row.event_type);
    const source = asString(row.source);
    const total = parseCount(row.total);
    const withUtm = parseCount(row.with_utm_content);
    const withHero = parseCount(row.with_hero_hook);
    const withQWho = parseCount(row.with_q_who);
    return {
      eventType,
      source,
      total,
      utmRate: pct(withUtm, total),
      heroRate: pct(withHero, total),
      qWhoRate: pct(withQWho, total)
    };
  });

  printSection("touch_events completeness");
  console.log(
    `${pad("event_type", 20)} ${pad("source", 8)} ${pad("total", 7)} ${pad("utm_content", 12)} ${pad("hero_hook", 10)} ${pad("qWho", 8)} status`
  );

  let hasCritical = false;
  for (const row of normalized) {
    const status =
      row.eventType === "ALL"
        ? (() => {
            const statusUtm = detectStatus(row.utmRate, row.total);
            const statusHero = detectStatus(row.heroRate, row.total);
            const statusQWho = detectStatus(row.qWhoRate, row.total);
            if ([statusUtm, statusHero, statusQWho].includes("critical")) return "critical";
            if ([statusUtm, statusHero, statusQWho].includes("warn")) return "warn";
            if ([statusUtm, statusHero, statusQWho].includes("skip")) return "skip";
            return "ok";
          })()
        : eventRequirementStatus(row.eventType, row.total, row);
    if (status === "critical") hasCritical = true;
    console.log(
      `${pad(row.eventType, 20)} ${pad(row.source, 8)} ${pad(row.total, 7)} ${pad(fmtRate(row.utmRate), 12)} ${pad(fmtRate(row.heroRate), 10)} ${pad(fmtRate(row.qWhoRate), 8)} ${status}`
    );
  }

  const visitor = visitorRows[0] ?? {};
  const totalVisitors = parseCount(visitor.total_visitors);
  const visitorUtmRate = pct(parseCount(visitor.with_first_utm_content), totalVisitors);
  const visitorHeroRate = pct(parseCount(visitor.with_first_hero_hook), totalVisitors);
  const visitorQWhoRate = pct(parseCount(visitor.with_quiz_who), totalVisitors);

  printSection(`visitors completeness (${VISITOR_WINDOW_DAYS}d)`);
  console.log(`total=${totalVisitors}`);
  console.log(`first_utm_content=${fmtRate(visitorUtmRate)}`);
  console.log(`first_hero_hook=${fmtRate(visitorHeroRate)}`);
  console.log(`quiz_who=${fmtRate(visitorQWhoRate)}`);

  const visitorStatuses = [
    detectStatus(visitorUtmRate, totalVisitors),
    detectStatus(visitorHeroRate, totalVisitors),
    detectStatus(visitorQWhoRate, totalVisitors)
  ];
  if (visitorStatuses.includes("critical")) hasCritical = true;

  if (hasCritical) {
    console.error("\nCRITICAL: completeness dropped below threshold.");
    process.exit(1);
  }

  console.log("\nOK: no critical completeness breaches.");
}

main().catch((error) => {
  console.error(`Monitor failed: ${error?.message ?? error}`);
  process.exit(1);
});
