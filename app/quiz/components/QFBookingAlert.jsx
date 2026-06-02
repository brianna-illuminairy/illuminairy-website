'use client';

/**
 * Accessible booking error / status banner for s5.
 * @param {{ title?: string; message: string; retryable?: boolean; onRetry?: () => void; retryLabel?: string }} props
 */
export function QFBookingAlert({
  title,
  message,
  retryable = false,
  onRetry,
  retryLabel = 'Try again',
}) {
  if (!message) return null;

  return (
    <div className="qf-booking-alert" role="alert" aria-live="polite">
      {title ? <p className="qf-booking-alert__title">{title}</p> : null}
      <p className="qf-booking-alert__message">{message}</p>
      {retryable && onRetry ? (
        <button type="button" className="qf-booking-alert__retry" onClick={onRetry}>
          {retryLabel}
        </button>
      ) : null}
    </div>
  );
}
