/**
 * Canonical quiz answer snapshot for visitors + leads (no secrets).
 * Updated on every funnel step / answer change — not only at lead submit.
 */

export type QuizAnswersSnapshotInput = {
  qWho?: string | null;
  qScoreLower?: string | null;
  q1?: string | null;
  q2?: string | null;
  q3?: string | null;
  q4?: string | null;
  q5?: string | null;
  q6?: string[];
  q7?: string[];
  qDoubts?: string[];
  q8?: string | null;
  q9?: string | null;
  kidName?: string | null;
  parentName?: string | null;
  parentEmail?: string | null;
  parentPhone?: string | null;
  planChoice?: string | null;
  confirmTcpa?: boolean;
  sat_lp_variant?: string | null;
};

export type QuizAnswersSnapshot = {
  qWho: string | null;
  qScoreLower: string | null;
  q1: string | null;
  q2: string | null;
  q3: string | null;
  q4: string | null;
  q5: string | null;
  q6: string[];
  q7: string[];
  qDoubts: string[];
  q8: string | null;
  q9: string | null;
  kidName: string | null;
  parentName: string | null;
  parentEmail: string | null;
  parentPhone: string | null;
  planChoice: string;
  confirmTcpa: boolean;
  sat_lp_variant: string | null;
};

function trimOrNull(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const t = value.trim();
  return t || null;
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((x) => typeof x === "string") : [];
}

/** Latest funnel answers for CRM visitors + touch_events payloads. */
export function buildQuizAnswersSnapshot(
  answers: QuizAnswersSnapshotInput
): QuizAnswersSnapshot {
  return {
    qWho: answers.qWho ?? null,
    qScoreLower: answers.qScoreLower ?? null,
    q1: answers.q1 ?? null,
    q2: answers.q2 ?? null,
    q3: answers.q3 ?? null,
    q4: answers.q4 ?? null,
    q5: answers.q5 ?? null,
    q6: stringArray(answers.q6),
    q7: stringArray(answers.q7),
    qDoubts: stringArray(answers.qDoubts),
    q8: answers.q8 ?? null,
    q9: answers.q9 ?? null,
    kidName: trimOrNull(answers.kidName),
    parentName: trimOrNull(answers.parentName),
    parentEmail: trimOrNull(answers.parentEmail),
    parentPhone: trimOrNull(answers.parentPhone),
    planChoice: answers.planChoice?.trim() || "full",
    confirmTcpa: Boolean(answers.confirmTcpa),
    sat_lp_variant: answers.sat_lp_variant ?? null
  };
}

export function hasQuizAnswersData(snapshot: QuizAnswersSnapshot): boolean {
  return Boolean(
    snapshot.qWho ||
      snapshot.qScoreLower ||
      snapshot.q1 ||
      snapshot.q2 ||
      snapshot.q3 ||
      snapshot.q4 ||
      snapshot.q5 ||
      snapshot.q6.length ||
      snapshot.q7.length ||
      snapshot.qDoubts.length ||
      snapshot.q8 ||
      snapshot.q9 ||
      snapshot.kidName ||
      snapshot.parentName ||
      snapshot.parentEmail ||
      snapshot.parentPhone
  );
}
