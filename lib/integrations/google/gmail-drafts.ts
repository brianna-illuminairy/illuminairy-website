/**
 * Create a Gmail draft (uses `gmail.compose` scope; does NOT send).
 *
 * Returns the draft id, which we store on `lead_calls.gmail_draft_id` so the
 * Calls tab can deep-link to it via:
 *   https://mail.google.com/mail/u/0/#drafts/{draftId}
 */

import { googleFetchJson } from "@/lib/integrations/google/client";

const BASE = "https://gmail.googleapis.com/gmail/v1/users";

export type DraftReply = {
  id: string;
  message: { id: string; threadId: string };
};

export async function createGmailDraft(args: {
  ownerEmail: string;
  to: string;
  subject: string;
  bodyText: string;
  threadId?: string;
  inReplyTo?: string | null;
  references?: string | null;
}): Promise<DraftReply> {
  const headers = [
    `To: ${args.to}`,
    `From: ${args.ownerEmail}`,
    `Subject: ${args.subject}`,
    "MIME-Version: 1.0",
    'Content-Type: text/plain; charset="UTF-8"',
    "Content-Transfer-Encoding: 7bit"
  ];
  if (args.inReplyTo) headers.push(`In-Reply-To: ${args.inReplyTo}`);
  if (args.references) headers.push(`References: ${args.references}`);

  const raw = `${headers.join("\r\n")}\r\n\r\n${args.bodyText}\r\n`;
  const encoded = Buffer.from(raw, "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  const body = {
    message: {
      raw: encoded,
      ...(args.threadId ? { threadId: args.threadId } : {})
    }
  };

  return googleFetchJson<DraftReply>(
    `${BASE}/${encodeURIComponent(args.ownerEmail)}/drafts`,
    {
      ownerEmail: args.ownerEmail,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    }
  );
}
