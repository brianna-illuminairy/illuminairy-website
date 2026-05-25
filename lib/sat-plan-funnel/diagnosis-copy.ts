import { formatPrepLabels } from "@/lib/sat-plan-funnel/prep-labels";
import {
  normalizePrepMethods,
  type PrepId
} from "@/lib/sat-plan-funnel/prep-options";
import { SCORE_OPTIONS, type ScoreId } from "@/lib/sat-plan-funnel/score-options";
import { targetBandLabel } from "@/lib/sat-plan-funnel/score-gap";
import { subjectPronouns } from "@/lib/sat-plan-funnel/subject-pronouns";
import type { SatPlanAnswers } from "@/lib/sat-plan-funnel/types";
import { wrongReasonMatches } from "@/lib/sat-plan-funnel/wrong-options";
import { WORRY_OPTIONS } from "@/lib/sat-plan-funnel/worry-options";

export type DiagnosisProfileId =
  | "profile_thorough"
  | "profile_high_ceiling"
  | "profile_stuck_retaker"
  | "profile_class_middle"
  | "profile_tutor_no_system"
  | "profile_anxious_performer"
  | "profile_content_gap"
  | "profile_default";

const HIGH_GPA_IDS = new Set(["gpa_3_5_3_8", "gpa_3_8_4", "gpa_4_plus"]);

const LOW_SCORE_IDS = new Set<ScoreId>([
  "score_below_1000",
  "score_1000_1100",
  "score_1100_1200"
]);

const PROFILE_LABELS: Record<DiagnosisProfileId, string> = {
  profile_thorough: "The Thorough Achiever",
  profile_high_ceiling: "High Ceiling, Untrained Test-Taker",
  profile_stuck_retaker: "The Prepared-but-Stuck Retaker",
  profile_class_middle: "Lost in the Middle of the Room",
  profile_tutor_no_system: "Tutor Hours, No Plan",
  profile_anxious_performer: "Knows It, Freezes on Test Day",
  profile_content_gap: "Strong Student, Specific Leaks",
  profile_default: "The Focused Improver"
};

export function recentScoreBandLabel(recentScore?: string): string | null {
  if (!recentScore) return null;
  return SCORE_OPTIONS.find((row) => row.id === recentScore)?.label ?? null;
}

export function basedOnWhatYouShared(_testTaker?: string): string {
  return "Based on what you shared";
}

export function thePatternWeUsuallySee(): string {
  return "The pattern we usually see here is";
}

function meaningfulPrepIds(answers: SatPlanAnswers): PrepId[] {
  return normalizePrepMethods(answers.prep_method).filter(
    (id) => id !== "prep_little_none"
  );
}

export function prepMirrorPhrase(answers: SatPlanAnswers): string | null {
  const labels = formatPrepLabels(meaningfulPrepIds(answers));
  if (!labels) return null;

  const { subject } = subjectPronouns(answers.test_taker);
  if (answers.test_taker === "test_taker_self") {
    return `You said you prepared with ${labels}.`;
  }
  if (subject === "he") {
    return `You said he prepared with ${labels}.`;
  }
  if (subject === "she") {
    return `You said she prepared with ${labels}.`;
  }
  return `You said they prepared with ${labels}.`;
}

export function worryEchoClause(worries?: string[]): string | null {
  if (!worries?.length) return null;
  const first = worries
    .map((id) => WORRY_OPTIONS.find((row) => row.id === id)?.label)
    .find(Boolean);
  return first ? `You flagged ${first.toLowerCase()}.` : null;
}

function isHighGpa(gpaBand?: string): boolean {
  return Boolean(gpaBand && HIGH_GPA_IDS.has(gpaBand));
}

function isLowScoreBand(recentScore?: string): boolean {
  return Boolean(recentScore && LOW_SCORE_IDS.has(recentScore as ScoreId));
}

function contentGapCount(wrongReasons?: string[]): number {
  if (!wrongReasons?.length) return 0;
  return wrongReasons.filter(
    (id) =>
      id.startsWith("wrong_content_") ||
      id === "wrong_cat_math" ||
      id === "wrong_cat_reading"
  ).length;
}

/** Logic-only prep profile (INT7 screen deferred). First match wins. */
export function diagnosisProfileId(answers: SatPlanAnswers): DiagnosisProfileId {
  const wrong = answers.wrong_reasons;
  const prepIds = normalizePrepMethods(answers.prep_method);

  if (
    isHighGpa(answers.gpa_band) &&
    wrong &&
    (wrongReasonMatches(wrong, "time") || wrongReasonMatches(wrong, "anxiety"))
  ) {
    return "profile_thorough";
  }

  if (
    (answers.test_history === "history_none" ||
      prepIds.includes("prep_own_nothing")) &&
    isHighGpa(answers.gpa_band)
  ) {
    return "profile_high_ceiling";
  }

  if (
    (answers.test_history === "history_twice" ||
      answers.test_history === "history_three_plus") &&
    isLowScoreBand(answers.recent_score)
  ) {
    return "profile_stuck_retaker";
  }

  if (prepIds.includes("prep_class") && isLowScoreBand(answers.recent_score)) {
    return "profile_class_middle";
  }

  if (prepIds.includes("prep_tutor") && isLowScoreBand(answers.recent_score)) {
    return "profile_tutor_no_system";
  }

  if (wrong && wrongReasonMatches(wrong, "anxiety")) {
    return "profile_anxious_performer";
  }

  if (contentGapCount(wrong) >= 2) {
    return "profile_content_gap";
  }

  return "profile_default";
}

