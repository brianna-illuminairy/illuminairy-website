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
    <section className="soha-week1__section" id="post-session-summary">
      <p className="soha-week1__lesson-meta">Post-session · {dateLabel}</p>
      <h2 className="soha-week1__heading">{title}</h2>
      <p className="soha-week1__focus">{summary}</p>

      <h3 className="soha-week1__slides-heading">Aha moments from this session</h3>
      <ul className="soha-week1__wins">
        {wins.map((win) => (
          <li key={win}>{win}</li>
        ))}
      </ul>

      {children}
    </section>
  );
}
