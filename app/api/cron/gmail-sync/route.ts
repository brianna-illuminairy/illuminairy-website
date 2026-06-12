/**
 * Cron: Gmail incremental sync for the CRM owner inbox + outbox.
 *
 * Run schedule: every 15 minutes via `.github/workflows/crm-cron.yml`.
 *
 * Strategy:
 *   - Read `integration_tokens.gmail_history_id` for the owner.
 *   - If null (first run): bootstrap by listing the last 50 messages and
 *     storing their `historyId`s as the new high-water mark.
 *   - Otherwise: call users.history.list since the stored historyId. Walk
 *     pages. Collect all message ids added/changed. Dedupe.
 *   - For each new message: GET with format=full, parse headers + body,
 *     determine direction (outbound if From matches owner, otherwise inbound),
 *     match to a lead by parent_email, write to lead_emails. Detect bounces
 *     and unsubscribe headers; write to suppression_list.
 *
 * The `set_awaiting_reply_since` DB trigger keeps `leads.awaiting_reply_since`
 * in sync on every insert.
 */

import { NextRequest, NextResponse } from "next/server";
import { authorizeCronRequest, cronErrorResponse } from "@/lib/crm/cron-auth";
import { applyCallAttendance } from "@/lib/crm/lead-call-attendance";
import { findLeadIdByEmail, upsertLeadEmail } from "@/lib/crm/lead-emails";
import { suppressIdentifier } from "@/lib/crm/suppression";
import {
  decodeBody,
  extractBody,
  extractBouncedRecipient,
  getMessage,
  getProfile,
  headerValue,
  isBounceMessage,
  listHistorySince,
  listMessages,
  parseAddressList,
  parseEmailHeader,
  unsubscribeFromHeaders,
  type GmailHistoryRecord,
  type GmailMessage,
  type GmailMessageRef
} from "@/lib/integrations/google/gmail";
import { recordHeartbeat } from "@/lib/integrations/heartbeat";
import { primaryGoogleOwnerEmail } from "@/lib/integrations/google/tokens";
import { requireSupabaseAdmin } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

const SENT_LABEL = "SENT";
const MAX_NEW_MESSAGES_PER_RUN = 200;

export async function POST(req: NextRequest) {
  return run(req);
}

export async function GET(req: NextRequest) {
  return run(req);
}

async function run(req: NextRequest): Promise<NextResponse> {
  const auth = authorizeCronRequest(req);
  if (!auth.ok) return cronErrorResponse(auth);

  const startedAt = Date.now();
  const ownerEmail = primaryGoogleOwnerEmail();
  const supabase = requireSupabaseAdmin();

  const { data: tokenRow, error: tokenErr } = await supabase
    .from("integration_tokens")
    .select("id, gmail_history_id")
    .eq("provider", "google")
    .eq("owner_email", ownerEmail.toLowerCase())
    .maybeSingle();

  if (tokenErr || !tokenRow) {
    return NextResponse.json(
      { ok: false, error: "google_not_connected" },
      { status: 200 } // 200 so cron workflow doesn't fail when not yet connected
    );
  }

  let nextHistoryId: string;
  const messageIds = new Set<string>();

  if (!tokenRow.gmail_history_id) {
    // Bootstrap: fetch the first page of recent messages to get historyId.
    const profile = await getProfile(ownerEmail);
    nextHistoryId = profile.historyId;

    const recent = await listMessages({
      ownerEmail,
      maxResults: 50,
      q: "newer_than:14d"
    });
    for (const r of recent.messages ?? []) messageIds.add(r.id);
  } else {
    let pageToken: string | undefined;
    let pages = 0;
    let lastHistoryId = String(tokenRow.gmail_history_id);
    do {
      const page = await listHistorySince({
        ownerEmail,
        startHistoryId: lastHistoryId,
        pageToken,
        pageSize: 500
      });
      lastHistoryId = page.historyId ?? lastHistoryId;
      for (const h of page.history ?? []) collectMessageIds(h, messageIds);
      pageToken = page.nextPageToken;
      pages += 1;
      if (pages > 10) break; // safety: don't loop forever
      if (messageIds.size >= MAX_NEW_MESSAGES_PER_RUN) break;
    } while (pageToken);
    nextHistoryId = lastHistoryId;
  }

  let processed = 0;
  let inserted = 0;
  let bounces = 0;
  let unsubs = 0;

  // Fetch + persist each message.
  for (const id of Array.from(messageIds).slice(0, MAX_NEW_MESSAGES_PER_RUN)) {
    try {
      const msg = await getMessage({ ownerEmail, messageId: id, format: "full" });
      const result = await persistGmailMessage({ ownerEmail, msg });
      processed += 1;
      if (result.inserted) inserted += 1;
      if (result.bounce) bounces += 1;
      if (result.unsub) unsubs += 1;
    } catch (e) {
      console.warn(`gmail-sync: failed to persist ${id}`, e instanceof Error ? e.message : e);
    }
  }

  await supabase
    .from("integration_tokens")
    .update({
      gmail_history_id: Number(nextHistoryId),
      last_used_at: new Date().toISOString()
    })
    .eq("id", tokenRow.id);

  void recordHeartbeat({
    provider: "gmail",
    status: "ok",
    latencyMs: Date.now() - startedAt
  });

  return NextResponse.json({
    ok: true,
    bootstrap: !tokenRow.gmail_history_id,
    nextHistoryId,
    discovered: messageIds.size,
    processed,
    inserted,
    bounces,
    unsubs,
    elapsed_ms: Date.now() - startedAt
  });
}

