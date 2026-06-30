import Link from "next/link";
import { SessionSummarySection } from "@/components/skye/session-summary-section";
import { WEEK1_DIAGNOSTIC_REVIEW } from "@/lib/skye/session-notes/week1-diagnostic-review";

export function SkyeWeek1Lesson1Content() {
  const session = WEEK1_DIAGNOSTIC_REVIEW;

  return (
    <div className="skye-lesson-deck">
      <header className="aurora-portal__page-head">
        <p className="aurora-eyebrow">Illuminairy · Week 1 · Session 1</p>
        <h1 className="aurora-portal__title">{session.title}</h1>
        <p className="aurora-portal__lede">
          {session.dateLabel} · Question-by-question walkthrough of diagnostic misses on the
          whiteboard.
        </p>
      </header>

      <SessionSummarySection
        dateLabel={session.dateLabel}
        title="Session summary"
        summary={session.summary}
        wins={session.wins}
      >
        <div className="skye-lesson-deck__callout">
          <p className="skye-lesson-deck__note-label">Where we go next</p>
          <h3 className="skye-lesson-deck__note-title">Skill lessons begin</h3>
          <p className="skye-lesson-deck__focus">{session.nextSessionNote}</p>
          <p className="skye-lesson-deck__habit">
            <Link href="/skye/week-1/lesson-2" className="skye-lesson-deck__inline-link">
              Week 1 Session 2 lesson →
            </Link>
          </p>
        </div>
      </SessionSummarySection>

      <p className="skye-plan__foot-link">
        <Link href="/skye/week-1/lesson-1">Week 1 Session 1 · diagnostic review</Link>
        {" · "}
        <Link href="/skye/week-1/lesson-2">Week 1 Session 2 · equivalent expressions</Link>
        {" · "}
        <Link href="/skye/week-1/report">Week 1 progress report</Link>
        {" · "}
        <Link href="/skye/diagnostic">Diagnostic analysis</Link>
        {" · "}
        <Link href="/skye/plan">Improvement plan</Link>
      </p>
    </div>
  );
}
