import { site } from '@/lib/site';

export function formatReviewCallWhen(callStart?: string): string {
  if (!callStart) {
    return 'the time in your calendar invite';
  }
  try {
    const date = new Date(callStart);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short',
    });
  } catch {
    return 'the time in your calendar invite';
  }
}

export function thankYouHeadline(parentFirst: string): string {
  if (parentFirst.trim()) {
    return `${parentFirst.trim()}, your June SAT Score Review is confirmed.`;
  }
  return 'Your June SAT Score Review is confirmed.';
}

export const THANK_YOU_REMINDER_LINE =
  'We send calendar reminders 24 hours and 1 hour before your call.';

export function thankYouSupportLine(): string {
  return `Questions? Email ${site.supportEmail}.`;
}