export function diagnosisProfileLabel(answers: SatPlanAnswers): string {
  return PROFILE_LABELS[diagnosisProfileId(answers)];
}

export function studentsWithProfileTypically(answers: SatPlanAnswers): string {
  const { subject } = subjectPronouns(answers.test_taker);
  const label = diagnosisProfileLabel(answers);

  if (answers.test_taker === "test_taker_self") {
    return `Students with a profile like yours — ${label} — typically`;
  }
  if (subject === "he") {
    return `Students with his profile — ${label} — typically`;
  }
  if (subject === "she") {
    return `Students with her profile — ${label} — typically`;
  }
  return `Students with their profile — ${label} — typically`;
}

export type ProfilePatternOptions = {
  /** Include recent_score band when collected (post-score steps). */
  includeScoreBand?: boolean;
  /** Echo prep selection in the mirror clause. */
  includePrep?: boolean;
};

export function profilePatternLine(
  answers: SatPlanAnswers,
  options: ProfilePatternOptions = {}
): string | null {
  const target = targetBandLabel(answers.target_score);
  const scoreBand =
    options.includeScoreBand && answers.recent_score
      ? recentScoreBandLabel(answers.recent_score)
      : null;

  const prepIds = meaningfulPrepIds(answers);
  const prepBit =
    options.includePrep && prepIds.length > 0
      ? prepIds.includes("prep_class")
        ? "group class"
        : formatPrepLabels(prepIds)
      : null;

  const mirrorParts: string[] = [basedOnWhatYouShared(answers.test_taker)];
  const detail: string[] = [];
  if (prepBit) detail.push(prepBit);
  if (target && target !== "your goal") {
    detail.push(`a goal of ${target}`);
  }
  if (scoreBand) detail.push(`a recent score around ${scoreBand}`);

  if (detail.length === 0) return `${mirrorParts[0]} — ${thePatternWeUsuallySee()}`;

  return `${mirrorParts[0]} — ${detail.join(" and ")} — ${thePatternWeUsuallySee()}`;
}

export function wrongMirrorSnippet(wrongReasons?: string[]): string | null {
  if (!wrongReasons?.length) return null;

  if (wrongReasonMatches(wrongReasons, "anxiety")) {
    return "test-day pressure showed up more than missing content";
  }
  if (wrongReasonMatches(wrongReasons, "time")) {
    return "pacing under the clock cost more points than raw knowledge";
  }
  if (wrongReasonMatches(wrongReasons, "prep")) {
    return "prep never turned into timed, digital full-test reps";
  }
  if (wrongReasonMatches(wrongReasons, "content")) {
    return "a few topic leaks kept repeating on the test";
  }
  if (wrongReasonMatches(wrongReasons, "focus")) {
    return "stamina and focus broke down before the test was over";
  }
  if (wrongReasonMatches(wrongReasons, "math")) {
    return "math questions were a main drain on points";
  }
  if (wrongReasonMatches(wrongReasons, "reading")) {
    return "reading and writing passages were a main drain on points";
  }

  return null;
}

export function familiesAimingForGoal(answers: SatPlanAnswers): string | null {
  const band = targetBandLabel(answers.target_score);
  if (!band || band === "your goal") return null;
  if (answers.test_taker === "test_taker_self") {
    return `Families aiming for ${band} often feel the same pressure you described.`;
  }
  return `Families aiming for ${band} often feel the same pressure.`;
}

function possessiveForReport(testTaker?: string): string {
  switch (testTaker) {
    case "test_taker_daughter":
      return "her";
    case "test_taker_son":
      return "his";
    case "test_taker_self":
      return "your";
    default:
      return "their";
  }
}

export function reportDiagnosisIntro(answers: SatPlanAnswers): string {
  const profile = diagnosisProfileLabel(answers);
  const possessive = possessiveForReport(answers.test_taker);
  const gapTarget = targetBandLabel(answers.target_score);

  if (answers.test_taker === "test_taker_self") {
    return `Based on your answers, your prep profile looks like ${profile}. This snapshot maps the gap to ${gapTarget} — not a score guarantee.`;
  }

  return `Based on your answers, ${possessive} prep profile looks like ${profile}. This snapshot maps the gap to ${gapTarget} — not a score guarantee.`;
}
