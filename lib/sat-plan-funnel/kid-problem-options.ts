export type KidProblemOption = {
  id: string;
  label: string;
  ariaLabel: string;
};

/** INT13 — biggest blockers on self-study SAT prep (multiselect). */
export const KID_PROBLEM_OPTIONS: KidProblemOption[] = [
  {
    id: "kid_block_time",
    label: "Ran out of time",
    ariaLabel: "Ran out of time on practice or the test"
  },
  {
    id: "kid_block_focus",
    label: "Struggled with stamina",
    ariaLabel: "Struggled with focus or stamina"
  },
  {
    id: "kid_block_anxiety",
    label: "Overthought",
    ariaLabel: "Overthought or second-guessed answers"
  },
  { id: "kid_block_math", label: "Math", ariaLabel: "Struggled with math" },
  {
    id: "kid_block_reading",
    label: "Reading & writing",
    ariaLabel: "Struggled with reading and writing"
  },
  {
    id: "kid_block_prep",
    label: "Not enough preparation",
    ariaLabel: "Not enough preparation or practice"
  }
];

export function kidProblemLabels(ids?: string[]): string | null {
  if (!ids?.length) return null;
  const map = new Map(KID_PROBLEM_OPTIONS.map((row) => [row.id, row.label]));
  return ids.map((id) => map.get(id)).filter(Boolean).join(", ") || null;
}
