import { FREE_LESSON_DURATION_MIN } from "@/lib/portal/lesson-join";

export const ENROLL_UNLOCK_BEFORE_END_MIN = 15 as const;

export function portalEnrollUnlockAt(scheduledStart: string | null): string | null {
  if (!scheduledStart) return null;
  const start = new Date(scheduledStart);
  if (Number.isNaN(start.getTime())) return null;
  const unlockMs =
    start.getTime() +
    (FREE_LESSON_DURATION_MIN - ENROLL_UNLOCK_BEFORE_END_MIN) * 60_000;
  return new Date(unlockMs).toISOString();
}

export function isPortalEnrollUnlocked(
  scheduledStart: string | null,
  now = new Date()
): boolean {
  const unlockAt = portalEnrollUnlockAt(scheduledStart);
  if (!unlockAt) return false;
  return now.getTime() >= new Date(unlockAt).getTime();
}
