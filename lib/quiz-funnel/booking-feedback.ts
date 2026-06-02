import {
  classifyBookingError,
  type QuizBookingErrorCode,
} from "@/lib/calendly/booking-errors";
import {
  BOOKING_PHONE_INVALID_MSG,
  isValidBookingPhone,
} from "@/lib/calendly/phone-e164";

export type BookingFieldKey =
  | "parentName"
  | "parentEmail"
  | "parentPhone"
  | "kidName"
  | "confirmTcpa"
  | "slot";

export type BookingFieldErrors = Partial<Record<BookingFieldKey, string>>;

export type BookingContactInput = {
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  kidName: string;
  confirmTcpa: boolean;
  hasSlot: boolean;
};

/** Parent-facing copy — single source for s5 booking UX. */
export const BOOKING_FEEDBACK = {
  nameRequired: "Enter your name.",
  emailRequired: "Enter your email.",
  emailInvalid: "Enter a valid email address (example: you@gmail.com).",
  phoneRequired: "Enter your mobile number for confirmation texts.",
  phoneInvalid: BOOKING_PHONE_INVALID_MSG,
  kidRequired: "Enter your student's name.",
  tcpaRequired: "Check the box to agree we may contact you about this call.",
  slotRequired: "Pick a time to continue.",
  slotTaken: "That time was just taken. Choose another open slot.",
  /** Shown after we refresh the slot list from Calendly. */
  slotTakenStale:
    "That time just filled up (someone else may have booked it). We refreshed the open times below. Pick another.",
  leadSaveFailed:
    "We could not save your details. Check your connection and try again.",
  bookingFailed:
    "We could not confirm that time. Choose another slot or email support@illuminairy.com.",
  bookingUnavailable:
    "Online booking is temporarily unavailable. Email support@illuminairy.com and we will schedule your call.",
  network:
    "Connection problem. Check your internet and try again.",
  availabilityEmpty:
    "No open times in the next two weeks. Email support@illuminairy.com and we will find a time.",
  availabilityFailed:
    "Could not load open times. Check your connection and try again.",
  confirming: "Confirming your SAT Strategy Call…",
} as const;

const SUPPORT = "support@illuminairy.com";

function isValidEmail(raw: string): boolean {
  const v = raw.trim();
  if (!v.includes("@")) return false;
  const [local, domain] = v.split("@");
  return Boolean(local?.length && domain?.includes("."));
}

/** Client-side validation before submit (field-level errors). */
export function validateBookingContact(
  input: BookingContactInput
): { valid: boolean; errors: BookingFieldErrors } {
  const errors: BookingFieldErrors = {};
  const name = input.parentName.trim();
  const email = input.parentEmail.trim();
  const phone = input.parentPhone.trim();
  const kid = input.kidName.trim();

  if (!name) errors.parentName = BOOKING_FEEDBACK.nameRequired;
  if (!email) errors.parentEmail = BOOKING_FEEDBACK.emailRequired;
  else if (!isValidEmail(email)) errors.parentEmail = BOOKING_FEEDBACK.emailInvalid;
  if (!phone) errors.parentPhone = BOOKING_FEEDBACK.phoneRequired;
  else if (!isValidBookingPhone(phone)) errors.parentPhone = BOOKING_FEEDBACK.phoneInvalid;
  if (!kid) errors.kidName = BOOKING_FEEDBACK.kidRequired;
  if (!input.confirmTcpa) errors.confirmTcpa = BOOKING_FEEDBACK.tcpaRequired;
  if (!input.hasSlot) errors.slot = BOOKING_FEEDBACK.slotRequired;

  return { valid: Object.keys(errors).length === 0, errors };
}

export type BookingUserFeedback = {
  message: string;
  field?: BookingFieldKey;
  retryable: boolean;
  title?: string;
};

