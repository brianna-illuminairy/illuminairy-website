/**
 * Google Drive API v3 wrapper for finding Gemini Notes / transcripts.
 *
 * Workspace Gemini Notes attaches itself as a Google Doc named like
 * "Strategy Call with <Name> — <Date> - Notes by Gemini" to the meeting
 * organizer's Drive. The transcript shows up as a separate doc:
 * "<event title> - Transcript".
 *
 * We search by event time + invitee name; the cron then reads the doc body
 * via the Docs API.
 */

import { googleFetchJson } from "@/lib/integrations/google/client";

const BASE = "https://www.googleapis.com/drive/v3";

export type DriveFile = {
  id: string;
  name: string;
  mimeType: string;
  webViewLink?: string;
  createdTime?: string;
  modifiedTime?: string;
};

export async function searchDriveFiles(args: {
  ownerEmail: string;
  query: string;
  pageSize?: number;
}): Promise<DriveFile[]> {
  const params = new URLSearchParams({
    q: args.query,
    pageSize: String(args.pageSize ?? 20),
    fields: "files(id,name,mimeType,webViewLink,createdTime,modifiedTime)"
  });
  const data = await googleFetchJson<{ files?: DriveFile[] }>(
    `${BASE}/files?${params.toString()}`,
    { ownerEmail: args.ownerEmail }
  );
  return data.files ?? [];
}

/**
 * Find Gemini Notes / Transcript Docs created within a window around the
 * call's start time. Returns the most-recently-modified match.
 */
export async function findCallNotesDoc(args: {
  ownerEmail: string;
  callStart: Date;
  callEnd: Date;
  parentLast?: string | null;
}): Promise<{ notes: DriveFile | null; transcript: DriveFile | null }> {
  const startWindow = new Date(args.callStart.getTime() - 3600_000).toISOString();
  const endWindow = new Date(args.callEnd.getTime() + 24 * 3600_000).toISOString();
  const nameTokens = ["Gemini", "Notes by Gemini", "Transcript"];
  const conds: string[] = [
    "mimeType = 'application/vnd.google-apps.document'",
    `modifiedTime > '${startWindow}'`,
    `modifiedTime < '${endWindow}'`,
    "trashed = false"
  ];
  const orClause = nameTokens.map((t) => `name contains '${t.replace(/'/g, "\\'")}'`).join(" or ");
  conds.push(`(${orClause})`);
  if (args.parentLast) {
    // Boost match probability — Workspace prefixes doc names with attendee names.
    conds.push(`name contains '${args.parentLast.replace(/'/g, "\\'")}'`);
  }
  const q = conds.join(" and ");
  const files = await searchDriveFiles({ ownerEmail: args.ownerEmail, query: q });

  let notes: DriveFile | null = null;
  let transcript: DriveFile | null = null;
  for (const f of files) {
    const lower = f.name.toLowerCase();
    if (lower.includes("transcript")) {
      if (!transcript || (f.modifiedTime ?? "") > (transcript.modifiedTime ?? "")) {
        transcript = f;
      }
    } else if (lower.includes("notes") || lower.includes("gemini")) {
      if (!notes || (f.modifiedTime ?? "") > (notes.modifiedTime ?? "")) {
        notes = f;
      }
    }
  }
  return { notes, transcript };
}
