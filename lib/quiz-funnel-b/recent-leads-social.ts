import { isInternalCrmEmail } from "@/lib/admin/internal-emails";
import { maskEmailForDisplay } from "@/lib/quiz-funnel-b/mask-email";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export const LAB_SOCIAL_PROOF_MAX_CHIPS = 20;

type EmailRow = { email: string; sortAt: string };

function pushEmail(rows: EmailRow[], seen: Set<string>, email: string, sortAt: string) {
  const normalized = email.trim().toLowerCase();
  if (!normalized || isInternalCrmEmail(normalized) || seen.has(normalized)) return;
  seen.add(normalized);
  rows.push({ email: normalized, sortAt });
}

function maskedFromRows(rows: EmailRow[], limit: number): string[] {
  const masked: string[] = [];
  const seenMasked = new Set<string>();

  for (const row of rows) {
    const display = maskEmailForDisplay(row.email);
    if (!display || seenMasked.has(display)) continue;
    seenMasked.add(display);
    masked.push(display);
    if (masked.length >= limit) break;
  }

  return masked;
}

/** Plan B email step social proof — full chip strip from real leads + clients. */
export async function loadLabEmailSocialProof(): Promise<{
  parentCount: number;
  maskedEmails: string[];
  lastHourCount: number;
}> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return { parentCount: 0, maskedEmails: [], lastHourCount: 0 };
  }

  const hourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const poolSince = new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString();

  const [hourLeads, poolLeads, clients] = await Promise.all([
    supabase
      .from("leads")
      .select("parent_email, created_at")
      .gte("created_at", hourAgo)
      .not("parent_email", "is", null)
      .order("created_at", { ascending: false })
      .limit(40),
    supabase
      .from("leads")
      .select("parent_email, created_at")
      .gte("created_at", poolSince)
      .not("parent_email", "is", null)
      .order("created_at", { ascending: false })
      .limit(80),
    supabase
      .from("clients")
      .select("parent_email, created_at")
      .not("parent_email", "is", null)
      .order("created_at", { ascending: false })
      .limit(40),
  ]);

  if (hourLeads.error || poolLeads.error || clients.error) {
    return { parentCount: 0, maskedEmails: [], lastHourCount: 0 };
  }

  const seen = new Set<string>();
  const ordered: EmailRow[] = [];

  for (const row of hourLeads.data ?? []) {
    if (typeof row.parent_email !== "string") continue;
    pushEmail(ordered, seen, row.parent_email, row.created_at ?? hourAgo);
  }

  for (const row of poolLeads.data ?? []) {
    if (typeof row.parent_email !== "string") continue;
    pushEmail(ordered, seen, row.parent_email, row.created_at ?? poolSince);
  }

  for (const row of clients.data ?? []) {
    if (typeof row.parent_email !== "string") continue;
    pushEmail(ordered, seen, row.parent_email, row.created_at ?? poolSince);
  }

  ordered.sort((a, b) => (a.sortAt < b.sortAt ? 1 : a.sortAt > b.sortAt ? -1 : 0));

  const maskedEmails = maskedFromRows(ordered, LAB_SOCIAL_PROOF_MAX_CHIPS);
  const lastHourCount = (hourLeads.data ?? []).filter(
    (row) => typeof row.parent_email === "string" && !isInternalCrmEmail(row.parent_email)
  ).length;

  const parentCount =
    maskedEmails.length > 0 ? Math.max(lastHourCount, maskedEmails.length) : lastHourCount;

  return { parentCount, maskedEmails, lastHourCount };
}
