"use client";

const PRIORITY_KEYS = [
  "qWho",
  "q-score-lower",
  "q1",
  "q2",
  "q3",
  "q4",
  "q-doubts",
  "q5",
  "q6",
  "q7",
  "q9",
  "q8",
  "achievability",
  "name"
];

function format(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

export function LeadProfileQuizAnswers({
  answers
}: {
  answers: Record<string, unknown>;
}) {
  const keys = Object.keys(answers);
  if (keys.length === 0) {
    return (
      <section className="rounded-xl border border-border bg-surface p-4">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Quiz answers
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          No quiz answers captured for this lead yet.
        </p>
      </section>
    );
  }

  // Sort with priority keys first, then alphabetical for the rest.
  const sorted = [
    ...PRIORITY_KEYS.filter((k) => k in answers),
    ...keys.filter((k) => !PRIORITY_KEYS.includes(k)).sort()
  ];

  return (
    <section className="rounded-xl border border-border bg-surface p-4">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Quiz answers
      </h2>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {sorted.map((k) => (
          <li
            key={k}
            className="grid grid-cols-[120px_1fr] gap-2 border-b border-border/50 pb-2 text-sm"
          >
            <span className="font-mono text-xs text-muted-foreground">{k}</span>
            <span className="break-words">{format(answers[k])}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
