import { NextResponse } from "next/server";
import {
  bookingFeedbackForCode,
  type BookingFieldKey,
} from "@/lib/quiz-funnel/booking-feedback";
import type { QuizBookingErrorCode } from "@/lib/calendly/booking-errors";

export type FunnelApiErrorBody = {
  ok: false;
  error: string;
  error_code: QuizBookingErrorCode;
  field?: BookingFieldKey;
  retryable?: boolean;
};

export function funnelApiError(
  status: number,
  code: QuizBookingErrorCode,
  options?: {
    field?: BookingFieldKey;
    retryable?: boolean;
    message?: string;
    extra?: Record<string, unknown>;
  }
) {
  const feedback = bookingFeedbackForCode(code, {
    isDev: process.env.NODE_ENV === "development",
  });
  const body: FunnelApiErrorBody & Record<string, unknown> = {
    ok: false,
    error: options?.message ?? feedback.message,
    error_code: code,
    field: options?.field ?? feedback.field,
    retryable: options?.retryable ?? feedback.retryable,
    ...options?.extra,
  };
  return NextResponse.json(body, { status });
}
