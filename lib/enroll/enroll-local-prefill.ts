import type { QuizAnswersSnapshot } from "@/lib/crm/quiz-answers-snapshot";
import { buildQuizAnswersSnapshot } from "@/lib/crm/quiz-answers-snapshot";
import type { EnrollFieldKey } from "@/lib/enroll/enroll-field-labels";
import type { EnrollPrefill } from "@/lib/enroll/enroll-prefill";
import { readStoredQuizAnswers } from "@/lib/quiz-funnel/quiz-storage";

function splitName(full: string) {
  const parts = full.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { first: "", last: "" };
  if (parts.length === 1) return { first: parts[0], last: "" };
  return { first: parts[0], last: parts.slice(1).join(" ") };
}

function prefillFromQuizSnapshot(snapshot: QuizAnswersSnapshot): Partial<EnrollPrefill> {
  const parent = splitName(snapshot.parentName ?? "");
  return {
    parentFirst: parent.first,
    parentLast: parent.last,
    parentPhone: snapshot.parentPhone ?? "",
    parentEmail: snapshot.parentEmail ?? "",
    studentFirst: snapshot.kidName ?? ""
  };
}

export type EnrollLocalPrefillResult = {
  prefill: EnrollPrefill;
  /** True if any field was contributed from quiz localStorage. */
  usedQuizStorage: boolean;
  /** Specific keys that were filled from quiz localStorage (empty before, value after). */
  contributedKeys: EnrollFieldKey[];
};

/** Browser-only: merge SAT Score Path answers saved during `/plan`. Returns which keys it contributed. */
export function mergeEnrollPrefillFromQuizStorage(
  base: EnrollPrefill
): EnrollLocalPrefillResult {
  const answers = readStoredQuizAnswers();
  const snapshot = buildQuizAnswersSnapshot({
    parentName: typeof answers.parentName === "string" ? answers.parentName : null,
    parentEmail: typeof answers.parentEmail === "string" ? answers.parentEmail : null,
    parentPhone: typeof answers.parentPhone === "string" ? answers.parentPhone : null,
    kidName: typeof answers.kidName === "string" ? answers.kidName : null
  });

  const source = prefillFromQuizSnapshot(snapshot);
  const next: EnrollPrefill = { ...base };
  const contributedKeys: EnrollFieldKey[] = [];

  for (const k of Object.keys(next) as EnrollFieldKey[]) {
    if (!next[k].trim() && source[k]?.trim()) {
      next[k] = source[k]!.trim();
      contributedKeys.push(k);
    }
  }

  return {
    prefill: next,
    usedQuizStorage: contributedKeys.length > 0,
    contributedKeys
  };
}
