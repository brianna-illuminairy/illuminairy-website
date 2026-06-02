/** Extract scheduled event start ISO from Calendly webhook or embed postMessage payloads. */
export function strategyCallStartFromCalendlyWebhook(
  payload: Record<string, unknown> | undefined
): string | null {
  if (!payload) return null;

  const scheduled = payload.scheduled_event as Record<string, unknown> | undefined;
  if (typeof scheduled?.start_time === "string") return scheduled.start_time;

  const event = payload.event as Record<string, unknown> | undefined;
  if (typeof event?.start_time === "string") return event.start_time;

  const invitee = payload.invitee as Record<string, unknown> | undefined;
  const inviteeScheduled = invitee?.scheduled_event as Record<string, unknown> | undefined;
  if (typeof inviteeScheduled?.start_time === "string") return inviteeScheduled.start_time;

  return null;
}
