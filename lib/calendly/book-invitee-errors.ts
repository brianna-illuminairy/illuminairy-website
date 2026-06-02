import { classifyBookingError, type QuizBookingErrorCode } from "@/lib/calendly/booking-errors";
import {
  bookingFeedbackForCode,
  type BookingFieldKey,
} from "@/lib/quiz-funnel/booking-feedback";

export class CalendlyBookError extends Error {
  readonly code: QuizBookingErrorCode;
  readonly httpStatus: number;
  readonly field?: BookingFieldKey;

  constructor(
    code: QuizBookingErrorCode,
    message: string,
    options?: { httpStatus?: number; field?: BookingFieldKey }
  ) {
    super(message);
    this.name = "CalendlyBookError";
    this.code = code;
    this.httpStatus = options?.httpStatus ?? 502;
    this.field = options?.field;
  }
}

/** Turn Calendly HTTP error body into a typed error (no raw JSON to parents). */
export function calendlyBookErrorFromResponse(
  status: number,
  bodyText: string
): CalendlyBookError {
  let apiCode: string | undefined;
  try {
    const parsed = JSON.parse(bodyText) as {
      details?: { parameter?: string; message?: string }[];
      message?: string;
    };
    const phoneDetail = parsed.details?.find(
      (d) =>
        d.parameter === "text_reminder_number" || d.parameter === "phone_number"
    );
    if (phoneDetail) {
      const fb = bookingFeedbackForCode("invalid_phone");
      return new CalendlyBookError("invalid_phone", fb.message, {
        httpStatus: status,
        field: "parentPhone",
      });
    }
    const startDetail = parsed.details?.find((d) => d.parameter === "start_time");
    if (startDetail || /start_time/i.test(bodyText)) {
      const fb = bookingFeedbackForCode("slot_taken");
      return new CalendlyBookError("slot_taken", fb.message, {
        httpStatus: status,
        field: "slot",
      });
    }
    apiCode = parsed.message;
  } catch {
    /* not JSON */
  }

  const code = classifyBookingError(bodyText, { httpStatus: status });
  const fb = bookingFeedbackForCode(code);
  return new CalendlyBookError(code, fb.message, {
    httpStatus: status,
    field: fb.field,
  });
}
