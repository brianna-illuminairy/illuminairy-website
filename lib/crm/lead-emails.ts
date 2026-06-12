/**
 * Insert + query helpers for `lead_emails`. The Gmail sync cron is the only
 * writer; lead profile UI is a reader.
 */

import { requireSupabaseAdmin } from "@/lib/supabase/server";

export type LeadEmailRow = {
  id: string;
  lead_id: string | null;
  direction: "inbound" | "outbound";
  gmail_message_id: string;
  gmail_thread_id: string | null;
  gmail_history_id: number | null;
  from_email: string | null;
  from_name: string | null;
  to_emails: string[] | null;
  cc_emails: string[] | null;
  subject: string | null;
  snippet: string | null;
  body_text: string | null;
  body_html: string | null;
  attachments: Array<{ filename: string; mimeType: string; size: number }> | null;
  sent_at: string;
  received_at: string | null;
  is_bounce: boolean;
  is_unsubscribe: boolean;
  created_at: string;
};

export type UpsertLeadEmail = {
  leadId: string | null;
  direction: "inbound" | "outbound";
  gmailMessageId: string;
  gmailThreadId: string | null;
  gmailHistoryId: number | null;
  fromEmail: string | null;
  fromName: string | null;
  toEmails: string[];
  ccEmails: string[];
  subject: string;
  snippet: string;
  bodyText: string;
  bodyHtml: string;
  attachments: Array<{ filename: string; mimeType: string; size: number }>;
  sentAt: Date;
  receivedAt: Date | null;
  isBounce: boolean;
  isUnsubscribe: boolean;
};

export async function upsertLeadEmail(input: UpsertLeadEmail): Promise<{ inserted: boolean }> {
  const supabase = requireSupabaseAdmin();

  // Skip if the message was already synced.
  const { data: existing } = await supabase
    .from("lead_emails")
    .select("id")
    .eq("gmail_message_id", input.gmailMessageId)
    .maybeSingle();
  if (existing) {
    return { inserted: false };
  }

  const { error } = await supabase.from("lead_emails").insert({
    lead_id: input.leadId,
    direction: input.direction,
    gmail_message_id: input.gmailMessageId,
    gmail_thread_id: input.gmailThreadId,
    gmail_history_id: input.gmailHistoryId,
    from_email: input.fromEmail,
    from_name: input.fromName,
    to_emails: input.toEmails,
    cc_emails: input.ccEmails,
    subject: input.subject || null,
    snippet: input.snippet || null,
    body_text: input.bodyText || null,
    body_html: input.bodyHtml || null,
    attachments: input.attachments,
    sent_at: input.sentAt.toISOString(),
    received_at: input.receivedAt?.toISOString() ?? null,
    is_bounce: input.isBounce,
    is_unsubscribe: input.isUnsubscribe
  });
  if (error) {
    throw new Error(`upsertLeadEmail failed: ${error.message}`);
  }
  return { inserted: true };
}

export async function findLeadIdByEmail(email: string): Promise<string | null> {
  if (!email) return null;
  const supabase = requireSupabaseAdmin();
  const { data } = await supabase
    .from("leads")
    .select("id")
    .eq("parent_email", email.toLowerCase())
    .maybeSingle();
  return data?.id ?? null;
}

export async function listLeadEmails(leadId: string, limit = 100): Promise<LeadEmailRow[]> {
  const supabase = requireSupabaseAdmin();
  const { data, error } = await supabase
    .from("lead_emails")
    .select(
      "id, lead_id, direction, gmail_message_id, gmail_thread_id, gmail_history_id, from_email, from_name, to_emails, cc_emails, subject, snippet, body_text, body_html, attachments, sent_at, received_at, is_bounce, is_unsubscribe, created_at"
    )
    .eq("lead_id", leadId)
    .order("sent_at", { ascending: false })
    .limit(limit);
  if (error) {
    throw new Error(`listLeadEmails failed: ${error.message}`);
  }
  return (data ?? []) as LeadEmailRow[];
}
