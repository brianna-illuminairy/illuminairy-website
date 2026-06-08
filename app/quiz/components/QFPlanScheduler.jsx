'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  PLAN_SCHEDULER_EYEBROW,
  PLAN_SCHEDULER_HEADLINE,
  PLAN_SCHEDULER_PHONE_LABEL,
} from '@/lib/quiz-funnel/plan-scheduler-copy';
import { timezoneLabel } from '@/lib/calendly/funnel-availability';
import {
  countPhoneDigits,
  isValidBookingPhone,
} from '@/lib/calendly/phone-e164';
import {
  BOOKING_FEEDBACK,
  parseAvailabilityApiResponse,
} from '@/lib/quiz-funnel/booking-feedback';
import {
  invalidateAvailabilityCache,
  prefetchCalendlyAvailability,
  readPrefetchedAvailability,
} from '@/lib/calendly/availability-prefetch';
import { captureQuizBookingError } from '@/lib/quiz-funnel/analytics';
import { sanitizeBookingErrorMessage } from '@/lib/calendly/booking-errors';
import { QFBookingAlert } from './QFBookingAlert';

/**
 * @param {{
 *   parentName?: string;
 *   parentEmail?: string;
 *   parentPhone?: string;
 *   confirmTcpa?: boolean;
 *   fieldErrors?: Record<string, string>;
 *   showFieldErrors?: boolean;
 *   onFieldChange: (key: string, value: unknown) => void;
 *   selectedSlot: object | null;
 *   onSelectSlot: (slot: object | null) => void;
 *   onAvailabilityReady?: (ready: boolean) => void;
 *   onLoadingChange?: (loading: boolean) => void;
 *   onSlotRequired?: () => void;
 *   onRegisterReload?: (reload: () => void) => void;
 * }} props
 */
