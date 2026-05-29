/** q7 prep option labels — must match Questions.jsx QFQ7Tried options */
export const Q7_PREP_LABELS: Record<string, string> = {
  khan: "Khan Academy / Bluebook / YouTube",
  group: "In-person group class",
  online: "Online course or class",
  app: "SAT App",
  book: "SAT Prep Book",
  nothing: "Didn't prepare much",
};

export const Q7_PREP_PRIORITY = [
  "khan",
  "group",
  "online",
  "app",
  "book",
  "nothing",
] as const;

export type PrepSpreadClause = {
  /** Sentence subject (their selected prep, or a complete opening clause) */
  subject: string;
  /** spreads | spread — agrees with subject */
  verb: "spreads" | "spread";
  /** Wrap subject in <em> when listing named prep */
  emphasizeSubject: boolean;
};

export function normalizeQ7(q7: unknown): string[] {
  if (Array.isArray(q7)) {
    return q7.filter((id): id is string => typeof id === "string" && id.length > 0);
  }
  if (typeof q7 === "string" && q7.length > 0) return [q7];
  return [];
}

export function formatEnglishList(items: string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

/** Ordered prep labels from q7 (excludes "nothing" when other methods selected). */
export function selectedPrepLabels(q7: unknown = []): string[] {
  const ids = normalizeQ7(q7);
  return Q7_PREP_PRIORITY.filter(
    (id) => ids.includes(id) && id !== "nothing"
  ).map((id) => Q7_PREP_LABELS[id]);
}

/**
 * First clause of i-diag body: "[what they tried] spread(s) focus across Khan's 200+ SAT skills."
 * Always anchored to q7 — never generic "most prep."
 */
export function getPrepSpreadClause(q7: unknown = []): PrepSpreadClause {
  const ids = normalizeQ7(q7);
  const named = selectedPrepLabels(ids);

  if (named.length >= 1) {
    return {
      subject: formatEnglishList(named),
      verb: named.length === 1 ? "spreads" : "spread",
      emphasizeSubject: true,
    };
  }

  if (ids.includes("nothing")) {
    return {
      subject: "They didn't prepare much, so study still",
      verb: "spreads",
      emphasizeSubject: false,
    };
  }

  // q7 skipped (deep-link preview) — chart comparison tier, not "most prep"
  return {
    subject: "Self-study and group classes",
    verb: "spread",
    emphasizeSubject: false,
  };
}

export function formatWeeksUntilTest(weeks: number | null, monthName: string | null) {
  if (weeks == null || !monthName) return null;
  const unit = weeks === 1 ? "week" : "weeks";
  return { weeks, unit, monthName };
}
