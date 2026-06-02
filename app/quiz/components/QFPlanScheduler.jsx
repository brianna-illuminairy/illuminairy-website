'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  PLAN_SCHEDULER_EYEBROW,
  PLAN_SCHEDULER_HEADLINE,
  PLAN_SCHEDULER_LEAD,
  PLAN_SCHEDULER_PHONE_LABEL,
  planSchedulerConfirmLabel,
} from '@/lib/quiz-funnel/plan-scheduler-copy';
import { timezoneLabel } from '@/lib/calendly/funnel-availability';
import {
  BOOKING_PHONE_HINT,
  countPhoneDigits,
  isValidBookingPhone,
} from '@/lib/calendly/phone-e164';
import {
  BOOKING_FEEDBACK,
  parseAvailabilityApiResponse,
} from '@/lib/quiz-funnel/booking-feedback';
import { captureQuizBookingError } from '@/lib/quiz-funnel/analytics';
import { sanitizeBookingErrorMessage } from '@/lib/calendly/booking-errors';
import { QFBookingAlert } from './QFBookingAlert';

/**
 * @param {{
 *   parentName?: string;
 *   parentEmail?: string;
 *   parentPhone?: string;
 *   kidName?: string;
 *   confirmTcpa?: boolean;
 *   fieldErrors?: Record<string, string>;
 *   showFieldErrors?: boolean;
 *   onFieldChange: (key: string, value: unknown) => void;
 *   selectedSlot: object | null;
 *   onSelectSlot: (slot: object | null) => void;
 *   onAvailabilityReady?: (ready: boolean) => void;
 *   onSlotRequired?: () => void;
 *   onRegisterReload?: (reload: () => void) => void;
 * }} props
 */
export function QFPlanScheduler({
  parentName = '',
  parentEmail = '',
  parentPhone = '',
  kidName = '',
  confirmTcpa = false,
  fieldErrors = {},
  showFieldErrors = false,
  onFieldChange,
  selectedSlot,
  onSelectSlot,
  onAvailabilityReady,
  onSlotRequired,
  onRegisterReload,
}) {
  const [days, setDays] = useState([]);
  const [activeDayKey, setActiveDayKey] = useState('');
  const [loading, setLoading] = useState(true);
  const [availabilityAlert, setAvailabilityAlert] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);
  const reloadOptionsRef = useRef({ skipAutoSelect: false });

  const phoneValid = useMemo(
    () => isValidBookingPhone(String(parentPhone)),
    [parentPhone]
  );

  const showErr = (key) => (showFieldErrors ? fieldErrors[key] : undefined);

  const loadAvailability = useCallback(async () => {
    const skipAutoSelect = reloadOptionsRef.current.skipAutoSelect;
    reloadOptionsRef.current.skipAutoSelect = false;
    setLoading(true);
    setAvailabilityAlert(null);
    try {
      const res = await fetch('/api/funnel/calendly-availability?fresh=1', {
        cache: 'no-store',
      });
      const data = await res.json().catch(() => ({}));
      const parsed = parseAvailabilityApiResponse(data, res.status);

      if (!parsed.ok) {
        setDays([]);
        setActiveDayKey('');
        onSelectSlot(null);
        onAvailabilityReady?.(false);
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

      onAvailabilityReady?.(true);
      setDays(parsed.days);
      const firstDay = parsed.days[0];
      setActiveDayKey(firstDay.dateKey);
      if (skipAutoSelect) {
        onSelectSlot(null);
        return;
      }
      const firstSlot = firstDay.slots?.[0];
      if (firstSlot) {
        onSelectSlot({
          ...firstSlot,
          weekdayShort: firstDay.weekdayShort,
          dayTitle: firstDay.dayTitle,
        });
      }
    } catch {
      onAvailabilityReady?.(false);
      setDays([]);
      onSelectSlot(null);
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
    }
  }, [onAvailabilityReady, onSelectSlot]);

  useEffect(() => {
    onRegisterReload?.(() => {
      reloadOptionsRef.current.skipAutoSelect = true;
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
    const slot = day.slots?.[0];
    if (slot) {
      onSelectSlot({
        ...slot,
        weekdayShort: day.weekdayShort,
        dayTitle: day.dayTitle,
      });
    } else {
      onSelectSlot(null);
      onSlotRequired?.();
    }
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
        <h1 className="qf-h1" style={{ marginBottom: 8 }}>
          {PLAN_SCHEDULER_HEADLINE}
        </h1>
        <p className="qf-lead" style={{ margin: 0 }}>
          {PLAN_SCHEDULER_LEAD}
        </p>
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
            placeholder="404-555-1234 (10 digits)"
            aria-invalid={
              Boolean(showErr('parentPhone')) ||
              (String(parentPhone).trim().length > 0 && !phoneValid && showFieldErrors)
            }
            aria-describedby="qf-plan-scheduler-phone-hint"
            value={String(parentPhone)}
            onChange={(e) => onFieldChange('parentPhone', e.target.value)}
          />
          <p
            id="qf-plan-scheduler-phone-hint"
            className={showErr('parentPhone') ? 'qf-field-error' : 'qf-meta'}
            style={
              showErr('parentPhone')
                ? { margin: '6px 0 0' }
                : {
                    margin: '6px 0 0',
                    color:
                      String(parentPhone).trim().length > 0 && !phoneValid
                        ? '#b42318'
                        : 'var(--qf-ink-mid)',
                  }
            }
            role={showErr('parentPhone') ? 'alert' : undefined}
          >
            {showErr('parentPhone')
              ? showErr('parentPhone')
              : String(parentPhone).trim().length > 0 && phoneValid
                ? 'Looks good — we will text your confirmation to this number.'
                : BOOKING_PHONE_HINT}
          </p>
        </div>
        <div className="qf-field">
          <span className="qf-label">Student&apos;s name</span>
          <input
            className={fieldClass('kidName')}
            placeholder="First name"
            value={String(kidName)}
            aria-invalid={Boolean(showErr('kidName'))}
            aria-describedby={showErr('kidName') ? 'qf-err-kidName' : undefined}
            onChange={(e) => onFieldChange('kidName', e.target.value)}
          />
          {showErr('kidName') ? (
            <p id="qf-err-kidName" className="qf-field-error" role="alert">
              {showErr('kidName')}
            </p>
          ) : null}
        </div>
      </div>

      <div className="qf-plan-scheduler__calendar">
        {loading ? (
          <p className="qf-lead muted" style={{ margin: 0 }} aria-live="polite">
            Loading open times…
          </p>
        ) : availabilityAlert ? (
          <QFBookingAlert
            title={availabilityAlert.title}
            message={availabilityAlert.message}
            retryable={availabilityAlert.retryable}
            onRetry={() => setReloadKey((k) => k + 1)}
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
    </div>
  );
}
