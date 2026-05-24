export type KidProblemOption = {
  id: string;
  label: string;
  ariaLabel: string;
};

/** INT13 — biggest blockers on self-study SAT prep (multiselect). */
export const KID_PROBLEM_OPTIONS: KidProblemOption[] = [
  { id: "kid_block_time", label: "Time", ariaLabel: "Not enough time" },
  {
    id: "kid_block_focus",
    label: "Focus or stamina",
    ariaLabel: "Focus or stamina during study"
  },
  { id: "kid_block_anxiety", label: "Anxiety", ariaLabel: "Test anxiety" },
  { id: "kid_block_math", label: "Math", ariaLabel: "Math skills" },
  { id: "kid_block_reading", label: "Reading", ariaLabel: "Reading skills" },
  {
    id: "kid_block_prep",
    label: "Lack of preparation",
    ariaLabel: "Lack of preparation or a clear plan"
  }
];

export function kidProblemLabels(ids?: string[]): string | null {
  if (!ids?.length) return null;
  const map = new Map(KID_PROBLEM_OPTIONS.map((row) => [row.id, row.label]));
  return ids.map((id) => map.get(id)).filter(Boolean).join(", ") || null;
}
