import {
  funnelPossessiveLabel,
  funnelSubjectPhrase
} from "@/lib/sat-plan-funnel/student-voice";

/** Step 3 headline — name, your son/daughter, you, or they + is/are. */
export function targetScoreHeadline(
  testTaker?: string,
  studentFirstName?: string
): string {
  if (testTaker === "test_taker_self") {
    return "What score are you aiming for?";
  }

  const { phrase, linkingVerb } = funnelSubjectPhrase(testTaker, studentFirstName);
  return `What score ${linkingVerb} ${phrase} aiming for?`;
}

/** Step 4 — prior attempts (neutral vs worries “recent score”). */
export function historyHeadline(
  testTaker?: string,
  studentFirstName?: string
): string {
  if (testTaker === "test_taker_self") {
    return "Tell us about your prior SAT attempts";
  }

  const possessive = funnelPossessiveLabel(testTaker, studentFirstName);
  return `Tell us about ${possessive} prior SAT attempts`;
}

/** Shown when Step 1 included “Recent score” — avoids sounding like we ignored them. */
export function historyHint(worries?: string[]): string | null {
  if (!worries?.includes("recent_test")) return null;
  return "You mentioned a recent score — we'll ask for that on the next step.";
}

/** Step 8 (tested path) — how they prepared last time. */
export function prepHeadline(
  testTaker?: string,
  studentFirstName?: string
): string {
  if (testTaker === "test_taker_self") {
    return "How did you prepare last time?";
  }

  const { phrase } = funnelSubjectPhrase(testTaker, studentFirstName);
  return `How did ${phrase} prepare last time?`;
}

/** Step 7 (tested path) — recent score; PSAT label when history is PSAT-only. */
export function scoreHeadline(
  testTaker?: string,
  testHistory?: string,
  studentFirstName?: string
): string {
  const possessive = funnelPossessiveLabel(testTaker, studentFirstName);
  const exam = testHistory === "history_psat_only" ? "PSAT" : "SAT";
  if (testTaker === "test_taker_self") {
    return `What was your most recent ${exam} score?`;
  }
  return `What was ${possessive} most recent ${exam} score?`;
}

/** Step 9 — GPA band. */
export function gpaHeadline(
  testTaker?: string,
  studentFirstName?: string
): string {
  if (testTaker === "test_taker_self") {
    return "What's your GPA?";
  }
  const possessive = funnelPossessiveLabel(testTaker, studentFirstName);
  return `What's ${possessive} GPA?`;
}

/** Step 8 — what went wrong (tested path). */
export function wrongHeadline(): string {
  return "What do you think went wrong?";
}

/** Step 11 — target schools (optional). */
export function schoolsHeadline(
  testTaker?: string,
  studentFirstName?: string
): string {
  if (testTaker === "test_taker_self") {
    return "Which schools are you aiming for?";
  }

  const { phrase, linkingVerb } = funnelSubjectPhrase(testTaker, studentFirstName);
  return `Which schools ${linkingVerb} ${phrase} aiming for?`;
}

/** Contact gate — parent email for plan delivery. */
export function contactHeadline(): string {
  return "Where should we send the plan?";
}

/** v4 Screen 8 — first name after who. */
export function studentNameHeadline(testTaker?: string): string {
  switch (testTaker) {
    case "test_taker_self":
      return "What's your first name?";
    case "test_taker_daughter":
      return "What's your daughter's first name?";
    case "test_taker_son":
      return "What's your son's first name?";
    default:
      return "What's their first name?";
  }
}

export function studentNameHint(testTaker?: string): string {
  if (testTaker === "test_taker_self") {
    return "We'll personalize your plan — one word is enough.";
  }
  return "We'll personalize the plan — one word is enough.";
}

/** Step 10 — test / retake date. */
export function testDateHeadline(
  testTaker?: string,
  testHistory?: string,
  studentFirstName?: string
): string {
  const isRetake = testHistory && testHistory !== "history_none";

  if (testTaker === "test_taker_self") {
    return isRetake
      ? "When are you planning to retake the SAT?"
      : "When are you planning to take the SAT?";
  }

  const { phrase, linkingVerb } = funnelSubjectPhrase(testTaker, studentFirstName);
  const action = isRetake ? "retake" : "take";
  return `When ${linkingVerb} ${phrase} planning to ${action} the SAT?`;
}
