/**
 * Calendly SMS reminders require E.164 (e.g. +14045551234).
 * SAT Plan Builder booking is US-only — NANP numbers only (+1).
 *
 * Normalization is synchronous string parsing only — no libphonenumber, no API,
 * no work on keystroke beyond optional client checks. E.164 is built once on book.
 */

export const BOOKING_PHONE_REGION = "US" as const;

export const BOOKING_PHONE_HINT =
  "US mobile with area code (example: 404-555-1234). You do not need +1; we add the US country code for confirmation texts.";

export const BOOKING_PHONE_INVALID_MSG =
  "Enter a valid US mobile with area code: 10 digits, or 11 digits starting with 1 (example: 404-555-1234 or 1-404-555-1234). International numbers are not supported on this form.";

/** Short inline error under the field (no digit counts while typing). */
export const BOOKING_PHONE_INLINE_INVALID_MSG =
  "Enter a valid 10-digit US mobile number.";

/** Count digits only (ignores spaces, dashes, parentheses). */
export function countPhoneDigits(raw: string): number {
  return raw.replace(/\D/g, "").length;
}

/** True when we can build Calendly E.164 (US 10-digit or 1 + 10-digit). */
export function isValidBookingPhone(raw: string | undefined): boolean {
  return phoneToCalendlyE164(raw) !== null;
}

/**
 * Standard inline validation: do not nag while the parent is still typing.
 * Show after blur, or once they have entered 10+ digits that still fail.
 */
export function showBookingPhoneInlineError(
  raw: string,
  options: { touched?: boolean } = {}
): boolean {
  const trimmed = raw.trim();
  if (!trimmed || isValidBookingPhone(trimmed)) return false;
  if (options.touched) return true;
  return countPhoneDigits(trimmed) >= 10;
}

/** Normalize US (NANP) input for Calendly `text_reminder_number`. */
export function phoneToCalendlyE164(raw: string | undefined): string | null {
  const trimmed = raw?.trim();
  if (!trimmed) return null;

  const digits = trimmed.replace(/\D/g, "");
  if (digits.length === 10) {
    return `+1${digits}`;
  }
  if (digits.length === 11 && digits.startsWith("1")) {
    return `+${digits}`;
  }

  return null;
}

/** Parent-facing error from Calendly API or our validation. */
export function friendlyCalendlyBookError(raw: string): string {
  const lower = raw.toLowerCase();
  if (
    lower.includes("text_reminder_number") ||
    lower.includes("phone_number") ||
    (lower.includes("invalid") && lower.includes("phone"))
  ) {
    return BOOKING_PHONE_INVALID_MSG;
  }
  if (lower.includes("start_time") && lower.includes("no longer available")) {
    return "That time was just taken. Pick another slot.";
  }
  if (lower.includes("start_time")) {
    return "That time is no longer available. Pick another slot.";
  }
  if (raw.length > 180) {
    return "Could not confirm that time. Try another slot or email support@illuminairy.com.";
  }
  return raw;
}
