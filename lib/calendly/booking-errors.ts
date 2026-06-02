/**
 * Codes for quiz s5 booking failures — PostHog + CRM touch_events.
 */

export type QuizBookingErrorCode =
  | "invalid_phone"
  | "lead_save_failed"
  | "no_slot"
  | "slot_taken"
  | "calendly_api"
  | "availability_load"
  | "network"
  | "unknown";

export function classifyBookingError(
  message: string,
  options?: { httpStatus?: number; apiCode?: string }
): QuizBookingErrorCode {
  if (options?.apiCode === "invalid_phone") return "invalid_phone";
  const lower = message.toLowerCase();
  if (lower.includes("invalid") && lower.includes("phone")) return "invalid_phone";
  if (lower.includes("pick a time") || lower.includes("no_slot")) return "no_slot";
  if (lower.includes("no longer available") || lower.includes("just taken")) {
    return "slot_taken";
  }
  if (lower.includes("availability") || lower.includes("load times")) {
    return "availability_load";
  }
  if (lower.includes("could not save") || lower.includes("lead")) {
    return "lead_save_failed";
  }
  if (lower.includes("not configured") || lower.includes("scheduling api")) {
    return "calendly_api";
  }
  if (options?.httpStatus === 503) return "calendly_api";
  if (options?.httpStatus && options.httpStatus >= 500) return "calendly_api";
  if (lower.includes("calendly post")) return "calendly_api";
  if (lower.includes("connection") || lower.includes("network")) return "network";
  return "unknown";
}

/** Short message safe for analytics (no PII). */
export function sanitizeBookingErrorMessage(message: string, maxLen = 160): string {
  return message.replace(/\S+@\S+\.\S+/g, "[email]").slice(0, maxLen);
}
