const DISPLAY_TZ = "America/New_York";
export const FREE_LESSON_DURATION_MIN = 45;
const JOIN_EARLY_MS = 5 * 60 * 1000;

export type PortalLessonJoinState =
  | { kind: "disabled"; label: string; href?: undefined }
  | { kind: "active"; label: string; href: string }
  | { kind: "past"; label: string; href?: undefined };

export function formatPortalLessonDateLine(iso: string): {
  monthDayTz: string;
  weekdayTimeRange: string;
} {
  const start = new Date(iso);
  const end = new Date(start.getTime() + FREE_LESSON_DURATION_MIN * 60_000);

  const monthDayTz = new Intl.DateTimeFormat("en-US", {
    timeZone: DISPLAY_TZ,
    month: "long",
    day: "numeric",
    timeZoneName: "short",
  }).format(start);

  const weekday = new Intl.DateTimeFormat("en-US", {
    timeZone: DISPLAY_TZ,
    weekday: "long",
  }).format(start);

  const startTime = new Intl.DateTimeFormat("en-US", {
    timeZone: DISPLAY_TZ,
    hour: "numeric",
    minute: "2-digit",
  }).format(start);

  const endTime = new Intl.DateTimeFormat("en-US", {
    timeZone: DISPLAY_TZ,
    hour: "numeric",
    minute: "2-digit",
  }).format(end);

  return {
    monthDayTz,
    weekdayTimeRange: `${weekday}, ${startTime}–${endTime}`,
  };
}

function daysUntil(from: Date, to: Date): number {
  const a = new Date(from);
  a.setHours(0, 0, 0, 0);
  const b = new Date(to);
  b.setHours(0, 0, 0, 0);
  return Math.max(0, Math.round((b.getTime() - a.getTime()) / 86_400_000));
}

export function portalLessonJoinState(
  scheduledStart: string | null,
  meetLink: string | null,
  now = new Date()
): PortalLessonJoinState {
  if (!scheduledStart) {
    return { kind: "disabled", label: "Lesson time pending" };
  }

  const start = new Date(scheduledStart);
  const end = new Date(start.getTime() + FREE_LESSON_DURATION_MIN * 60_000);
  const openAt = start.getTime() - JOIN_EARLY_MS;

  if (now.getTime() > end.getTime()) {
    return { kind: "past", label: "Lesson completed" };
  }

  if (now.getTime() >= openAt && meetLink) {
    return { kind: "active", label: "Join lesson", href: meetLink };
  }

  if (!meetLink) {
    const days = daysUntil(now, start);
    if (days === 0) return { kind: "disabled", label: "Join link loads soon" };
    if (days === 1) return { kind: "disabled", label: "Join lesson tomorrow" };
    return { kind: "disabled", label: `Join lesson in ${days} days` };
  }

  const days = daysUntil(now, start);
  if (days === 0) {
    return { kind: "disabled", label: "Join lesson opens 5 min before start" };
  }
  if (days === 1) {
    return { kind: "disabled", label: "Join lesson in 1 day" };
  }
  return { kind: "disabled", label: `Join lesson in ${days} days` };
}

export function googleCalendarUrl(input: {
  title: string;
  startIso: string;
  durationMin?: number;
  details?: string;
  location?: string;
}): string {
  const start = new Date(input.startIso);
  const end = new Date(start.getTime() + (input.durationMin ?? FREE_LESSON_DURATION_MIN) * 60_000);
  const fmt = (d: Date) =>
    d
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}/, "");

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: input.title,
    dates: `${fmt(start)}/${fmt(end)}`,
  });
  if (input.details) params.set("details", input.details);
  if (input.location) params.set("location", input.location);
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
