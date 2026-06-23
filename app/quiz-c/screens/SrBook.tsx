'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { QFScreen, QFButton } from '@/app/quiz/components/QFShell';
import { QFBookingAlert } from '@/app/quiz/components/QFBookingAlert';
import type { QuizAnswers } from '@/app/quiz-c/state';
import type { Dispatch } from 'react';
import {
  BOOKING_FEEDBACK,
  parseAvailabilityApiResponse,
  parseFunnelApiError,
  validateBookingContactOnly,
  type BookingFieldKey,
} from '@/lib/quiz-funnel/booking-feedback';
import { getClientAttributionPayload } from '@/lib/quiz-funnel/client-attribution';
import { timezoneLabel } from '@/lib/calendly/funnel-availability';
import {
  captureScoreReviewBooked,
  captureScoreReviewBookingError,
  captureScoreReviewLeadSubmitted,
} from '@/lib/score-review-funnel/analytics';
import { readPersistedLpVariantId } from '@/lib/landing/variant-storage';
import { resolveMetaClickIds } from '@/lib/meta-click-ids';
import { isValidBookingPhone } from '@/lib/calendly/phone-e164';

type DaySlot = {
  dateKey: string;
  weekdayShort: string;
  dayTitle: string;
  slots: Array<{ startTime: string; schedulingUrl: string; label: string }>;
};

type SelectedSlot = DaySlot['slots'][number] & {
  weekdayShort: string;
  dayTitle: string;
};

type Props = {
  answers: QuizAnswers;
  dispatch: Dispatch<{ type: 'SET_FIELD'; key: string; value: unknown }>;
  onBooked: () => void;
  onBack: () => void;
};

