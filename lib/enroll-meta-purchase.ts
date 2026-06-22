import {
  metaCapiUserFromLead,
  sendMetaCapiEvent,
  type LeadMetaMatchRow
} from "@/lib/meta-capi";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export function enrollPurchaseEventId(referenceId: string) {
  return `purchase_${referenceId}`;
}

export function enrollPurchaseValueCents(input: {
  diagnosticCents: number;
  weeklyCents: number;
  diagnosticWaived: boolean;
}) {
  if (input.diagnosticWaived) {
    return input.weeklyCents > 0 ? input.weeklyCents : 0;
  }
  return Math.max(input.diagnosticCents, input.weeklyCents);
}

export async function sendEnrollPurchaseMetaCapi(input: {
  parentEmail: string;
  referenceId: string;
  leadSlug: string;
  enrollFlow: "standard-enroll" | "personalized-enroll";
  valueCents: number;
  currency?: string;
  fbp?: string;
  fbc?: string;
  clientIp?: string;
  clientUserAgent?: string;
  eventTimeSec?: number;
}) {
  const supabase = getSupabaseAdmin();
  let lead: LeadMetaMatchRow | null = null;

  if (supabase) {
    const { data } = await supabase
      .from("leads")
      .select(
        "id, parent_email, parent_first, parent_last, parent_phone, fbclid, meta_fbp, meta_fbc, meta_fbc_ts, meta_client_ip, meta_client_user_agent"
      )
      .eq("parent_email", input.parentEmail.toLowerCase())
      .maybeSingle();
    if (data) lead = data as LeadMetaMatchRow;
  }

  const eventId = enrollPurchaseEventId(input.referenceId);
  const capiUser = lead
    ? {
        ...metaCapiUserFromLead(lead, input.parentEmail),
        fbp: input.fbp ?? lead.meta_fbp ?? undefined,
        fbc: input.fbc ?? lead.meta_fbc ?? undefined,
        clientIp: input.clientIp ?? lead.meta_client_ip ?? undefined,
        clientUserAgent:
          input.clientUserAgent ?? lead.meta_client_user_agent ?? undefined
      }
    : {
        email: input.parentEmail,
        fbp: input.fbp,
        fbc: input.fbc,
        clientIp: input.clientIp,
        clientUserAgent: input.clientUserAgent
      };

  return sendMetaCapiEvent(
    "Purchase",
    eventId,
    capiUser,
    {
      content_name: input.leadSlug,
      content_category: input.enrollFlow,
      value: input.valueCents / 100,
      currency: input.currency ?? "USD"
    },
    undefined,
    input.eventTimeSec ? { eventTimeSec: input.eventTimeSec } : undefined
  );
}
