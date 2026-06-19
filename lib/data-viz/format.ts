export function formatScore(n: number): string {
  return String(Math.round(n));
}

export function formatSignedDelta(n: number): string {
  const rounded = Math.round(n);
  return rounded >= 0 ? `+${rounded}` : String(rounded);
}

export function formatPercent(n: number): string {
  return `${Math.round(n)}%`;
}
