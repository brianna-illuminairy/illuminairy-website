import { site, PUBLIC_FREE_LESSON_CALENDLY_URL } from "@/lib/site";

/** Event slug from a public Calendly URL (e.g. `tutoring-session`). */
export function calendlyEventSlugFromPublicUrl(url: string): string | null {
  try {
    const parts = new URL(url).pathname.split("/").filter(Boolean);
    return parts.length >= 2 ? parts[1] : null;
  } catch {
    return null;
  }
}

export function freeLessonCalendlyEventSlug(): string {
  return calendlyEventSlugFromPublicUrl(site.freeLessonCalendlyUrl) ?? "tutoring-session";
}

/** True when a Calendly scheduled event URI or invitee payload refers to the free lesson event. */
export function isFreeLessonCalendlyEvent(input: {
  scheduledEventUri?: string | null;
  eventTypeUri?: string | null;
  eventName?: string | null;
}): boolean {
  const slug = freeLessonCalendlyEventSlug();
  const haystack = [
    input.scheduledEventUri ?? "",
    input.eventTypeUri ?? "",
    input.eventName ?? "",
    PUBLIC_FREE_LESSON_CALENDLY_URL,
    site.freeLessonCalendlyUrl,
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(slug.toLowerCase());
}
