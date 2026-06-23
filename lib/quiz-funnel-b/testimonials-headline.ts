import { satProgram, satProgramOutcomes } from "@/lib/site";
import type { LabIntakeAnswers } from "@/lib/quiz-funnel-b/funnel-steps";

const Q9_GPA_LABEL: Record<string, string> = {
  "u3.0": "below 3.0",
  "3.0-3.3": "3.0–3.3",
  "3.3-3.5": "3.3–3.5",
  "3.5-3.7": "3.5–3.7",
  "3.7-3.9": "3.7–3.9",
  "4.0+": "4.0+",
};

function gpaLabel(q9?: string): string {
  if (q9 && Q9_GPA_LABEL[q9]) return Q9_GPA_LABEL[q9];
  return "similar GPAs";
}

/** Parent-facing headline for Plan Builder B testimonials — GPA + outcome stats only (marquee shows mixed score bands). */
export function planBTestimonialsHeadline(answers: Pick<LabIntakeAnswers, "q9">) {
  const { plansBuiltCount, avgPointsGained, varyDisclaimer } = satProgramOutcomes;
  const weeks = satProgram.weeks;
  const gpa = gpaLabel(answers.q9);

  return {
    headline: `We've helped ${plansBuiltCount} students with a ${gpa} GPA improve an average of ${avgPointsGained} points in ${weeks} weeks.`,
    disclaimer: varyDisclaimer,
  };
}
