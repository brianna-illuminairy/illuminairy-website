/** i-method lead — one canonical line; gain inserts when timeline allows. */

export type MethodLeadPart = { text: string; em?: boolean };

export function methodScreenLeadParts(
  gain: number | null | undefined,
  showGainMath: boolean
): MethodLeadPart[] {
  const parts: MethodLeadPart[] = [
    { text: "Great news, we've helped parents like you identify their child's " },
    { text: "high-impact skills", em: true },
    { text: ", build a plan that helps them raise their SAT score" },
  ];

  if (showGainMath && gain != null) {
    parts.push({ text: " by " });
    parts.push({ text: `${gain}+ points`, em: true });
  }

  parts.push({ text: ", before applications are due." });
  return parts;
}
