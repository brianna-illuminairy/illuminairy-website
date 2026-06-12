/**
 * Google Meet REST API v2 wrapper.
 *
 * Docs: https://developers.google.com/workspace/meet/api/reference/rest
 *
 * For CRM v4 we use three endpoints:
 *   - spaces.get (find a space by meeting code so we can resolve conferences)
 *   - conferenceRecords.list (past conferences for a given space)
 *   - conferenceRecords.participants.list (who joined)
 *
 * Meeting code = the URL slug from `meet.google.com/<code>`, e.g.
 * `abc-defg-hij`. Calendly attaches this to every booked event.
 */

import { googleFetchJson } from "@/lib/integrations/google/client";
import { recordHeartbeat } from "@/lib/integrations/heartbeat";

const BASE = "https://meet.googleapis.com/v2";

export type MeetSpace = {
  name: string;          // "spaces/{spaceId}"
  meetingUri: string;    // https://meet.google.com/...
  meetingCode: string;   // abc-defg-hij
};

export type MeetConferenceRecord = {
  name: string;          // "conferenceRecords/{conferenceId}"
  startTime: string;     // RFC3339
  endTime?: string;
  expireTime?: string;
  space: string;         // "spaces/{spaceId}"
};

export type MeetParticipant = {
  name: string;          // conferenceRecords/.../participants/{participantId}
  earliestStartTime?: string;
  latestEndTime?: string;
  signedinUser?: { user?: string; displayName?: string };
  anonymousUser?: { displayName?: string };
  phoneUser?: { displayName?: string };
};

export type MeetParticipantSession = {
  name: string;
  startTime?: string;
  endTime?: string;
};

/**
 * Look up a space by its meeting code. Returns null if the space no longer
 * exists or has never been used.
 */
export async function getMeetSpaceByCode(meetingCode: string): Promise<MeetSpace | null> {
  const path = `${BASE}/spaces/${encodeURIComponent(meetingCode)}`;
  try {
    const res = await googleFetchJson<MeetSpace>(path);
    void recordHeartbeat({ provider: "google_meet", status: "ok" });
    return res;
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes(" 404 ") || msg.includes("NOT_FOUND")) return null;
    throw e;
  }
}

/**
 * List past conferences for a given space. The API returns most-recent first
 * by default. We constrain with the optional pageSize.
 */
export async function listConferenceRecordsForSpace(
  spaceName: string,
  pageSize = 5
): Promise<MeetConferenceRecord[]> {
  const filter = `space.name="${spaceName}"`;
  const params = new URLSearchParams({ filter, pageSize: String(pageSize) });
  const data = await googleFetchJson<{ conferenceRecords?: MeetConferenceRecord[] }>(
    `${BASE}/conferenceRecords?${params.toString()}`
  );
  return data.conferenceRecords ?? [];
}

/**
 * List participants of a conference. Returns email (for org-internal),
 * displayName (for anonymous external attendees), or phone (for dial-in).
 */
export async function listConferenceParticipants(
  conferenceRecordName: string,
  pageSize = 50
): Promise<MeetParticipant[]> {
  const params = new URLSearchParams({ pageSize: String(pageSize) });
  const data = await googleFetchJson<{ participants?: MeetParticipant[] }>(
    `${BASE}/${encodeURIComponent(conferenceRecordName).replace(/%2F/g, "/")}/participants?${params.toString()}`
  );
  return data.participants ?? [];
}

/**
 * For org-internal signed-in users, the `user` field is a People API resource
 * name (e.g. `users/123`). To get their email, fetch /v1/people endpoints.
 * To avoid an extra hop, we let the caller pass the User Workspace directory
 * and rely on `signedinUser.user` matching only for our internal user (owner).
 * External parents will always be in `anonymousUser.displayName`.
 *
 * Helper: extract a normalized "identity" tuple from a participant.
 */
export function participantIdentity(p: MeetParticipant): {
  kind: "signedin" | "anonymous" | "phone";
  displayName: string;
} {
  if (p.signedinUser) {
    return { kind: "signedin", displayName: p.signedinUser.displayName ?? "" };
  }
  if (p.anonymousUser) {
    return { kind: "anonymous", displayName: p.anonymousUser.displayName ?? "" };
  }
  return { kind: "phone", displayName: p.phoneUser?.displayName ?? "" };
}

/**
 * Extracts a Google Meet meeting code from a meet URL or an arbitrary string.
 * Returns null if no meet URL was found.
 *
 *   https://meet.google.com/abc-defg-hij        -> "abc-defg-hij"
 *   "Join: meet.google.com/abc-defg-hij?ts=42"  -> "abc-defg-hij"
 */
export function extractMeetCode(input: string | null | undefined): string | null {
  if (!input) return null;
  const re = /meet\.google\.com\/([a-z]{3,}-[a-z]{3,}-[a-z]{3,})/i;
  const m = re.exec(input);
  return m ? m[1].toLowerCase() : null;
}

/**
 * Extracts a Meet link from a Calendly invitee/event payload. Falls back to
 * deep-scanning the JSON blob for a meet.google.com URL.
 */
export function meetLinkFromCalendlyPayload(payload: unknown): {
  meetLink: string | null;
  meetCode: string | null;
} {
  if (!payload || typeof payload !== "object") {
    return { meetLink: null, meetCode: null };
  }

  // Common shapes: payload.location.join_url, payload.scheduled_event.location.join_url
  const locations: unknown[] = [];
  const p = payload as Record<string, unknown>;
  const loc = p.location as Record<string, unknown> | undefined;
  if (loc?.join_url) locations.push(loc.join_url);
  if (loc?.location) locations.push(loc.location);
  const se = p.scheduled_event as Record<string, unknown> | undefined;
  const seLoc = se?.location as Record<string, unknown> | undefined;
  if (seLoc?.join_url) locations.push(seLoc.join_url);
  if (seLoc?.location) locations.push(seLoc.location);

  for (const candidate of locations) {
    if (typeof candidate === "string") {
      const code = extractMeetCode(candidate);
      if (code) {
        return { meetLink: candidate, meetCode: code };
      }
    }
  }

  // Last resort: scan the whole JSON.
  const blob = JSON.stringify(payload);
  const code = extractMeetCode(blob);
  if (code) {
    return { meetLink: `https://meet.google.com/${code}`, meetCode: code };
  }
  return { meetLink: null, meetCode: null };
}
