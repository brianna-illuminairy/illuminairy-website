/**
 * June SAT Score Review step IDs and intake guards.
 */

export const QUIZ_ENTRY_STEP = "sr-grade";

export const QUIZ_BOOKED_STEP = "sr-thank-you";

export type ScoreReviewAnswers = {
  srGrade?: string;
  srRecentScore?: string;
  srPrepared?: string[];
  srTestDate?: string;
  srTarget?: string;
  srSchoolReferral?: string;
  parentEmail?: string;
  parentName?: string;
  parentPhone?: string;
  phoneVerifiedAt?: string;
  kidName?: string;
  confirmTcpa?: boolean;
  reviewCallStart?: string;
  cbPrepAck?: boolean;
  linkShared?: boolean;
};

export function canonicalizeQuizStepId(step: string): string {
  return step;
}

function isValidEmail(raw: string | undefined): boolean {
  const v = raw?.trim() ?? "";
  if (!v.includes("@")) return false;
  const [local, domain] = v.split("@");
  return Boolean(local?.length && domain?.includes("."));
}

const INTAKE_STEP_SATISFIED: Record<string, (a: ScoreReviewAnswers) => boolean> = {
  "sr-grade": (a) => Boolean(a.srGrade),
  "sr-recent-score": (a) => Boolean(a.srRecentScore),
  "sr-prepared": (a) => Array.isArray(a.srPrepared) && a.srPrepared.length > 0,
  "sr-test-date": (a) => Boolean(a.srTestDate),
  "sr-target": (a) => Boolean(a.srTarget),
  "sr-school-referral": (a) => Boolean(a.srSchoolReferral),
  "sr-email": (a) => isValidEmail(a.parentEmail),
  "sr-name": (a) => Boolean(a.parentName?.trim()),
  "sr-phone": (a) => Boolean(a.phoneVerifiedAt),
  "sr-book": (a) =>
    Boolean(a.kidName?.trim()) &&
    isValidEmail(a.parentEmail) &&
    Boolean(a.parentName?.trim()) &&
    Boolean(a.parentPhone?.trim()) &&
    a.confirmTcpa === true,
  "sr-prep-cb": (a) => a.cbPrepAck === true,
  "sr-share": (a) => a.linkShared === true,
};

export function resolveGuardedQuizStep(
  answers: ScoreReviewAnswers,
  requestedStep: string,
  routeSteps: string[]
): string {
  const normalizedRequested = canonicalizeQuizStepId(requestedStep);
  const targetIdx = routeSteps.indexOf(normalizedRequested);
  if (targetIdx < 0) return QUIZ_ENTRY_STEP;

  for (let i = 0; i <= targetIdx; i++) {
    const step = routeSteps[i];
    const satisfied = INTAKE_STEP_SATISFIED[step];
    if (satisfied && !satisfied(answers)) return step;
  }

  return normalizedRequested;
}

export function resolveQuizResumeStep(
  answers: ScoreReviewAnswers,
  routeSteps: string[],
  lastStep?: string | null
): string {
  if (answers.reviewCallStart) {
    if (answers.linkShared) return QUIZ_BOOKED_STEP;
    if (answers.cbPrepAck) return "sr-share";
    return "sr-prep-cb";
  }

  const saved = lastStep ? canonicalizeQuizStepId(lastStep) : null;
  if (saved && routeSteps.includes(saved)) {
    return resolveGuardedQuizStep(answers, saved, routeSteps);
  }

  let resume = QUIZ_ENTRY_STEP;
  for (const step of routeSteps) {
    const satisfied = INTAKE_STEP_SATISFIED[step];
    if (satisfied) {
      if (!satisfied(answers)) {
        return step;
      }
      resume = step;
    } else {
      resume = step;
    }
  }

  return resume;
}