/** Map error code → UI feedback (banner + optional field highlight). */
export function bookingFeedbackForCode(
  code: QuizBookingErrorCode,
  options?: { isDev?: boolean }
): BookingUserFeedback {
  switch (code) {
    case "invalid_phone":
      return {
        title: "Check your mobile number",
        message: BOOKING_FEEDBACK.phoneInvalid,
        field: "parentPhone",
        retryable: false,
      };
    case "no_slot":
      return {
        title: "Pick a time",
        message: BOOKING_FEEDBACK.slotRequired,
        field: "slot",
        retryable: false,
      };
    case "slot_taken":
      return {
        title: "That time just filled",
        message: BOOKING_FEEDBACK.slotTakenStale,
        field: "slot",
        retryable: false,
      };
    case "lead_save_failed":
      return {
        title: "Could not save your details",
        message: BOOKING_FEEDBACK.leadSaveFailed,
        retryable: true,
      };
    case "availability_load":
      return {
        title: "Times did not load",
        message: BOOKING_FEEDBACK.availabilityFailed,
        retryable: true,
      };
    case "network":
      return {
        title: "Connection problem",
        message: BOOKING_FEEDBACK.network,
        retryable: true,
      };
    case "calendly_api":
      return {
        title: "Booking unavailable",
        message: options?.isDev
          ? BOOKING_FEEDBACK.bookingUnavailable
          : `We could not confirm that time. Email ${SUPPORT} and we will schedule you.`,
        retryable: true,
      };
    default:
      return {
        title: "Something went wrong",
        message: BOOKING_FEEDBACK.bookingFailed,
        retryable: true,
      };
  }
}

export type ParsedFunnelApiError = BookingUserFeedback & {
  error_code: QuizBookingErrorCode;
  refresh_slots?: boolean;
};

/** Normalize `/api/funnel/*` error JSON for the client. */
export function parseFunnelApiError(
  data: Record<string, unknown> | null | undefined,
  httpStatus?: number
): ParsedFunnelApiError {
  const rawMessage =
    typeof data?.error === "string" ? data.error : BOOKING_FEEDBACK.bookingFailed;
  const apiCode =
    typeof data?.error_code === "string"
      ? data.error_code
      : typeof data?.code === "string"
        ? data.code
        : undefined;
  const code = classifyBookingError(rawMessage, { httpStatus, apiCode });
  const feedback = bookingFeedbackForCode(code, {
    isDev: typeof process !== "undefined" && process.env.NODE_ENV === "development",
  });

  const fieldFromApi =
    typeof data?.field === "string" ? (data.field as BookingFieldKey) : undefined;

  return {
    error_code: code,
    ...feedback,
    field: fieldFromApi ?? feedback.field,
    message:
      code === "unknown" && rawMessage.length < 120 && !rawMessage.includes("Calendly POST")
        ? rawMessage
        : feedback.message,
    retryable:
      typeof data?.retryable === "boolean" ? data.retryable : feedback.retryable,
    refresh_slots: data?.refresh_slots === true,
  };
}

export function parseAvailabilityApiResponse(
  data: Record<string, unknown> | null | undefined,
  httpStatus: number
): {
  ok: boolean;
  days: unknown[];
  error_code: QuizBookingErrorCode;
  message: string;
  retryable: boolean;
} {
  if (httpStatus === 503) {
    return {
      ok: false,
      days: [],
      error_code: "calendly_api",
      message: BOOKING_FEEDBACK.availabilityFailed,
      retryable: false,
    };
  }
  if (!data?.ok) {
    const parsed = parseFunnelApiError(data, httpStatus);
    return {
      ok: false,
      days: [],
      error_code: parsed.error_code,
      message: parsed.message,
      retryable: parsed.retryable,
    };
  }
  const days = Array.isArray(data.days) ? data.days : [];
  if (days.length === 0) {
    return {
      ok: false,
      days: [],
      error_code: "availability_load",
      message: BOOKING_FEEDBACK.availabilityEmpty,
      retryable: false,
    };
  }
  return {
    ok: true,
    days,
    error_code: "availability_load",
    message: "",
    retryable: false,
  };
}
