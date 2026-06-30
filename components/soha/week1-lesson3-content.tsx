import Link from "next/link";
import { SessionSummarySection } from "@/components/soha/session-summary-section";
import { homeworkPortalLoginUrl } from "@/lib/internal-links";
import {
  WEEK1_LESSON3,
  WEEK1_LESSON3_MATH_SETS,
  WEEK1_LESSON3_WHITEBOARD_URL,
} from "@/lib/soha/session-notes/week1-lesson3";

export function SohaWeek1Lesson3Content() {
  const session = WEEK1_LESSON3;

  return (
    <div className="soha-week1 aurora-portal__content">
      <header className="soha-week1__page-head">
        <p className="aurora-eyebrow">Illuminairy · Week 1 · Lesson 3</p>
        <h1 className="soha-week1__title">{session.title}</h1>
        <p className="soha-week1__lede">
          {session.dateLabel} · Mistake log review, M1Q11 whiteboard, equivalent expressions reps.
        </p>
      </header>

      <SessionSummarySection
        dateLabel={session.dateLabel}
        title="Session summary + homework"
        summary={session.summary}
        wins={session.wins}
      >
        <div className="soha-week1__note-card">
          <p className="soha-week1__note-label">Whiteboard</p>
          <h3 className="soha-week1__note-title">M1Q11 + equivalent expressions</h3>
          <p className="soha-week1__focus">
            Live work from session — y − 42 component factoring, 3x + k factor problem, factor theorem on x + 2a.
          </p>
          <p className="soha-week1__habit">
            <a
              href={WEEK1_LESSON3_WHITEBOARD_URL}
              className="aurora-btn-primary soha-week1__cta-inline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open whiteboard
            </a>
          </p>
        </div>

        <div className="soha-week1__note-card" id="homework-due">
          <p className="soha-week1__note-label">Homework Portal</p>
          <h3 className="soha-week1__note-title">{session.homework.headline}</h3>
          <p className="soha-week1__focus">{session.homework.body}</p>
          <ul className="soha-week1__homework-list">
            {WEEK1_LESSON3_MATH_SETS.map((set) => (
              <li key={set.id}>
                <strong>{set.title}</strong> — {set.note}
              </li>
            ))}
          </ul>
          <p className="soha-week1__habit">
            <a
              href={homeworkPortalLoginUrl}
              className="aurora-btn-secondary soha-week1__cta-inline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open Homework Portal
            </a>
          </p>
        </div>

        <div className="soha-week1__note-card">
          <p className="soha-week1__note-label">{session.nextSession.headline}</p>
          <h3 className="soha-week1__note-title">Factoring &amp; factor theorem</h3>
          <p className="soha-week1__focus">{session.nextSession.body}</p>
          <p className="soha-week1__habit">
            <Link href="/soha/plan" className="soha-week1__inline-link">
              Week 2 on your improvement plan
            </Link>
          </p>
        </div>
      </SessionSummarySection>
    </div>
  );
}
