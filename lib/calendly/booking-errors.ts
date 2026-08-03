/**
 * Codes for quiz s5 booking failures — PostHog + CRM touch_events.
 */

export type QuizBookingErrorCode =
  | "invalid_phone"
  | "invalid_contact"
  | "tcpa_required"
  | "phone_verify_required"
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
  if (options?.apiCode === "invalid_contact") return "invalid_contact";
  if (options?.apiCode === "tcpa_required") return "tcpa_required";
  if (options?.apiCode === "phone_verify_required") return "phone_verify_required";
  if (options?.apiCode === "lead_save_failed") return "lead_save_failed";
  if (options?.apiCode === "no_slot") return "no_slot";
  if (options?.apiCode === "slot_taken") return "slot_taken";
  if (options?.apiCode === "calendly_api") return "calendly_api";
  if (options?.apiCode === "availability_load") return "availability_load";
  if (options?.apiCode === "network") return "network";
  const lower = message.toLowerCase();
  if (lower.includes("verify") && lower.includes("phone")) return "phone_verify_required";
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
