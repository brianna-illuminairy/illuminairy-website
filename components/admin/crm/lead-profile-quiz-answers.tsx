"use client";

import {
  HIDDEN_QUIZ_KEYS,
  META_KEY_ORDER,
  QUIZ_KEY_ORDER,
  formatAnswerValue,
  getQuestionLabel
} from "@/lib/admin/quiz-answer-labels";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <li className="grid grid-cols-[160px_1fr] gap-3 border-b border-border/50 pb-2 last:border-b-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="break-words">
        {value === "—" ? <span className="text-muted-foreground">—</span> : value}
      </span>
    </li>
  );
}

export function LeadProfileQuizAnswers({
  answers
}: {
  answers: Record<string, unknown>;
}) {
  const present = Object.keys(answers);
  if (present.length === 0) {
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

  const quizKeys = QUIZ_KEY_ORDER.filter((k) => k in answers);
  const metaKeys = META_KEY_ORDER.filter((k) => k in answers);
  const orderedKnown = new Set([
    ...QUIZ_KEY_ORDER,
    ...META_KEY_ORDER,
    ...Array.from(HIDDEN_QUIZ_KEYS)
  ]);
  const extras = present.filter((k) => !orderedKnown.has(k)).sort();

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-border bg-surface p-4">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          SAT funnel intake
        </h2>
        {quizKeys.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            No structured intake answers on this lead.
          </p>
        ) : (
          <ul className="mt-3 space-y-2 text-sm">
            {quizKeys.map((k) => (
              <Row
                key={k}
                label={getQuestionLabel(k)}
                value={formatAnswerValue(k, answers[k])}
              />
            ))}
          </ul>
        )}
      </section>

      {metaKeys.length > 0 ? (
        <section className="rounded-xl border border-border bg-surface p-4">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Funnel context
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            {metaKeys.map((k) => (
              <Row
                key={k}
                label={getQuestionLabel(k)}
                value={formatAnswerValue(k, answers[k])}
              />
            ))}
          </ul>
        </section>
      ) : null}

      {extras.length > 0 ? (
        <section className="rounded-xl border border-dashed border-border bg-surface/50 p-4">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Other fields
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Unlabeled keys captured on this lead. Add labels in
            <code className="ml-1 font-mono">lib/admin/quiz-answer-labels.ts</code>.
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            {extras.map((k) => (
              <li
                key={k}
                className="grid grid-cols-[160px_1fr] gap-3 border-b border-border/50 pb-2 last:border-b-0"
              >
                <span className="font-mono text-xs text-muted-foreground">{k}</span>
                <span className="break-words">{formatAnswerValue(k, answers[k])}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