function collectMessageIds(h: GmailHistoryRecord, into: Set<string>): void {
  for (const m of h.messages ?? []) into.add(m.id);
  for (const a of h.messagesAdded ?? []) into.add(a.message.id);
  // We don't sync deletions; suppression is what matters.
}

async function persistGmailMessage(args: {
  ownerEmail: string;
  msg: GmailMessage;
}): Promise<{ inserted: boolean; bounce: boolean; unsub: boolean }> {
  const headers = args.msg.payload?.headers;
  const fromRaw = headerValue(headers, "From");
  const from = parseEmailHeader(fromRaw);
  const toRaw = headerValue(headers, "To");
  const ccRaw = headerValue(headers, "Cc");
  const subject = headerValue(headers, "Subject");
  const dateRaw = headerValue(headers, "Date");

  const tos = parseAddressList(toRaw);
  const ccs = parseAddressList(ccRaw);
  const owner = args.ownerEmail.toLowerCase();
  const sentLabel = args.msg.labelIds?.includes(SENT_LABEL) ?? false;
  const direction: "inbound" | "outbound" =
    sentLabel || from.email === owner ? "outbound" : "inbound";

  const body = extractBody(args.msg.payload);
  const sentAt = parseDateHeader(dateRaw) ?? parseInternalDate(args.msg.internalDate) ?? new Date();
  const receivedAt = direction === "inbound" ? sentAt : null;

  const bounce = isBounceMessage(args.msg);
  const unsubUrl = unsubscribeFromHeaders(headers);
  const unsub = Boolean(
    unsubUrl ||
      /unsubscribe@/i.test(fromRaw) ||
      /^unsubscribe$/i.test(decodeBody(args.msg.snippet ? undefined : undefined).trim())
  );

  // Lead match: outbound -> match by recipient; inbound -> match by sender.
  let leadId: string | null = null;
  if (direction === "outbound") {
    for (const recipient of tos) {
      const id = await findLeadIdByEmail(recipient.email);
      if (id) {
        leadId = id;
        break;
      }
    }
  } else {
    leadId = await findLeadIdByEmail(from.email);
  }

  const result = await upsertLeadEmail({
    leadId,
    direction,
    gmailMessageId: args.msg.id,
    gmailThreadId: args.msg.threadId ?? null,
    gmailHistoryId: args.msg.historyId ? Number(args.msg.historyId) : null,
    fromEmail: from.email || null,
    fromName: from.name || null,
    toEmails: tos.map((t) => t.email),
    ccEmails: ccs.map((c) => c.email),
    subject,
    snippet: args.msg.snippet ?? "",
    bodyText: body.text,
    bodyHtml: body.html,
    attachments: body.attachments.map((a) => ({
      filename: a.filename,
      mimeType: a.mimeType,
      size: a.size
    })),
    sentAt,
    receivedAt,
    isBounce: bounce,
    isUnsubscribe: unsub
  });

  // Bounce → suppress the recipient that bounced.
  if (bounce && result.inserted) {
    const bouncedRecipient = extractBouncedRecipient(args.msg);
    if (bouncedRecipient) {
      await suppressIdentifier({
        channel: "email",
        identifier: bouncedRecipient,
        reason: "bounce",
        reasonDetail: subject || "Delivery status notification"
      });

      // If this bounced address belongs to a lead with an upcoming booked
      // call, raise no_show_risk so the owner sees a warning before the
      // start time.
      await flagUpcomingCallRiskOnBounce(bouncedRecipient);
    }
  }

  // Inbound unsubscribe → suppress the sender.
  if (unsub && direction === "inbound" && from.email) {
    await suppressIdentifier({
      channel: "email",
      identifier: from.email,
      reason: "unsub",
      reasonDetail: unsubUrl ?? "Inbound unsubscribe request"
    });
  }

  // Inbound reply on a lead with an upcoming booked/confirmed call:
  // treat as positive confirmation. Clears any risk flag.
  if (direction === "inbound" && leadId) {
    await maybeConfirmCallFromReply(leadId);
  }

  return { inserted: result.inserted, bounce, unsub };
}