export function QFPlanScheduler({
  parentName = '',
  parentEmail = '',
  parentPhone = '',
  confirmTcpa = false,
  fieldErrors = {},
  showFieldErrors = false,
  onFieldChange,
  selectedSlot,
  onSelectSlot,
  onAvailabilityReady,
  onLoadingChange,
  onSlotRequired,
  onRegisterReload,
}) {
  const [days, setDays] = useState([]);
  const [activeDayKey, setActiveDayKey] = useState('');
  const [loading, setLoading] = useState(true);
  const [availabilityAlert, setAvailabilityAlert] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  // Keep parent callbacks in refs so loadAvailability stays stable. Parents pass
  // new inline handlers each render; depending on their identity caused an
  // infinite availability refetch loop on s5.
  const onSelectSlotRef = useRef(onSelectSlot);
  const onAvailabilityReadyRef = useRef(onAvailabilityReady);
  const onLoadingChangeRef = useRef(onLoadingChange);
  useEffect(() => {
    onSelectSlotRef.current = onSelectSlot;
    onAvailabilityReadyRef.current = onAvailabilityReady;
    onLoadingChangeRef.current = onLoadingChange;
  });

  const phoneValid = useMemo(
    () => isValidBookingPhone(String(parentPhone)),
    [parentPhone]
  );

  const showErr = (key) => (showFieldErrors ? fieldErrors[key] : undefined);

  const loadAvailability = useCallback(async () => {
    const prefetched = readPrefetchedAvailability();
    if (prefetched?.length) {
      setLoading(false);
      onLoadingChangeRef.current?.(false);
      onAvailabilityReadyRef.current?.(true);
      setDays(prefetched);
      const firstDay = prefetched[0];
      setActiveDayKey(firstDay.dateKey);
      onSelectSlotRef.current(null);
      void prefetchCalendlyAvailability();
      return;
    }

    setLoading(true);
    onLoadingChangeRef.current?.(true);
    setAvailabilityAlert(null);
    try {
      const res = await fetch('/api/funnel/calendly-availability');
      const data = await res.json().catch(() => ({}));
      const parsed = parseAvailabilityApiResponse(data, res.status);

      if (!parsed.ok) {
        setDays([]);
        setActiveDayKey('');
        onSelectSlotRef.current(null);
        onAvailabilityReadyRef.current?.(false);
        setAvailabilityAlert({
          title: 'Times did not load',
          message: parsed.message,
          retryable: parsed.retryable,
        });
        captureQuizBookingError({
          error_code: parsed.error_code,
          error_message: sanitizeBookingErrorMessage(parsed.message),
          step: 's5',
          slots_available: false,
          http_status: res.status,
        });
        return;
      }

      onAvailabilityReadyRef.current?.(true);
      setDays(parsed.days);
      const firstDay = parsed.days[0];
      setActiveDayKey(firstDay.dateKey);
      onSelectSlotRef.current(null);
    } catch {
      onAvailabilityReadyRef.current?.(false);
      setDays([]);
      onSelectSlotRef.current(null);
      const message = BOOKING_FEEDBACK.availabilityFailed;
      setAvailabilityAlert({
        title: 'Connection problem',
        message,
        retryable: true,
      });
      captureQuizBookingError({
        error_code: 'network',
        error_message: message,
        step: 's5',
        slots_available: false,
      });
    } finally {
      setLoading(false);
      onLoadingChangeRef.current?.(false);
    }
  }, []);

  useEffect(() => {
    onRegisterReload?.(() => {
      setReloadKey((k) => k + 1);
    });
  }, [onRegisterReload]);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) void loadAvailability();
    });
    return () => {
      cancelled = true;
    };
  }, [loadAvailability, reloadKey]);

  const activeDay = useMemo(
    () => days.find((d) => d.dateKey === activeDayKey) ?? days[0],
    [days, activeDayKey]
  );

  const tz = timezoneLabel();

  function pickDay(day) {
    setActiveDayKey(day.dateKey);
    onSelectSlot(null);
  }

  function pickSlot(slot) {
    if (!activeDay) return;
    onSelectSlot({
      ...slot,
      weekdayShort: activeDay.weekdayShort,
      dayTitle: activeDay.dayTitle,
    });
  }

  function fieldClass(key) {
    return showErr(key) ? 'qf-input qf-input--invalid' : 'qf-input';
  }

  return (
    <div className="gap-22 qf-plan-scheduler">
      <div>
        <p className="qf-meta qf-plan-scheduler__eyebrow">{PLAN_SCHEDULER_EYEBROW}</p>
        <h1 className="qf-h1" style={{ marginBottom: 0 }}>
          {PLAN_SCHEDULER_HEADLINE}
        </h1>
      </div>

      <div className="qf-card gap-14" style={{ padding: 18 }}>
        <div className="qf-field">
          <span className="qf-label">Your name</span>
          <input
            className={fieldClass('parentName')}
            placeholder="First and last"
            value={String(parentName)}
            aria-invalid={Boolean(showErr('parentName'))}
            aria-describedby={showErr('parentName') ? 'qf-err-parentName' : undefined}
            onChange={(e) => onFieldChange('parentName', e.target.value)}
          />
          {showErr('parentName') ? (
            <p id="qf-err-parentName" className="qf-field-error" role="alert">
              {showErr('parentName')}
            </p>
          ) : null}
        </div>
        <div className="qf-field">
          <span className="qf-label">Your email</span>
          <input
            className={fieldClass('parentEmail')}
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@email.com"
            value={String(parentEmail)}
            aria-invalid={Boolean(showErr('parentEmail'))}
            aria-describedby={showErr('parentEmail') ? 'qf-err-parentEmail' : undefined}
            onChange={(e) => onFieldChange('parentEmail', e.target.value)}
          />
          {showErr('parentEmail') ? (
            <p id="qf-err-parentEmail" className="qf-field-error" role="alert">
              {showErr('parentEmail')}
            </p>
          ) : null}
        </div>
        <div className="qf-field">
          <span className="qf-label">{PLAN_SCHEDULER_PHONE_LABEL}</span>
          <input
            className={fieldClass('parentPhone')}
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            placeholder="404-555-1234"
            aria-invalid={
              Boolean(showErr('parentPhone')) ||
              (String(parentPhone).trim().length > 0 && !phoneValid && showFieldErrors)
            }
            aria-describedby={
              showErr('parentPhone') ? 'qf-plan-scheduler-phone-hint' : undefined
            }
            value={String(parentPhone)}
            onChange={(e) => onFieldChange('parentPhone', e.target.value)}
          />
          {showErr('parentPhone') ? (
            <p
              id="qf-plan-scheduler-phone-hint"
              className="qf-field-error"
              style={{ margin: '6px 0 0' }}
              role="alert"
            >
              {showErr('parentPhone')}
            </p>
          ) : null}
        </div>
      </div>

      <label
        className={
          showErr('confirmTcpa')
            ? 'qf-plan-scheduler__tcpa qf-plan-scheduler__tcpa--invalid'
            : 'qf-plan-scheduler__tcpa'
        }
      >
        <input
          type="checkbox"
          checked={Boolean(confirmTcpa)}
          aria-invalid={Boolean(showErr('confirmTcpa'))}
          onChange={(e) => onFieldChange('confirmTcpa', e.target.checked)}
        />
        <span>
          I agree Illuminairy may contact me about this call. See{' '}
          <a href="/privacy">Privacy</a> and <a href="/terms">Terms</a>. We never share or sell
          your details.
        </span>
      </label>
      {showErr('confirmTcpa') ? (
        <p className="qf-field-error" style={{ margin: '-12px 0 0' }} role="alert">
          {showErr('confirmTcpa')}
        </p>
      ) : null}

      <div className="qf-plan-scheduler__calendar">
        {loading ? (
          <div className="qf-plan-scheduler__skeleton" aria-live="polite" aria-busy="true">
            <div className="qf-plan-scheduler__skeleton-tabs">
              {[1, 2, 3, 4].map((n) => (
                <span key={n} className="qf-plan-scheduler__skeleton-tab" />
              ))}
            </div>
            <div className="qf-plan-scheduler__skeleton-slots">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <span key={n} className="qf-plan-scheduler__skeleton-slot" />
              ))}
            </div>
            <p className="qf-lead muted" style={{ margin: '12px 0 0' }}>
              Loading open times…
            </p>
          </div>
        ) : availabilityAlert ? (
          <QFBookingAlert
            title={availabilityAlert.title}
            message={availabilityAlert.message}
            retryable={availabilityAlert.retryable}
            onRetry={() => {
              invalidateAvailabilityCache();
              setReloadKey((k) => k + 1);
            }}
            retryLabel="Reload times"
          />
        ) : (
          <>
            {showErr('slot') ? (
              <p className="qf-field-error" style={{ margin: '0 0 10px' }} role="alert">
                {showErr('slot')}
              </p>
            ) : null}
            <div className="qf-plan-scheduler__tabs" role="tablist" aria-label="Days">
              {days.map((day) => (
                <button
                  key={day.dateKey}
                  type="button"
                  role="tab"
                  aria-selected={day.dateKey === activeDayKey}
                  className={
                    day.dateKey === activeDayKey
                      ? 'qf-plan-scheduler__tab qf-plan-scheduler__tab--active'
                      : 'qf-plan-scheduler__tab'
                  }
                  onClick={() => pickDay(day)}
                >
                  {day.weekdayShort}
                </button>
              ))}
            </div>

            {activeDay ? (
              <>
                <p className="qf-meta qf-plan-scheduler__day-title" style={{ margin: 0 }}>
                  {activeDay.dayTitle} · {tz}
                </p>
                <div className="qf-plan-scheduler__slots" role="listbox" aria-label="Times">
                  {activeDay.slots.map((slot) => {
                    const selected = selectedSlot?.startTime === slot.startTime;
                    return (
                      <button
                        key={slot.startTime}
                        type="button"
                        role="option"
                        aria-selected={selected}
                        className={
                          selected
                            ? 'qf-plan-scheduler__slot qf-plan-scheduler__slot--active'
                            : 'qf-plan-scheduler__slot'
                        }
                        onClick={() => pickSlot(slot)}
                      >
                        {slot.label}
                      </button>
                    );
                  })}
                </div>
              </>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
