/**
 * Server-side GA4 milestone publisher. Looks up the lead's stitched
 * ga4_client_id (from identity_links) and fires a Measurement Protocol
 * event. No-ops if GA4 is not configured or the client_id is unknown
 * — milestones are not blocking on the main path.
 */

import { sendGa4Event } from "@/lib/integrations/ga4-measurement";
import { requireSupabaseAdmin } from "@/lib/supabase/server";

export type LeadMilestone =
  | "lead_qualified"
  | "lead_call_booked"
  | "lead_call_attended"
  | "lead_call_no_show"
  | "lead_lost"
  | "lead_won"
  | "lead_payment_link_sent";

export async function fireLeadMilestone(args: {
  leadId: string;
  milestone: LeadMilestone;
  value?: number;
  extra?: Record<string, string | number | boolean>;
}): Promise<void> {
  try {
    const supabase = requireSupabaseAdmin();
    const { data: link } = await supabase
      .from("identity_links")
      .select("ga4_client_id")
      .eq("lead_id", args.leadId)
      .not("ga4_client_id", "is", null)
      .order("observed_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const clientId = (link?.ga4_client_id as string | undefined) ?? null;
    if (!clientId) return;

    await sendGa4Event({
      clientId,
      userId: args.leadId,
      events: [
        {
          name: args.milestone,
          params: {
            lead_id: args.leadId,
            value: args.value ?? 0,
            currency: "USD",
            ...(args.extra ?? {})
          }
        }
      ]
    });
  } catch (e) {
    console.warn("ga4 milestone failed", args.milestone, e instanceof Error ? e.message : e);
  }
}
