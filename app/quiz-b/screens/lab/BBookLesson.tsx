'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CalendarDays, ChevronDown, Clock } from 'lucide-react';
import { QFScreen, QFButton } from '@/app/quiz/components/QFShell';
import { QFBookingAlert } from '@/app/quiz/components/QFBookingAlert';
import type { QuizAnswers } from '@/app/quiz-b/state';
import {
  BOOKING_FEEDBACK,
  parseAvailabilityApiResponse,
  parseFunnelApiError,
  type BookingFieldKey,
} from '@/lib/quiz-funnel/booking-feedback';
import { getClientAttributionPayload } from '@/lib/quiz-funnel/client-attribution';
import {
  labBookingDayCardLabel,
  limitLabBookingDays,
  LAB_BOOKING_EXTENDED_MAX_DAYS,
  LAB_BOOKING_EXTENDED_MAX_SLOTS_PER_DAY,
  type LabBookingDay,
} from '@/lib/quiz-funnel-b/booking-slots';
import {
  PLAN_B_BOOK_CONSENT_PREFIX,
  PLAN_B_BOOK_CONSENT_PRIVACY,
  PLAN_B_BOOK_CONSENT_REQUIRED,
  PLAN_B_BOOK_CONSENT_SUFFIX,
  PLAN_B_BOOK_CTA,
  PLAN_B_BOOK_HEADLINE,
  PLAN_B_BOOK_LOADING,
  PLAN_B_BOOK_MORE_DATES,
  PLAN_B_BOOK_NAME_PLACEHOLDER,
  PLAN_B_BOOK_SCHEDULE_LABEL,
  PLAN_B_BOOK_SUBMITTING,
  PLAN_B_BOOK_TIME_PLACEHOLDER,
} from '@/lib/quiz-funnel-b/book-lesson-copy';
import {
  captureQuizBookingConfirmed,
  captureQuizBookingError,
  captureQuizBookingValidation,
} from '@/lib/quiz-funnel-b/analytics';
import { readPersistedLpVariant, readPersistedLpVariantId } from '@/lib/landing/variant-storage';
import { resolveMetaClickIds } from '@/lib/meta-click-ids';

type SelectedSlot = LabBookingDay['slots'][number] & {
  weekdayShort: string;
  dayTitle: string;
};

type Props = {
  answers: QuizAnswers;
  dispatch: (action: { type: string; key?: string; value?: unknown }) => void;
  onBooked: () => void;
  onBack: () => void;
};

