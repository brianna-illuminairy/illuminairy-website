/**
 * Identity-stitching helpers. Records a sighting of one or more anonymous
 * identifiers tied to a lead (or visitor) at the moment of intake / form
 * submission. The reconcile cron later walks `identity_links` and merges
 * earlier anonymous events into the canonical lead.
 *
 * Intended callsites:
 *   - Enroll intake POST           (lib/enroll/...)
 *   - Quiz submit (lead created)   (lib/crm/typeform-enrollment.ts)
 *   - Contact form                 (app/api/contact)
 *   - Manual admin merge UI        (Phase 10)
 */

import { requireSupabaseAdmin } from "@/lib/supabase/server";

export type IdentityLink = {
  leadId?: string | null;
  visitorId?: string | null;
  posthogDistinctId?: string | null;
  ga4ClientId?: string | null;
  metaFbp?: string | null;
  metaFbc?: string | null;
  klaviyoProfileId?: string | null;
  email?: string | null;
  phone?: string | null;
  source: string;
};

export async function recordIdentityLink(link: IdentityLink): Promise<void> {
  const supabase = requireSupabaseAdmin();
  await supabase.from("identity_links").insert({
    lead_id: link.leadId ?? null,
    visitor_id: link.visitorId ?? null,
    posthog_distinct_id: link.posthogDistinctId ?? null,
    ga4_client_id: link.ga4ClientId ?? null,
    meta_fbp: link.metaFbp ?? null,
    meta_fbc: link.metaFbc ?? null,
    klaviyo_profile_id: link.klaviyoProfileId ?? null,
    email: link.email?.toLowerCase() ?? null,
    phone: link.phone ?? null,
    source: link.source
  });
}

export type IdentityMerge = {
  targetLeadId: string;
  mergedFromVisitorId?: string | null;
  mergedFromPosthogDistinctId?: string | null;
  mergedFromLeadId?: string | null;
  source: string;
};

export async function recordIdentityMerge(m: IdentityMerge): Promise<void> {
  const supabase = requireSupabaseAdmin();
  await supabase.from("identity_merges").insert({
    target_lead_id: m.targetLeadId,
    merged_from_visitor_id: m.mergedFromVisitorId ?? null,
    merged_from_posthog_distinct_id: m.mergedFromPosthogDistinctId ?? null,
    merged_from_lead_id: m.mergedFromLeadId ?? null,
    source: m.source
  });
}
