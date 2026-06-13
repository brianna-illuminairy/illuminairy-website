/**
 * Minimal Google Calendar API wrapper.
 *
 * Used to resolve the real meet.google.com URL for a Calendly booking. Calendly's
 * `location.join_url` is a redirector (`calendly.com/events/.../google_meet`),
 * not the actual Meet URL, so the Meet space code lives on the Calendar event
 * Calendly created in the host's primary calendar.
 *
 * Scope required: `https://www.googleapis.com/auth/calendar.events.readonly`
 * (already granted as part of CRM v4).
 */

import { googleFetchJson } from "@/lib/integrations/google/client";

const BASE = "https://www.googleapis.com/calendar/v3";

export type CalendarEvent = {
  id: string;
  summary?: string;
  start?: { dateTime?: string; date?: string };
  end?: { dateTime?: string; date?: string };
  hangoutLink?: string;
  conferenceData?: {
    entryPoints?: Array<{
      entryPointType?: string; // "video" for Meet
      uri?: string; // "https://meet.google.com/abc-defg-hij"
      label?: string;
    }>;
    conferenceSolution?: { name?: string };
    conferenceId?: string;
  };
};

/**
 * Fetch a single event from the owner's primary calendar by Google event id.
 * Calendly stores this id as `calendar_event.external_id` on its scheduled
 * events. Returns null on 404 so callers can degrade gracefully.
 */
export async function getCalendarEvent(args: {
  ownerEmail?: string;
  calendarId?: string;
  eventId: string;
}): Promise<CalendarEvent | null> {
  const cal = encodeURIComponent(args.calendarId ?? "primary");
  const id = encodeURIComponent(args.eventId);
  try {
    return await googleFetchJson<CalendarEvent>(
      `${BASE}/calendars/${cal}/events/${id}`,
      { ownerEmail: args.ownerEmail }
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes("404")) return null;
    throw e;
  }
}

/**
 * Pull the Meet URL off a Calendar event. Returns null if the event has no
 * Meet attached (e.g. it's a Zoom/phone meeting, or the Meet was removed).
 */
export function meetUrlFromCalendarEvent(ev: CalendarEvent): string | null {
  if (ev.hangoutLink) return ev.hangoutLink;
  const entries = ev.conferenceData?.entryPoints ?? [];
  const video = entries.find(
    (e) =>
      e.entryPointType === "video" &&
      typeof e.uri === "string" &&
      e.uri.includes("meet.google.com")
  );
  return video?.uri ?? null;
}
