import { GPA_OPTIONS } from "@/lib/sat-plan-funnel/gpa-options";
import { HISTORY_OPTIONS } from "@/lib/sat-plan-funnel/history-options";
import { HOURS_OPTIONS } from "@/lib/sat-plan-funnel/hours-options";
import { PREP_OPTIONS } from "@/lib/sat-plan-funnel/prep-options";
import { conservativeScoreGap, targetBandLabel } from "@/lib/sat-plan-funnel/score-gap";
import { SCORE_OPTIONS } from "@/lib/sat-plan-funnel/score-options";
import { getTestDateLabel, resolveTimelineFromTestDate } from "@/lib/sat-plan-funnel/sat-test-dates";
import { TARGET_SCORE_OPTIONS } from "@/lib/sat-plan-funnel/target-score-options";
import type { SatPlanAnswers } from "@/lib/sat-plan-funnel/types";
import { TEST_TAKER_OPTIONS } from "@/lib/sat-plan-funnel/test-taker-options";
import { WRONG_CATEGORIES } from "@/lib/sat-plan-funnel/wrong-options";
import { WORRY_OPTIONS } from "@/lib/sat-plan-funnel/worry-options";

export type ReportSummaryRow = {
  label: string;
  value: string;
};

function labelFromOptions(
  id: string | undefined,
  options: { id: string; label: string }[]
): string | null {
  if (!id) return null;
  return options.find((row) => row.id === id)?.label ?? null;
}

function wrongLabels(ids?: string[]): string | null {
  if (!ids?.length) return null;
  const map = new Map(
    WRONG_CATEGORIES.flatMap((cat) => cat.options.map((opt) => [opt.id, opt.label]))
  );
  return ids.map((id) => map.get(id)).filter(Boolean).join(", ") || null;
}

function prepLabels(prep?: string | string[]): string | null {
  if (!prep) return null;
  const ids = Array.isArray(prep) ? prep : [prep];
  const labels = ids
    .map((id) => PREP_OPTIONS.find((row) => row.id === id)?.label)
    .filter(Boolean);
  return labels.length ? labels.join(", ") : null;
}

export function buildReportSummary(answers: SatPlanAnswers): ReportSummaryRow[] {
  const rows: ReportSummaryRow[] = [];

  const who = labelFromOptions(answers.test_taker, TEST_TAKER_OPTIONS);
  if (who) rows.push({ label: "Student", value: who });

  const target = labelFromOptions(answers.target_score, TARGET_SCORE_OPTIONS);
  if (target) rows.push({ label: "Target score", value: target });

  const history = labelFromOptions(answers.test_history, HISTORY_OPTIONS);
  if (history) rows.push({ label: "Test history", value: history });

  const prep = prepLabels(answers.prep_method);
  if (prep) rows.push({ label: "Last prep", value: prep });

  const hours = labelFromOptions(answers.study_hours, HOURS_OPTIONS);
  if (hours) rows.push({ label: "Study hours", value: hours });

  const score = labelFromOptions(answers.recent_score, SCORE_OPTIONS);
  if (score) rows.push({ label: "Recent score", value: score });

  const wrong = wrongLabels(answers.wrong_reasons);
  if (wrong) rows.push({ label: "What went wrong", value: wrong });

  const gpa = labelFromOptions(answers.gpa_band, GPA_OPTIONS);
  if (gpa) rows.push({ label: "GPA", value: gpa });

  const testDate = getTestDateLabel(answers.test_date) ?? answers.test_date;
  if (testDate) rows.push({ label: "Test date", value: testDate });

  const timeline = resolveTimelineFromTestDate(answers.test_date);
  if (timeline.weeks && answers.test_date !== "test_date_not_planning") {
    rows.push({ label: "Runway", value: `${timeline.weeks} weeks` });
  }

  const gap = conservativeScoreGap(answers.target_score, answers.recent_score);
  rows.push({ label: "Score gap", value: `${gap} points to ${targetBandLabel(answers.target_score)}` });

  if (answers.target_schools?.trim()) {
    rows.push({ label: "Target schools", value: answers.target_schools.trim() });
  }

  const worries = answers.worries
    ?.map((id) => WORRY_OPTIONS.find((row) => row.id === id)?.label)
    .filter(Boolean)
    .join(", ");
  if (worries) rows.push({ label: "Top worries", value: worries });

  return rows;
}