function attributionQuery() {
  if (typeof window === 'undefined') return '';
  const { attribution } = getClientAttributionPayload();
  const params = new URLSearchParams();
  for (const key of [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_term',
    'utm_content',
    'gclid',
    'fbclid',
  ] as const) {
    const value = attribution[key];
    if (typeof value === 'string' && value.trim()) params.set(key, value.trim());
  }
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

function buildLeadPayload(answers: QuizAnswers, kidName: string) {
  const { visitorId, attribution } = getClientAttributionPayload();
  const resolved = resolveMetaClickIds(attribution.fbclid);
  return {
    body: {
      ...answers,
      kidName,
      confirmTcpa: true,
      visitorId,
      attribution,
      fbp: resolved.fbp ?? attribution.fbp,
      fbc: resolved.fbc ?? attribution.fbc,
      fbcTs: resolved.fbcTs,
      sat_lp_variant: readPersistedLpVariant(),
      lp_variant: readPersistedLpVariantId(),
    },
    visitorId,
    attribution,
    resolved,
  };
}

export function BBookLesson({ answers, dispatch, onBooked, onBack }: Props) {
  const [allDays, setAllDays] = useState<LabBookingDay[]>([]);
  const [showExtendedDates, setShowExtendedDates] = useState(false);
  const [activeDayKey, setActiveDayKey] = useState('');
  const [selectedStartTime, setSelectedStartTime] = useState('');
  const [recordingConsent, setRecordingConsent] = useState(false);
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

  const leadPrefetchedRef = useRef(false);

  const parentName = String(answers.parentName ?? '');
  const parentEmail = String(answers.parentEmail ?? '');
  const parentPhone = String(answers.parentPhone ?? '');
  const kidName = String(answers.kidName ?? '');

  const days = useMemo(
    () =>
      limitLabBookingDays(allDays, {
        maxDays: showExtendedDates ? LAB_BOOKING_EXTENDED_MAX_DAYS : undefined,
        maxSlotsPerDay: showExtendedDates ? LAB_BOOKING_EXTENDED_MAX_SLOTS_PER_DAY : undefined,
      }),
    [allDays, showExtendedDates]
  );

  const resolvedDayKey = days.some((d) => d.dateKey === activeDayKey)
    ? activeDayKey
    : (days[0]?.dateKey ?? '');

  const activeDay = days.find((d) => d.dateKey === resolvedDayKey) ?? days[0];

  const effectiveStartTime = useMemo(() => {
    if (!activeDay?.slots.length) return '';
    const match = activeDay.slots.find((s) => s.startTime === selectedStartTime);
    return match?.startTime ?? activeDay.slots[0].startTime;
  }, [activeDay, selectedStartTime]);

  const selectedSlot: SelectedSlot | null = useMemo(() => {
    if (!activeDay || !effectiveStartTime) return null;
    const slot = activeDay.slots.find((s) => s.startTime === effectiveStartTime);
    if (!slot) return null;
    return {
      ...slot,
      weekdayShort: activeDay.weekdayShort,
      dayTitle: activeDay.dayTitle,
    };
  }, [activeDay, effectiveStartTime]);

  const validation = useMemo(() => {
    const errors: Partial<Record<BookingFieldKey | 'recordingConsent', string>> = {};
    if (!kidName.trim()) errors.kidName = BOOKING_FEEDBACK.kidRequired;
    if (!selectedSlot) errors.slot = BOOKING_FEEDBACK.slotRequired;
    if (!recordingConsent) errors.recordingConsent = PLAN_B_BOOK_CONSENT_REQUIRED;
    return { valid: Object.keys(errors).length === 0, errors };
  }, [kidName, selectedSlot, recordingConsent]);

  const slotsAvailable = days.length > 0;
  const canSubmit = validation.valid && !loading && slotsAvailable && !submitting;
  const canExpandDates = useMemo(() => {
    if (showExtendedDates || !allDays.length) return false;
    const compact = limitLabBookingDays(allDays);
    const extended = limitLabBookingDays(allDays, {
      maxDays: LAB_BOOKING_EXTENDED_MAX_DAYS,
      maxSlotsPerDay: LAB_BOOKING_EXTENDED_MAX_SLOTS_PER_DAY,
    });
    const compactSlots = compact.reduce((n, d) => n + d.slots.length, 0);
    const extendedSlots = extended.reduce((n, d) => n + d.slots.length, 0);
    return extended.length > compact.length || extendedSlots > compactSlots;
  }, [allDays, showExtendedDates]);

  function setField(key: string, value: unknown) {
    dispatch({ type: 'SET_FIELD', key, value });
  }

  function trackValidation(field: string, message: string) {
    captureQuizBookingValidation({
      validation_code: field,
      validation_message: message,
      field: field as BookingFieldKey,
      step: 'b-book',
    });
  }

  function trackBookingError(
    error_code: string,
    error_message: string,
    extra: Record<string, unknown> = {}
  ) {
    captureQuizBookingError({
      error_code,
      error_message,
      step: 'b-book',
      ...extra,
    });
  }

  const loadAvailability = useCallback(async () => {
    setLoading(true);
    setAvailabilityAlert(null);
    try {
      const res = await fetch(`/api/funnel-b/calendly-availability${attributionQuery()}`);
      const data = await res.json().catch(() => ({}));
      const parsed = parseAvailabilityApiResponse(data, res.status);
      if (!parsed.ok) {
        setAllDays([]);
        setActiveDayKey('');
        setSelectedStartTime('');
        setAvailabilityAlert({
          title: 'Times did not load',
          message: parsed.message,
          retryable: parsed.retryable,
        });
        trackBookingError(parsed.error_code, parsed.message, { http_status: res.status });
        return;
      }
      const loaded = parsed.days as LabBookingDay[];
      setAllDays(loaded);
      const limited = limitLabBookingDays(loaded);
      const first = limited[0];
      setActiveDayKey(first?.dateKey ?? '');
      setSelectedStartTime(first?.slots[0]?.startTime ?? '');
    } catch {
      setAllDays([]);
      setAvailabilityAlert({
        title: 'Connection problem',
        message: BOOKING_FEEDBACK.availabilityFailed,
        retryable: true,
      });
      trackBookingError('network', BOOKING_FEEDBACK.availabilityFailed);
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

  async function submitLead(): Promise<{ ok: true } | { ok: false }> {
    const payload = buildLeadPayload(answers, kidName);
    const leadRes = await fetch('/api/funnel-b/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload.body, conversion: false }),
    });
    const leadData = await leadRes.json().catch(() => ({}));
    if (!leadRes.ok) {
      const parsed = parseFunnelApiError(leadData as Record<string, unknown>, leadRes.status);
      trackBookingError(parsed.error_code, parsed.message, {
        http_status: leadRes.status,
        field: parsed.field,
      });
      setBookingAlert(parsed);
      return { ok: false };
    }
    leadPrefetchedRef.current = true;
    return { ok: true };
  }

  async function handleConfirm() {
    if (submitting) return;
    setSubmitAttempted(true);
    if (!validation.valid) {
      const field = Object.keys(validation.errors)[0];
      if (field) {
        trackValidation(field, validation.errors[field as keyof typeof validation.errors] ?? BOOKING_FEEDBACK.bookingFailed);
      }
      return;
    }

    setSubmitting(true);
    setBookingAlert(null);
    const { visitorId, attribution } = getClientAttributionPayload();
    const sat_lp_variant = readPersistedLpVariant();
    const lp_variant = readPersistedLpVariantId();

    try {
      const leadResult = await submitLead();
      if (!leadResult.ok) {
        setSubmitting(false);
        return;
      }

      const slotStart = selectedSlot?.startTime;
      if (!slotStart) {
        setSubmitting(false);
        return;
      }

      const bookRes = await fetch('/api/funnel-b/calendly-book', {
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
          qWho: answers.qWho,
          sat_lp_variant,
          lp_variant,
        }),
      });
      const bookData = await bookRes.json().catch(() => ({}));

      if (!bookRes.ok || !bookData.ok) {
        const parsed = parseFunnelApiError(bookData as Record<string, unknown>, bookRes.status);
        trackBookingError(parsed.error_code, parsed.message, {
          http_status: bookRes.status,
          field: parsed.field,
        });
        setBookingAlert(parsed);
        if (parsed.field === 'slot') setSelectedStartTime('');
        if (parsed.refresh_slots) void loadAvailability();
        setSubmitting(false);
        return;
      }

      const startTime =
        typeof bookData.startTime === 'string' ? bookData.startTime : selectedSlot?.startTime;
      if (startTime) {
        dispatch({ type: 'SET_FIELD', key: 'strategyCallStart', value: startTime });
      }
      const inviteeUri = typeof bookData.inviteeUri === 'string' ? bookData.inviteeUri : '';
      const eventId =
        typeof bookData.eventId === 'string'
          ? bookData.eventId
          : inviteeUri
            ? `schedule_${inviteeUri.split('/').pop()}`
            : `schedule_${Date.now()}`;
      captureQuizBookingConfirmed(eventId, {
        booking_source: 'api',
        qWho: typeof answers.qWho === 'string' ? answers.qWho : undefined,
      });
      onBooked();
    } catch {
      const parsed = parseFunnelApiError(null, 0);
      trackBookingError('network', parsed.message, { retryable: true });
      setBookingAlert({ ...parsed, title: 'Connection problem' });
      setSubmitting(false);
    }
  }

  return (
    <QFScreen
      stepIdx={20}
      ornament="glow"
      onBack={onBack}
      actions={
        <QFButton kind="forest" onClick={handleConfirm} disabled={!canSubmit}>
          {submitting ? PLAN_B_BOOK_SUBMITTING : PLAN_B_BOOK_CTA}
        </QFButton>
      }
    >
      <div className="gap-22 qfb-book">
        <h1 className="qf-h1 qfb-book__title">{PLAN_B_BOOK_HEADLINE}</h1>

        <input
          className={
            submitAttempted && validation.errors.kidName
              ? 'qf-input qf-input--invalid qfb-book__name'
              : 'qf-input qfb-book__name'
          }
          placeholder={PLAN_B_BOOK_NAME_PLACEHOLDER}
          value={kidName}
          autoComplete="given-name"
          aria-label="Student's first name"
          onChange={(e) => setField('kidName', e.target.value)}
        />
        {submitAttempted && validation.errors.kidName ? (
          <p className="qf-field-error qfb-book__name-error" role="alert">
            {validation.errors.kidName}
          </p>
        ) : null}

        <div className="qfb-book-schedule">
          <p className="qfb-book-schedule__label">
            <CalendarDays className="qfb-book-schedule__icon" size={18} strokeWidth={2} aria-hidden />
            {PLAN_B_BOOK_SCHEDULE_LABEL}
          </p>

          {loading ? (
            <div className="qfb-book-schedule__loading" role="status" aria-live="polite">
              <div className="qfb-book-schedule__spinner" aria-hidden="true" />
              <p className="qfb-book-schedule__loading-text">{PLAN_B_BOOK_LOADING}</p>
            </div>
          ) : availabilityAlert ? (
            <QFBookingAlert
              title={availabilityAlert.title}
              message={availabilityAlert.message}
              retryable={availabilityAlert.retryable}
              onRetry={availabilityAlert.retryable ? () => void loadAvailability() : undefined}
            />
          ) : (
            <>
              <div className="qfb-book-dates" role="group" aria-label="Pick a day">
                {days.map((day, index) => {
                  const card = labBookingDayCardLabel(
                    day.slots[0]?.startTime ?? `${day.dateKey}T12:00:00.000Z`,
                    day.weekdayShort,
                    index,
                    day.dateKey
                  );
                  const selected = day.dateKey === resolvedDayKey;
                  return (
                    <button
                      key={day.dateKey}
                      type="button"
                      className={
                        selected ? 'qfb-book-date qfb-book-date--active' : 'qfb-book-date'
                      }
                      onClick={() => {
                        setActiveDayKey(day.dateKey);
                        const firstSlot = day.slots[0];
                        if (firstSlot) setSelectedStartTime(firstSlot.startTime);
                      }}
                    >
                      <span className="qfb-book-date__heading">{card.heading}</span>
                      <span className="qfb-book-date__sub">{card.sub}</span>
                      {selected ? (
                        <span className="qfb-book-date__check" aria-hidden="true">
                          ✓
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>

              {canExpandDates ? (
                <button
                  type="button"
                  className="qfb-book-more-dates"
                  onClick={() => setShowExtendedDates(true)}
                >
                  {PLAN_B_BOOK_MORE_DATES}
                </button>
              ) : null}

              {activeDay && activeDay.slots.length > 0 ? (
                <label className="qfb-book-time">
                  <Clock className="qfb-book-time__icon" size={18} strokeWidth={2} aria-hidden />
                  <select
                    className="qfb-book-time__select"
                    value={effectiveStartTime}
                    aria-label="Select time"
                    onChange={(e) => setSelectedStartTime(e.target.value)}
                    disabled={submitting}
                  >
                    {!effectiveStartTime ? (
                      <option value="">{PLAN_B_BOOK_TIME_PLACEHOLDER}</option>
                    ) : null}
                    {activeDay.slots.map((slot) => (
                      <option key={slot.startTime} value={slot.startTime}>
                        {slot.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="qfb-book-time__chevron" size={18} aria-hidden />
                  {submitting ? (
                    <span className="qfb-book-time__inline-spinner" aria-hidden="true" />
                  ) : null}
                </label>
              ) : null}

              {submitAttempted && validation.errors.slot ? (
                <p className="qf-field-error" role="alert">
                  {validation.errors.slot}
                </p>
              ) : null}
            </>
          )}
        </div>

        <label className="qfb-book-consent">
          <input
            type="checkbox"
            className="qfb-book-consent__input"
            checked={recordingConsent}
            onChange={(e) => setRecordingConsent(e.target.checked)}
          />
          <span className="qfb-book-consent__text">
            {PLAN_B_BOOK_CONSENT_PREFIX}
            <Link href="/privacy" className="qfb-book-consent__link">
              {PLAN_B_BOOK_CONSENT_PRIVACY}
            </Link>
            {PLAN_B_BOOK_CONSENT_SUFFIX}
          </span>
        </label>
        {submitAttempted && validation.errors.recordingConsent ? (
          <p className="qf-field-error qfb-book-consent__error" role="alert">
            {validation.errors.recordingConsent}
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
