/** Step 3 headline — pronoun follows Step 2 `test_taker`. */

export function targetScoreHeadline(testTaker?: string): string {
  switch (testTaker) {
    case "test_taker_daughter":
      return "What score is she aiming for?";
    case "test_taker_son":
      return "What score is he aiming for?";
    case "test_taker_self":
      return "What score are you aiming for?";
    case "test_taker_other":
      return "What score are they aiming for?";
    default:
      return "What score are you aiming for on the SAT?";
  }
}

/** Step 4 — test history headline follows Step 2 `test_taker`. */
export function historyHeadline(testTaker?: string): string {
  switch (testTaker) {
    case "test_taker_daughter":
      return "Has she taken the SAT or PSAT before?";
    case "test_taker_son":
      return "Has he taken the SAT or PSAT before?";
    case "test_taker_self":
      return "Have you taken the SAT or PSAT before?";
    case "test_taker_other":
      return "Have they taken the SAT or PSAT before?";
    default:
      return "Have they taken the SAT or PSAT before?";
  }
}

/** Step 5 — prep method headline follows Step 2 `test_taker`. */
export function prepHeadline(testTaker?: string): string {
  switch (testTaker) {
    case "test_taker_daughter":
      return "How did she prepare last time?";
    case "test_taker_son":
      return "How did he prepare last time?";
    case "test_taker_self":
      return "How did you prepare last time?";
    case "test_taker_other":
      return "How did they prepare last time?";
    default:
      return "How did they prepare last time?";
  }
}

function subjectPossessive(testTaker?: string): { subject: string; possessive: string } {
  switch (testTaker) {
    case "test_taker_daughter":
      return { subject: "she", possessive: "her" };
    case "test_taker_son":
      return { subject: "he", possessive: "his" };
    case "test_taker_self":
      return { subject: "you", possessive: "your" };
    case "test_taker_other":
      return { subject: "they", possessive: "their" };
    default:
      return { subject: "they", possessive: "their" };
  }
}

/** Step 6 — study hours (tested path). */
export function hoursHeadline(testTaker?: string): string {
  const { subject, possessive } = subjectPossessive(testTaker);
  if (subject === "you") {
    return "About how many hours did you study for the last test?";
  }
  return `About how many hours did ${subject} study for the last test?`;
}

/** Step 7 — recent score; PSAT label when history is PSAT-only. */
export function scoreHeadline(testTaker?: string, testHistory?: string): string {
  const { possessive } = subjectPossessive(testTaker);
  const exam = testHistory === "history_psat_only" ? "PSAT" : "SAT";
  if (testTaker === "test_taker_self") {
    return `What was your most recent ${exam} score?`;
  }
  return `What was ${possessive} most recent ${exam} score?`;
}

/** Step 9 — GPA band. */
export function gpaHeadline(testTaker?: string): string {
  const { possessive } = subjectPossessive(testTaker);
  if (testTaker === "test_taker_self") {
    return "What's your GPA?";
  }
  return `What's ${possessive} GPA?`;
}

/** Step 8 — what went wrong (tested path). */
export function wrongHeadline(): string {
  return "What do you think went wrong?";
}

/** Step 11 — target schools (optional). */
export function schoolsHeadline(testTaker?: string): string {
  const { subject } = subjectPossessive(testTaker);
  if (testTaker === "test_taker_self") {
    return "Which schools are you aiming for?";
  }
  return `Which schools is ${subject} aiming for?`;
}

/** Contact gate — parent email for plan delivery. */
export function contactHeadline(): string {
  return "Where should we send the plan?";
}

/** Step 10 — test / retake date. */
export function testDateHeadline(testTaker?: string, testHistory?: string): string {
  const { subject, possessive } = subjectPossessive(testTaker);
  const isRetake = testHistory && testHistory !== "history_none";
  if (testTaker === "test_taker_self") {
    return isRetake
      ? "When are you planning to retake the SAT?"
      : "When are you planning to take the SAT?";
  }
  if (isRetake) {
    return `When is ${subject} planning to retake the SAT?`;
  }
  return `When is ${subject} planning to take the SAT?`;
}
