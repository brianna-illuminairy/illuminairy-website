/**
 * Book via Calendly Scheduling API — Plan Builder B free lesson event.
 * Requires paid Calendly plan + CALENDLY_API_TOKEN.
 */

import { site } from "@/lib/site";
import {
  fetchEventTypeBookingMeta,
  type EventTypeBookingMeta,
} from "@/lib/calendly/funnel-availability";
import { calendlyBookErrorFromResponse } from "@/lib/calendly/book-invitee-errors";
import { phoneToCalendlyE164 } from "@/lib/calendly/phone-e164";

const CALENDLY_API = "https://api.calendly.com";
const BOOKING_TZ = "America/New_York";

export type BookFreeLessonInput = {
  startTime: string;
  parentName: string;
  parentEmail: string;
  parentPhone?: string;
  kidName?: string;
};

function splitName(full: string) {
  const parts = full.trim().split(/\s+/);
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

async function calendlyPost<T>(path: string, token: string, body: unknown): Promise<T> {
  const res = await fetch(`${CALENDLY_API}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw calendlyBookErrorFromResponse(res.status, text);
  }
  return res.json() as Promise<T>;
}

export type BookFreeLessonResult = {
  inviteeUri: string;
  startTime: string;
};

/** Create invitee at `startTime` on the free lesson Calendly event. */
export async function bookFreeLessonInvitee(
  token: string,
  input: BookFreeLessonInput,
  options?: { publicUrl?: string; meta?: EventTypeBookingMeta }
): Promise<BookFreeLessonResult> {
  const publicUrl = options?.publicUrl ?? site.freeLessonCalendlyUrl;
  const meta =
    options?.meta ?? (await fetchEventTypeBookingMeta(token, publicUrl));
  const name = input.parentName.trim();
  const email = input.parentEmail.trim().toLowerCase();
  const smsNumber = phoneToCalendlyE164(input.parentPhone);
  const { firstName, lastName } = splitName(name);
  const kid = input.kidName?.trim();

  const invitee: Record<string, unknown> = {
    name,
    first_name: firstName,
    last_name: lastName || firstName,
    email,
    timezone: BOOKING_TZ,
  };
  if (smsNumber) {
    invitee.text_reminder_number = smsNumber;
  }

  const payload: Record<string, unknown> = {
    event_type: meta.eventTypeUri,
    start_time: input.startTime,
    invitee,
  };

  if (meta.locationKind) {
    payload.location = { kind: meta.locationKind };
  }

  if (kid && meta.kidQuestion) {
    payload.questions_and_answers = [
      {
        question: meta.kidQuestion.name,
        answer: kid,
        position: meta.kidQuestion.position,
      },
    ];
  }

  const data = await calendlyPost<{
    resource?: { uri?: string; event?: string };
  }>("/invitees", token, payload);

  const inviteeUri = data.resource?.uri ?? "";
  if (!inviteeUri) {
    throw new Error("Calendly booking succeeded without invitee uri");
  }

  return { inviteeUri, startTime: input.startTime };
}