export function SrBook({ answers, dispatch, onBooked, onBack }: Props) {
  const [days, setDays] = useState<DaySlot[]>([]);
  const [activeDayKey, setActiveDayKey] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<SelectedSlot | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [availabilityAlert, setAvailabilityAlert] = useState<{
    title: string;
    message: string;
    retryable?: boolean;
  } | null>(null);
  const [bookingAlert, setBookingAlert] = useState<{
    title?: string;
    message: string;
    retryable?: boolean;
    field?: string;
    refresh_slots?: boolean;
  } | null>(null);

  const parentName = String(answers.parentName ?? '');
  const parentEmail = String(answers.parentEmail ?? '');
  const parentPhone = String(answers.parentPhone ?? '');
  const kidName = String(answers.kidName ?? '');
  const confirmTcpa = Boolean(answers.confirmTcpa);

  const validation = useMemo(() => {
    const base = validateBookingContactOnly({
      parentName,
      parentEmail,
      parentPhone,
      confirmTcpa,
    });
    const errors = { ...base.errors };
    if (!kidName.trim()) errors.kidName = BOOKING_FEEDBACK.kidRequired;
    if (!selectedSlot) errors.slot = BOOKING_FEEDBACK.slotRequired;
    return { valid: Object.keys(errors).length === 0, errors };
  }, [parentName, parentEmail, parentPhone, kidName, confirmTcpa, selectedSlot]);

  const slotsAvailable = days.length > 0;
  const canSubmit = validation.valid && !loading && slotsAvailable;

  function setField(key: string, value: unknown) {
    dispatch({ type: 'SET_FIELD', key, value });
  }

  const loadAvailability = useCallback(async () => {
    setLoading(true);
    setAvailabilityAlert(null);
    try {
      const res = await fetch('/api/score-review/calendly-availability');
      const data = await res.json().catch(() => ({}));
      const parsed = parseAvailabilityApiResponse(data, res.status);
      if (!parsed.ok) {
        setDays([]);
        setActiveDayKey('');
        setSelectedSlot(null);
        setAvailabilityAlert({
          title: 'Times did not load',
          message: parsed.message,
          retryable: parsed.retryable,
        });
        captureScoreReviewBookingError({
          error_code: parsed.error_code,
          error_message: parsed.message,
          step: 'sr-book',
        });
        return;
      }
      setDays(parsed.days as DaySlot[]);
      const first = parsed.days[0] as DaySlot;
      setActiveDayKey(first.dateKey);
      setSelectedSlot(null);
    } catch {
      setDays([]);
      setAvailabilityAlert({
        title: 'Connection problem',
        message: BOOKING_FEEDBACK.availabilityFailed,
        retryable: true,
      });
      captureScoreReviewBookingError({
        error_code: 'network',
        error_message: BOOKING_FEEDBACK.availabilityFailed,
        step: 'sr-book',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) void loadAvailability();
    });
    return () => {
      cancelled = true;
    };
  }, [loadAvailability]);

  const activeDay = days.find((d) => d.dateKey === activeDayKey) ?? days[0];
  const tz = timezoneLabel();

  async function handleConfirm() {
    if (!canSubmit || submitting) return;
    setSubmitAttempted(true);
    if (!validation.valid) return;

    setSubmitting(true);
    setBookingAlert(null);
    const { visitorId, attribution } = getClientAttributionPayload();
    const resolved = resolveMetaClickIds(attribution.fbclid);
    const lp_variant = readPersistedLpVariantId();

    const payload = {
      srGrade: answers.srGrade,
      srRecentScore: answers.srRecentScore,
      srPrepared: answers.srPrepared,
      srTestDate: answers.srTestDate,
      srTarget: answers.srTarget,
      srSchoolReferral: answers.srSchoolReferral,
      parentName,
      parentEmail,
      parentPhone,
      kidName,
      phoneVerifiedAt: answers.phoneVerifiedAt,
      confirmTcpa: true,
      visitorId,
      attribution,
      fbp: resolved.fbp ?? attribution.fbp,
      fbc: resolved.fbc ?? attribution.fbc,
      fbcTs: resolved.fbcTs,
      lp_variant,
    };

    try {
      const leadRes = await fetch('/api/score-review/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const leadData = await leadRes.json().catch(() => ({}));
      if (!leadRes.ok) {
        const parsed = parseFunnelApiError(leadData as Record<string, unknown>, leadRes.status);
        captureScoreReviewBookingError({
          error_code: parsed.error_code,
          error_message: parsed.message,
          step: 'sr-book',
        });
        setBookingAlert(parsed);
        setSubmitting(false);
        return;
      }

      captureScoreReviewLeadSubmitted(
        typeof leadData.eventId === 'string' ? leadData.eventId : undefined
      );

      const slotStart = selectedSlot?.startTime;
      if (!slotStart) {
        setSubmitting(false);
        return;
      }

      const bookRes = await fetch('/api/score-review/calendly-book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startTime: slotStart,
          parentName,
          parentEmail,
          parentPhone,
          kidName,
          visitorId,
          attribution,
          lp_variant,
        }),
      });
      const bookData = await bookRes.json().catch(() => ({}));

      if (!bookRes.ok || !bookData.ok) {
        const parsed = parseFunnelApiError(bookData as Record<string, unknown>, bookRes.status);
        captureScoreReviewBookingError({
          error_code: parsed.error_code,
          error_message: parsed.message,
          step: 'sr-book',
        });
        setBookingAlert(parsed);
        if (parsed.field === 'slot') setSelectedSlot(null);
        if (parsed.refresh_slots) void loadAvailability();
        setSubmitting(false);
        return;
      }

      const startTime =
        typeof bookData.startTime === 'string' ? bookData.startTime : selectedSlot?.startTime;
      if (startTime) {
        dispatch({ type: 'SET_FIELD', key: 'reviewCallStart', value: startTime });
      }
      const inviteeUri = typeof bookData.inviteeUri === 'string' ? bookData.inviteeUri : '';
      const eventId = inviteeUri
        ? `schedule_${inviteeUri.split('/').pop()}`
        : `schedule_${Date.now()}`;
      captureScoreReviewBooked(eventId);
      setSubmitting(false);
      onBooked();
    } catch {
      captureScoreReviewBookingError({
        error_code: 'network',
        error_message: BOOKING_FEEDBACK.bookingFailed,
        step: 'sr-book',
      });
      setBookingAlert({
        message: BOOKING_FEEDBACK.bookingFailed,
        retryable: true,
        title: 'Connection problem',
      });
      setSubmitting(false);
    }
  }

  const footerLabel = loading
    ? 'Loading open times…'
    : !slotsAvailable
      ? 'Reload times to continue'
      : !selectedSlot
        ? 'Pick a time'
        : `Book ${selectedSlot.weekdayShort} ${selectedSlot.label}`;

  return (
    <QFScreen
      stepIdx={10}
      ornament="glow"
      onBack={onBack}
      actions={
        <QFButton kind="forest" onClick={handleConfirm} disabled={!canSubmit || submitting}>
          {submitting ? 'Confirming your review…' : footerLabel}
        </QFButton>
      }
    >
      <div className="gap-22 qf-plan-scheduler">
        <div>
          <p className="qf-meta qf-plan-scheduler__eyebrow">Free score review</p>
          <h1 className="qf-h1" style={{ marginBottom: 0 }}>
            Pick a time for your June SAT Score Review.
          </h1>
        </div>

        <div className="qf-card gap-14" style={{ padding: 18 }}>
          <div className="qf-field">
            <span className="qf-label">Student first name</span>
            <input
              className="qf-input"
              placeholder="First name"
              value={kidName}
              onChange={(e) => setField('kidName', e.target.value)}
            />
            {submitAttempted && validation.errors.kidName ? (
              <p className="qf-field-error" role="alert">
                {validation.errors.kidName}
              </p>
            ) : null}
          </div>
        </div>

        <label
          className={
            submitAttempted && validation.errors.confirmTcpa
              ? 'qf-plan-scheduler__tcpa qf-plan-scheduler__tcpa--invalid'
              : 'qf-plan-scheduler__tcpa'
          }
        >
          <input
            type="checkbox"
            checked={confirmTcpa}
            onChange={(e) => setField('confirmTcpa', e.target.checked)}
          />
          <span>
            I agree Illuminairy may contact me about this score review. See{' '}
            <a href="/privacy">Privacy</a> and <a href="/terms">Terms</a>.
          </span>
        </label>

        <div className="qf-plan-scheduler__calendar">
          {loading ? (
            <p className="qf-lead muted">Loading open times…</p>
          ) : availabilityAlert ? (
            <QFBookingAlert
              title={availabilityAlert.title}
              message={availabilityAlert.message}
              retryable={availabilityAlert.retryable}
              onRetry={availabilityAlert.retryable ? () => void loadAvailability() : undefined}
            />
          ) : (
            <>
              <p className="qf-meta" style={{ marginBottom: 8 }}>
                Times shown in {tz}
              </p>
              <div className="qf-plan-scheduler__day-tabs">
                {days.map((day) => (
                  <button
                    key={day.dateKey}
                    type="button"
                    className={
                      day.dateKey === activeDayKey
                        ? 'qf-plan-scheduler__day-tab qf-plan-scheduler__day-tab--active'
                        : 'qf-plan-scheduler__day-tab'
                    }
                    onClick={() => {
                      setActiveDayKey(day.dateKey);
                      setSelectedSlot(null);
                    }}
                  >
                    {day.weekdayShort}
                  </button>
                ))}
              </div>
              {activeDay ? (
                <div className="qf-plan-scheduler__slot-grid">
                  {activeDay.slots.map((slot) => {
                    const selected = selectedSlot?.startTime === slot.startTime;
                    return (
                      <button
                        key={slot.startTime}
                        type="button"
                        className={
                          selected
                            ? 'qf-plan-scheduler__slot qf-plan-scheduler__slot--selected'
                            : 'qf-plan-scheduler__slot'
                        }
                        onClick={() =>
                          setSelectedSlot({
                            ...slot,
                            weekdayShort: activeDay.weekdayShort,
                            dayTitle: activeDay.dayTitle,
                          })
                        }
                      >
                        {slot.label}
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </>
          )}
        </div>

        {parentPhone && !isValidBookingPhone(parentPhone) ? (
          <p className="qf-field-error" role="alert">
            {BOOKING_FEEDBACK.phoneInvalid}
          </p>
        ) : null}

        {bookingAlert ? (
          <QFBookingAlert
            title={bookingAlert.title}
            message={bookingAlert.message}
            retryable={bookingAlert.retryable}
            onRetry={
              bookingAlert.retryable
                ? () => {
                    setBookingAlert(null);
                    void handleConfirm();
                  }
                : undefined
            }
          />
        ) : null}
      </div>
    </QFScreen>
  );
}
