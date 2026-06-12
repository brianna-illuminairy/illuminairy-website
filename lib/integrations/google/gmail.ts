/**
 * Gmail API wrapper for CRM v4 inbox/outbox sync.
 *
 * Docs: https://developers.google.com/gmail/api/reference/rest
 *
 * Endpoints used:
 *   - users.getProfile           (resolve `historyId` for initial baseline)
 *   - users.history.list         (incremental sync once we have a historyId)
 *   - users.messages.list        (bootstrap path when no historyId yet)
 *   - users.messages.get         (fetch full message for body + headers)
 */

import { googleFetchJson } from "@/lib/integrations/google/client";

const BASE = "https://gmail.googleapis.com/gmail/v1/users";

export type GmailProfile = {
  emailAddress: string;
  messagesTotal: number;
  threadsTotal: number;
  historyId: string; // numeric string
};

export type GmailMessageRef = {
  id: string;
  threadId: string;
};

export type GmailHistoryRecord = {
  id: string;
  messages?: GmailMessageRef[];
  messagesAdded?: { message: GmailMessageRef }[];
  messagesDeleted?: { message: GmailMessageRef }[];
  labelsAdded?: { message: GmailMessageRef; labelIds: string[] }[];
  labelsRemoved?: { message: GmailMessageRef; labelIds: string[] }[];
};

export type GmailHistoryResponse = {
  history?: GmailHistoryRecord[];
  nextPageToken?: string;
  historyId: string;
};

export type GmailMessageHeader = { name: string; value: string };

export type GmailMessagePart = {
  partId?: string;
  mimeType: string;
  filename?: string;
  headers?: GmailMessageHeader[];
  body?: { size: number; data?: string; attachmentId?: string };
  parts?: GmailMessagePart[];
};

export type GmailMessage = {
  id: string;
  threadId: string;
  labelIds?: string[];
  snippet?: string;
  historyId?: string;
  internalDate?: string; // ms epoch as string
  payload?: GmailMessagePart;
  sizeEstimate?: number;
};

export async function getProfile(ownerEmail: string): Promise<GmailProfile> {
  return googleFetchJson<GmailProfile>(`${BASE}/${encodeURIComponent(ownerEmail)}/profile`, {
    ownerEmail
  });
}

export async function listHistorySince(args: {
  ownerEmail: string;
  startHistoryId: string;
  pageToken?: string;
  pageSize?: number;
}): Promise<GmailHistoryResponse> {
  const params = new URLSearchParams({
    startHistoryId: args.startHistoryId,
    maxResults: String(args.pageSize ?? 500)
  });
  if (args.pageToken) params.set("pageToken", args.pageToken);
  return googleFetchJson<GmailHistoryResponse>(
    `${BASE}/${encodeURIComponent(args.ownerEmail)}/history?${params.toString()}`,
    { ownerEmail: args.ownerEmail }
  );
}

export async function listMessages(args: {
  ownerEmail: string;
  q?: string;
  pageToken?: string;
  maxResults?: number;
}): Promise<{ messages?: GmailMessageRef[]; nextPageToken?: string }> {
  const params = new URLSearchParams({
    maxResults: String(args.maxResults ?? 100)
  });
  if (args.q) params.set("q", args.q);
  if (args.pageToken) params.set("pageToken", args.pageToken);
  return googleFetchJson(
    `${BASE}/${encodeURIComponent(args.ownerEmail)}/messages?${params.toString()}`,
    { ownerEmail: args.ownerEmail }
  );
}

export async function getMessage(args: {
  ownerEmail: string;
  messageId: string;
  format?: "minimal" | "metadata" | "full" | "raw";
}): Promise<GmailMessage> {
  const params = new URLSearchParams({ format: args.format ?? "full" });
  return googleFetchJson<GmailMessage>(
    `${BASE}/${encodeURIComponent(args.ownerEmail)}/messages/${args.messageId}?${params.toString()}`,
    { ownerEmail: args.ownerEmail }
  );
}

// ---------------------------------------------------------------------------
// Message parsing helpers
// ---------------------------------------------------------------------------

