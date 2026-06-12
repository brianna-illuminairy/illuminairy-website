import {
  PUBLIC_SAT_STRATEGY_CALL_CALENDLY_URL,
  PUBLIC_SKILL_DIAGNOSTIC_CALENDLY_URL
} from "@/lib/site";

export type CalendlyBookingKind = "strategy_call" | "skill_diagnostic" | "unknown";

/** Last path segment: sat-planning-session, skill-diagnostic, etc. */
export function calendlyEventSlug(publicUrl: string): string {
  const parts = new URL(publicUrl).pathname.split("/").filter(Boolean);
  return parts[parts.length - 1]?.toLowerCase() ?? "";
}

export function calendlyBookingKindFromPayload(
  payload: Record<string, unknown> | undefined
): CalendlyBookingKind {
  if (!payload) return "unknown";

  const diagnosticSlug = calendlyEventSlug(PUBLIC_SKILL_DIAGNOSTIC_CALENDLY_URL);
  const strategySlug = calendlyEventSlug(PUBLIC_SAT_STRATEGY_CALL_CALENDLY_URL);
  const blob = JSON.stringify(payload).toLowerCase();

  if (diagnosticSlug && blob.includes(diagnosticSlug)) {
    return "skill_diagnostic";
  }
  if (strategySlug && blob.includes(strategySlug)) {
    return "strategy_call";
  }

  const scheduled = payload.scheduled_event as Record<string, unknown> | undefined;
  const eventName =
    typeof scheduled?.name === "string" ? scheduled.name.toLowerCase() : "";

  if (eventName.includes("skill diagnostic") || eventName.includes("diagnostic assessment")) {
    return "skill_diagnostic";
  }
  if (
    eventName.includes("planning") ||
    eventName.includes("strategy") ||
    eventName.includes("consult")
  ) {
    return "strategy_call";
  }

  return "unknown";
}
