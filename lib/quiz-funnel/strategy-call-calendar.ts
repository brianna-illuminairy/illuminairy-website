/** Google Calendar add-event link for a booked strategy / plan review call (15 min). */

const CALL_DURATION_MS = 15 * 60 * 1000;

function toGoogleCalUtc(d: Date): string {
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

export function strategyCallGoogleCalendarUrl(startIso: string): string | null {
  const start = new Date(startIso);
  if (Number.isNaN(start.getTime())) return null;
  const end = new Date(start.getTime() + CALL_DURATION_MS);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: "Illuminairy SAT Strategy Call",
    dates: `${toGoogleCalUtc(start)}/${toGoogleCalUtc(end)}`,
    details: "Illuminairy SAT Strategy Call. See your email for the Calendly invite.",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