export function headerValue(headers: GmailMessageHeader[] | undefined, name: string): string {
  if (!headers) return "";
  const lower = name.toLowerCase();
  const h = headers.find((hh) => hh.name.toLowerCase() === lower);
  return h?.value ?? "";
}

export function decodeBody(data?: string): string {
  if (!data) return "";
  // Gmail returns URL-safe base64 (replace - with +, _ with /).
  const b64 = data.replace(/-/g, "+").replace(/_/g, "/");
  try {
    return Buffer.from(b64, "base64").toString("utf8");
  } catch {
    return "";
  }
}

export type ExtractedBody = {
  text: string;
  html: string;
  attachments: Array<{
    filename: string;
    mimeType: string;
    size: number;
    attachmentId: string | null;
  }>;
};

export function extractBody(part: GmailMessagePart | undefined): ExtractedBody {
  const acc: ExtractedBody = { text: "", html: "", attachments: [] };
  if (!part) return acc;
  walk(part, acc);
  return acc;
}

function walk(part: GmailMessagePart, acc: ExtractedBody): void {
  const mime = part.mimeType ?? "";
  if (part.parts && part.parts.length > 0) {
    for (const p of part.parts) walk(p, acc);
    return;
  }
  if (mime === "text/plain" && part.body?.data) {
    acc.text += (acc.text ? "\n\n" : "") + decodeBody(part.body.data);
    return;
  }
  if (mime === "text/html" && part.body?.data) {
    acc.html += (acc.html ? "\n\n" : "") + decodeBody(part.body.data);
    return;
  }
  if (part.filename && (part.body?.attachmentId || (part.body?.size ?? 0) > 0)) {
    acc.attachments.push({
      filename: part.filename,
      mimeType: mime,
      size: part.body?.size ?? 0,
      attachmentId: part.body?.attachmentId ?? null
    });
  }
}

export function parseEmailHeader(value: string): { email: string; name: string } {
  // Patterns: "Name <email@x>" | "email@x" | "<email@x>"
  const m = /^\s*(?:"?([^"<>]*?)"?\s*)?<?([^<>\s]+@[^<>\s]+)>?\s*$/.exec(value);
  if (m) {
    return { name: (m[1] ?? "").trim(), email: m[2].trim().toLowerCase() };
  }
  return { name: "", email: value.trim().toLowerCase() };
}

export function parseAddressList(value: string): Array<{ email: string; name: string }> {
  if (!value) return [];
  return value
    .split(",")
    .map((part) => parseEmailHeader(part))
    .filter((p) => p.email.includes("@"));
}

/** True when this Gmail message looks like a delivery-status notification (bounce). */
export function isBounceMessage(message: GmailMessage): boolean {
  const headers = message.payload?.headers;
  const contentType = headerValue(headers, "Content-Type").toLowerCase();
  if (contentType.includes("multipart/report") && contentType.includes("delivery-status")) {
    return true;
  }
  const from = headerValue(headers, "From").toLowerCase();
  if (/(mailer-daemon|postmaster|delivery)/i.test(from)) return true;
  const subject = headerValue(headers, "Subject").toLowerCase();
  if (/(undeliverable|delivery status notification|address rejected|bounce|failed to deliver)/i.test(subject)) {
    return true;
  }
  return false;
}

/** Returns the unsubscribe URL or mailto from List-Unsubscribe header, if present. */
export function unsubscribeFromHeaders(headers: GmailMessageHeader[] | undefined): string | null {
  const lu = headerValue(headers, "List-Unsubscribe");
  if (!lu) return null;
  // Pick first <...> entry.
  const m = /<([^>]+)>/.exec(lu);
  return m ? m[1].trim() : lu.trim();
}

/** Best-effort: extract bounced recipient email from a DSN-style message body. */
export function extractBouncedRecipient(message: GmailMessage): string | null {
  const body = extractBody(message.payload);
  const search = (body.text || body.html).slice(0, 8000);
  const m = /Final-Recipient:\s*rfc822;\s*([^\s\r\n]+@[^\s\r\n]+)/i.exec(search);
  if (m) return m[1].trim().toLowerCase();
  const m2 = /To:\s*<?([^\s<>\r\n]+@[^\s<>\r\n]+)>?/i.exec(search);
  if (m2) return m2[1].trim().toLowerCase();
  return null;
}