async function flagUpcomingCallRiskOnBounce(bouncedEmail: string): Promise<void> {
  const supabase = requireSupabaseAdmin();
  const leadId = await findLeadIdByEmail(bouncedEmail);
  if (!leadId) return;

  const { data: calls } = await supabase
    .from("lead_calls")
    .select("id, call_status, scheduled_start")
    .eq("lead_id", leadId)
    .in("call_status", ["booked", "confirmed"])
    .gte("scheduled_start", new Date().toISOString())
    .limit(5);

  for (const c of calls ?? []) {
    try {
      await applyCallAttendance({
        callId: c.id,
        decision: "flag_risk",
        source: "cron",
        actor: "gmail-sync",
        riskReason: "confirmation_email_bounced",
        riskSource: "gmail_sync",
        notes: `Outbound email to ${bouncedEmail} bounced — parent may not have received the booking confirmation.`
      });
    } catch (e) {
      console.warn("gmail-sync: flag_risk failed", c.id, e instanceof Error ? e.message : e);
    }
  }
}

async function maybeConfirmCallFromReply(leadId: string): Promise<void> {
  const supabase = requireSupabaseAdmin();
  const { data: calls } = await supabase
    .from("lead_calls")
    .select("id, call_status, scheduled_start, confirmed_at, no_show_risk")
    .eq("lead_id", leadId)
    .in("call_status", ["booked", "confirmed"])
    .gte("scheduled_start", new Date().toISOString())
    .order("scheduled_start", { ascending: true })
    .limit(1);

  const next = calls?.[0];
  if (!next) return;

  // Skip if already confirmed AND risk already clear — nothing to do.
  if (next.confirmed_at && next.no_show_risk === false) return;

  try {
    await applyCallAttendance({
      callId: next.id,
      decision: "confirm_received",
      source: "cron",
      actor: "gmail-sync",
      confirmationSource: "reply",
      notes: "Inbound reply received before the call — auto-confirmed and cleared risk flag."
    });
  } catch (e) {
    console.warn("gmail-sync: confirm_received failed", next.id, e instanceof Error ? e.message : e);
  }
}

function parseDateHeader(value: string): Date | null {
  if (!value) return null;
  const ts = Date.parse(value);
  return Number.isFinite(ts) ? new Date(ts) : null;
}

function parseInternalDate(value: string | undefined): Date | null {
  if (!value) return null;
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  return new Date(n);
}
