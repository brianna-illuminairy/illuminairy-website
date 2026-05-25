import { PREP_OPTIONS, type PrepId } from "@/lib/sat-plan-funnel/prep-options";

/** Human-readable list of prep method labels for mirror / diagnosis copy. */
export function formatPrepLabels(prepIds: PrepId[]): string | null {
  if (prepIds.length === 0) return null;

  const labels = prepIds
    .map((id) => PREP_OPTIONS.find((opt) => opt.id === id)?.label)
    .filter((label): label is string => Boolean(label));

  if (labels.length === 0) return null;
  if (labels.length === 1) return labels[0];
  if (labels.length === 2) return `${labels[0]} and ${labels[1]}`;

  const last = labels[labels.length - 1];
  return `${labels.slice(0, -1).join(", ")}, and ${last}`;
}
