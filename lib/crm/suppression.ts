/**
 * Suppression-list helpers. The list is global: any email/phone in here is
 * blocked from receiving auto-generated outbound (drafts, follow-ups, etc.).
 *
 * Phase 9 wires this into the Gemini draft pipeline; Phase 3 only writes to
 * it (from bounce + unsubscribe parsing during Gmail sync).
 */

import { requireSupabaseAdmin } from "@/lib/supabase/server";

export type SuppressionChannel = "email" | "sms" | "all";
export type SuppressionReason = "unsub" | "bounce" | "manual" | "tcpa";

export async function suppressIdentifier(args: {
  channel: SuppressionChannel;
  identifier: string;
  reason: SuppressionReason;
  reasonDetail?: string;
  addedBy?: string;
}): Promise<void> {
  if (!args.identifier) return;
  const supabase = requireSupabaseAdmin();
  const id = args.identifier.toLowerCase().trim();
  await supabase
    .from("suppression_list")
    .upsert(
      {
        channel: args.channel,
        identifier: id,
        reason: args.reason,
        reason_detail: args.reasonDetail ?? null,
        added_by: args.addedBy ?? "system"
      },
      { onConflict: "channel,identifier" }
    );
}

export async function isSuppressed(args: {
  channel: SuppressionChannel;
  identifier: string;
}): Promise<boolean> {
  if (!args.identifier) return false;
  const supabase = requireSupabaseAdmin();
  const id = args.identifier.toLowerCase().trim();
  const { data, error } = await supabase
    .from("suppression_list")
    .select("id")
    .in("channel", [args.channel, "all"])
    .eq("identifier", id)
    .limit(1);
  if (error) {
    console.warn("isSuppressed query failed", error.message);
    return false;
  }
  return (data?.length ?? 0) > 0;
}
