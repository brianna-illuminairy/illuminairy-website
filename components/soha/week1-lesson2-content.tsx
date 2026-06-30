import Link from "next/link";
import { SessionSummarySection } from "@/components/soha/session-summary-section";
import { SlideEmbed } from "@/components/soha/week1-shared";
import { homeworkPortalLoginUrl } from "@/lib/internal-links";
import {
  WEEK1_LESSON2,
  WEEK1_LESSON2_HOMEWORK_SETS,
} from "@/lib/soha/session-notes/week1-lesson2";
import { WEEK1_LESSON1_SLIDE_DECK_HREF } from "@/lib/soha/session-notes/week1-lesson1";

export function SohaWeek1Lesson2Content() {
  const session = WEEK1_LESSON2;

  return (
    <div className="soha-week1 aurora-portal__content">
      <header className="soha-week1__page-head">
        <p className="aurora-eyebrow">Illuminairy · Week 1 · Lesson 2</p>
        <h1 className="soha-week1__title">{session.title}</h1>
        <p className="soha-week1__lede">
          {session.dateLabel} · Homework miss review and timed Transitions 3 quiz (28/30).
        </p>
      </header>

      <SessionSummarySection
        dateLabel={session.dateLabel}
        title="Session summary + homework"
        summary={session.summary}
        wins={session.wins}
      >
        <div className="soha-week1__note-card" id="homework-due">
          <p className="soha-week1__note-label">Homework Portal</p>
          <h3 className="soha-week1__note-title">{session.homework.headline}</h3>
          <p className="soha-week1__focus">{session.homework.body}</p>
          <ul className="soha-week1__homework-list">
            {WEEK1_LESSON2_HOMEWORK_SETS.map((set) => (
              <li key={set.id}>
                <strong>{set.title}</strong> — due {set.dueLabel}. {set.note}
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
          <h3 className="soha-week1__note-title">Mistake log + math preview</h3>
          <p className="soha-week1__focus">{session.nextSession.body}</p>
          <p className="soha-week1__habit">
            <Link href="/soha/plan#error-log" className="soha-week1__inline-link">
              Error log setup on your study plan
            </Link>
          </p>
        </div>
      </SessionSummarySection>

      <section className="soha-week1__section">
        <p className="soha-week1__lesson-meta">Lesson replay</p>
        <h2 className="soha-week1__heading">Transitions deck</h2>
        <p className="soha-week1__focus">
          Tip-off word cheat sheet and category examples from Lesson 1 — use while logging misses.
        </p>
        <p className="soha-week1__habit">
          <Link href={WEEK1_LESSON1_SLIDE_DECK_HREF} className="soha-week1__inline-link">
            Open transitions deck (fullscreen)
          </Link>
        </p>
        <SlideEmbed title="Reading & Writing · Transitions" src={WEEK1_LESSON1_SLIDE_DECK_HREF} />
      </section>
    </div>
  );
}
