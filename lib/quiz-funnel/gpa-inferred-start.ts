/**
 * When q4 = na (no official SAT), infer a starting score from GPA for achievability only.
 * Always labeled inferred — Skill Diagnostic replaces on enrollment.
 */

export const Q9_GPA_INFERRED_START: Record<string, number> = {
  "u3.0": 1050,
  "3.0-3.3": 1100,
  "3.3-3.5": 1120,
  "3.5-3.7": 1150,
  "3.7-3.9": 1200,
  "4.0+": 1250
};

const Q9_GPA_DISPLAY: Record<string, string> = {
  "u3.0": "below 3.0",
  "3.0-3.3": "3.0–3.3",
  "3.3-3.5": "3.3–3.5",
  "3.5-3.7": "3.5–3.7",
  "3.7-3.9": "3.7–3.9",
  "4.0+": "4.0+"
};

export function inferredStartFromGpa(q9?: string | null): number | null {
  if (!q9) return null;
  return Q9_GPA_INFERRED_START[q9] ?? null;
}

/** Parent-facing line on achievability when start came from GPA. */
export function gpaStartingScoreNote(q9?: string | null, score?: number | null): string | null {
  if (!q9 || score == null) return null;
  const gpaLabel = Q9_GPA_DISPLAY[q9];
  if (!gpaLabel) return null;
  return `No official SAT yet. We are using ~${score} as a starting point based on their ${gpaLabel} GPA until the Skill Diagnostic sets a real baseline.`;
}
