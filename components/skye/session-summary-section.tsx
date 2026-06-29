import type { ReactNode } from "react";

export function SessionSummarySection({
  dateLabel,
  title,
  summary,
  wins,
  children,
}: {
  dateLabel: string;
  title: string;
  summary: string;
  wins: readonly string[];
  children?: ReactNode;
}) {
  return (
    <section className="skye-lesson-deck__section" id="post-session-summary">
      <p className="skye-lesson-deck__lesson-meta">Post-session · {dateLabel}</p>
      <h2 className="skye-lesson-deck__heading">{title}</h2>
      <p className="skye-lesson-deck__focus">{summary}</p>

      <h3 className="skye-lesson-deck__slides-heading">Aha moments from this session</h3>
      <ul className="skye-lesson-deck__wins">
        {wins.map((win) => (
          <li key={win}>{win}</li>
        ))}
      </ul>

      {children}
    </section>
  );
}
