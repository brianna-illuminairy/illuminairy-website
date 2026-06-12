export type EnrollPrefillSource = "quiz" | "calendly" | "payment";

export function buildEnrollPrefillNote(sources: Set<EnrollPrefillSource>): string | null {
  if (sources.size === 0) return null;

  const labels: string[] = [];
  if (sources.has("quiz")) labels.push("SAT Score Path");
  if (sources.has("calendly")) labels.push("your Strategy Call");
  if (sources.has("payment")) labels.push("payment receipt");

  const tail = "Confirm it is correct before you continue.";

  if (labels.length === 1) {
    return `We filled what we already know from ${labels[0]}. ${tail}`;
  }
  if (labels.length === 2) {
    return `We filled what we already know from ${labels[0]} and ${labels[1]}. ${tail}`;
  }
  return `We filled what we already know from ${labels.slice(0, -1).join(", ")}, and ${labels[labels.length - 1]}. ${tail}`;
}
