/**
 * Identity reconcile cron — runs every 6 hours.
 *
 * Walks `identity_links`, finds rows where the same anonymous identifier
 * (visitor_id / posthog_distinct_id / ga4_client_id / meta_fbp / meta_fbc /
 * klaviyo_profile_id) appears under two different lead_ids OR under a NULL
 * lead_id + an identified lead_id, and merges them.
 *
 * Merge strategy: the OLDER lead wins (preserves first-touch attribution).
 * Duplicate detection only — actual lead-row consolidation is logged to
 * `crm_audit_log` for human review; we do not delete or rewrite leads
 * automatically in v1.
 */

import { NextRequest, NextResponse } from "next/server";
import { authorizeCronRequest, cronErrorResponse } from "@/lib/crm/cron-auth";
import { logAudit } from "@/lib/crm/audit-log";
import { recordIdentityMerge } from "@/lib/crm/identity-stitching";
import { requireSupabaseAdmin } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type IdentityRow = {
  id: string;
  lead_id: string | null;
  visitor_id: string | null;
  posthog_distinct_id: string | null;
  ga4_client_id: string | null;
  meta_fbp: string | null;
  meta_fbc: string | null;
  klaviyo_profile_id: string | null;
  email: string | null;
  phone: string | null;
  observed_at: string;
  source: string | null;
};

const IDENTIFIER_KEYS: Array<keyof IdentityRow> = [
  "visitor_id",
  "posthog_distinct_id",
  "ga4_client_id",
  "meta_fbp",
  "meta_fbc",
  "klaviyo_profile_id",
  "email",
  "phone"
];

async function run(req: NextRequest): Promise<NextResponse> {
  const auth = authorizeCronRequest(req);
  if (!auth.ok) return cronErrorResponse(auth);

  const supabase = requireSupabaseAdmin();
  const startedAt = Date.now();

  const { data: links, error } = await supabase
    .from("identity_links")
    .select(
      "id, lead_id, visitor_id, posthog_distinct_id, ga4_client_id, meta_fbp, meta_fbc, klaviyo_profile_id, email, phone, observed_at, source"
    )
    .order("observed_at", { ascending: true })
    .limit(5000);

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  const rows = (links ?? []) as IdentityRow[];

  // Bucket identifiers → set of lead_ids
  const buckets = new Map<string, Set<string>>(); // key: `${field}:${value}`  value: Set<lead_id>
  const identifierRows = new Map<string, IdentityRow[]>(); // for source row tracking

  for (const r of rows) {
    for (const key of IDENTIFIER_KEYS) {
      const v = r[key] as string | null;
      if (!v) continue;
      const bucketKey = `${String(key)}:${v}`;
      if (!buckets.has(bucketKey)) buckets.set(bucketKey, new Set());
      if (!identifierRows.has(bucketKey)) identifierRows.set(bucketKey, []);
      identifierRows.get(bucketKey)!.push(r);
      if (r.lead_id) buckets.get(bucketKey)!.add(r.lead_id);
    }
  }

  // Find buckets with >1 lead_ids OR with both null+identified
  let mergesDetected = 0;
  const merged = new Set<string>(); // dedupe per-pair so we don't double-log

  for (const [bucketKey, leadIdSet] of Array.from(buckets.entries())) {
    if (leadIdSet.size < 2) continue;
    const leadIds = Array.from(leadIdSet);

    // Pick the older lead by created_at
    const { data: leads } = await supabase
      .from("leads")
      .select("id, parent_email, created_at, stage")
      .in("id", leadIds)
      .order("created_at", { ascending: true });

    if (!leads || leads.length < 2) continue;
    const winner = leads[0];

    for (const loser of leads.slice(1)) {
      const pairKey = `${winner.id}:${loser.id}`;
      if (merged.has(pairKey)) continue;
      merged.add(pairKey);
      mergesDetected++;

      const sourceRow = (identifierRows.get(bucketKey) ?? []).find(
        (r) => r.lead_id === loser.id
      );

      await recordIdentityMerge({
        targetLeadId: winner.id,
        mergedFromLeadId: loser.id,
        mergedFromVisitorId: sourceRow?.visitor_id ?? null,
        mergedFromPosthogDistinctId: sourceRow?.posthog_distinct_id ?? null,
        source: "identity_reconcile_cron"
      });

      await logAudit({
        entityType: "lead",
        entityId: winner.id,
        action: "duplicate_detected",
        source: "cron",
        actor: "identity-reconcile-cron",
        after: {
          identifier: bucketKey,
          winner_lead_id: winner.id,
          duplicate_lead_id: loser.id,
          duplicate_email: loser.parent_email,
          duplicate_stage: loser.stage,
          requires_manual_merge: true
        },
        notes: `Bucket: ${bucketKey} → keep ${winner.id}, review ${loser.id}`
      });
    }
  }

  return NextResponse.json({
    ok: true,
    rows_scanned: rows.length,
    merges_detected: mergesDetected,
    elapsed_ms: Date.now() - startedAt
  });
}

export async function POST(req: NextRequest) {
  return run(req);
}

export async function GET(req: NextRequest) {
  return run(req);
}
