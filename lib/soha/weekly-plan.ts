export type SohaPlanWeek = {
  week: number;
  section: "rw" | "math" | "review";
  skillLabel: string;
  points?: number;
  hasPracticeTest?: boolean;
  summary: string;
  volume: string;
};

export const SOHA_WEEKLY_PLAN: SohaPlanWeek[] = [
  {
    week: 1,
    section: "rw",
    skillLabel: "Transitions",
    points: 52,
    summary:
      "Focus on transition questions across all difficulty levels. Each session should include a short lesson, diagnostic reteaching, and hard-only transition practice. Emphasis should be placed on identifying the exact relationship between sentences before reviewing the answer choices.",
    volume: "Estimated volume: 110 questions.",
  },
  {
    week: 2,
    section: "math",
    skillLabel: "Factoring, Factor Theorem, and Zero-Product Form",
    points: 48,
    summary:
      "Focus on factoring and symbolic equation setup. Sessions should cover greatest common factor, grouping, the ac-method, factor theorem, zero-product form, and calculator-by-hand decision rules. Reteach the diagnostic miss in this area, with emphasis on moving all terms to one side before factoring.",
    volume: "Estimated volume: 110 questions.",
  },
  {
    week: 3,
    section: "rw",
    skillLabel: "Boundaries and Punctuation",
    points: 33,
    hasPracticeTest: true,
    summary:
      "Focus on sentence boundaries, independent clauses, dependent clauses, commas, semicolons, colons, and conjunctions. Each session should require a complete-clause check before selecting any punctuation answer. Reteach the diagnostic misses in this area until the clause-check process is automatic. This week includes the first full-length timed practice test.",
    volume: "Estimated volume: full practice test plus approximately 110 questions.",
  },
  {
    week: 4,
    section: "rw",
    skillLabel: "Command of Evidence",
    points: 22,
    summary:
      "Focus on evidence questions in both text and data formats. Each session should begin by restating the claim in simple terms before evaluating the answer choices. Emphasis should be placed on rejecting answers that are true but do not directly support the claim. Reteach the diagnostic misses in this area.",
    volume: "Estimated volume: 110 questions.",
  },
  {
    week: 5,
    section: "math",
    skillLabel: "Geometry",
    points: 16,
    summary:
      "Focus on geometry setup, especially area, volume, surface area, and formula-sheet gaps. Circles should remain in light maintenance only, since she answered every circle question correctly on the diagnostic.",
    volume: "Estimated volume: 110 questions.",
  },
  {
    week: 6,
    section: "math",
    skillLabel: "Nonlinear Systems and Advanced Math",
    points: 27,
    hasPracticeTest: true,
    summary:
      "Focus on nonlinear equations, equivalent expressions, collinear slopes, and multi-step proportional reasoning. Sessions should emphasize setup, structure, and deciding when a problem should be solved by hand rather than with the calculator. This week includes the second full-length timed practice test.",
    volume: "Estimated volume: full practice test plus approximately 110 questions.",
  },
  {
    week: 7,
    section: "rw",
    skillLabel: "Subject-Verb Agreement",
    points: 16,
    summary:
      "Focus on identifying the true subject of the sentence and matching it to the correct verb. Each session should require crossing out interrupting phrases before choosing an answer. Reteach the diagnostic miss in this area until the process is automatic.",
    volume: "Estimated volume: 110 questions.",
  },
  {
    week: 8,
    section: "review",
    skillLabel: "Practice Test and Missed-Question Review",
    hasPracticeTest: true,
    summary:
      "Complete a third full-length timed practice test. Afterward, review every missed question from the diagnostic and all three practice tests. Any skill area still below target should receive additional focused practice.",
    volume: "Estimated volume: full practice test plus approximately 120 questions.",
  },
  {
    week: 9,
    section: "review",
    skillLabel: "Final Review and Test-Day Preparation",
    summary:
      "Complete mixed review across all targeted Reading and Writing and Math skills. Prioritize hard problem sets, recurring error types, and test-day execution. The week should end with a clear plan for pacing, calculator use, question triage, and final review before the August 22 test date.",
    volume: "Estimated volume: 100 questions.",
  },
];

export function currentSohaPlanWeek(now = new Date()): number | null {
  const start = new Date("2026-06-17T12:00:00");
  if (now < start) return null;
  const elapsed = Math.floor((now.getTime() - start.getTime()) / (7 * 24 * 60 * 60 * 1000));
  const week = elapsed + 1;
  if (week < 1 || week > SOHA_WEEKLY_PLAN.length) return null;
  return week;
}
