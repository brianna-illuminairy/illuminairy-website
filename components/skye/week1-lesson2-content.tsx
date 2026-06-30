import Link from "next/link";
import { AgendaTable, SlideEmbed } from "@/components/skye/lesson-shared";
import { SessionSummarySection } from "@/components/skye/session-summary-section";
import {
  SKYE_LESSON_DECK_HREF,
  SKYE_WHITEBOARD_URL,
  WEEK1_LESSON2,
  WEEK1_LESSON2_HOMEWORK_SETS,
} from "@/lib/skye/session-notes/week1-lesson2";
import { homeworkPortalLoginUrl } from "@/lib/internal-links";

const LESSON2_AGENDA = [
  {
    time: "Start",
    segment: "Quadratics overview",
    detail: "Standard form, zero-product property, parabola direction, vertex form.",
  },
  {
    time: "Deck",
    segment: "Factoring refresher",
    detail: "GCF, difference of squares, perfect squares, trinomials, AC method.",
  },
  {
    time: "Live",
    segment: "M1Q11 whiteboard",
    detail: "y − 42 nonlinear problem — component split, factor (y − 42), solve.",
  },
  {
    time: "Live",
    segment: "Equivalent expressions reps",
    detail: "Read k from a factor, difference of squares, FOIL mapping, 15x + 90 = x/a + b.",
  },
  {
    time: "Wrap",
    segment: "Homework",
    detail: "Equivalent Expressions 1 and 2 in the Homework Portal.",
  },
] as const;

export function SkyeWeek1Lesson2Content() {
  const session = WEEK1_LESSON2;

  return (
    <div className="skye-lesson-deck">
      <header className="aurora-portal__page-head">
        <p className="aurora-eyebrow">Illuminairy · Week 1 · Session 2</p>
        <h1 className="aurora-portal__title">{session.title}</h1>
        <p className="aurora-portal__lede">
          {session.dateLabel} · Quadratics deck, M1Q11 on the whiteboard, and equivalent-expression
          reps.
        </p>
      </header>

      <SessionSummarySection
        dateLabel={session.dateLabel}
        title="Session summary + homework"
        summary={session.summary}
        wins={session.wins}
      >
        <div className="skye-lesson-deck__note-card" id="homework-due">
          <p className="skye-lesson-deck__note-label">Homework Portal</p>
          <h3 className="skye-lesson-deck__note-title">{session.homework.headline}</h3>
          <p className="skye-lesson-deck__focus">{session.homework.body}</p>
          <ul className="skye-lesson-deck__homework-list">
            {WEEK1_LESSON2_HOMEWORK_SETS.map((set) => (
              <li key={set.id}>
                <strong>{set.title}</strong> — {set.note}
              </li>
            ))}
          </ul>
          <p className="skye-lesson-deck__habit">
            <a href={homeworkPortalLoginUrl} target="_blank" rel="noopener noreferrer">
              Open Homework Portal →
            </a>
          </p>
        </div>

        <div className="skye-lesson-deck__callout">
          <p className="skye-lesson-deck__note-label">{session.nextSession.headline}</p>
          <h3 className="skye-lesson-deck__note-title">Miss review on homework</h3>
          <p className="skye-lesson-deck__focus">{session.nextSession.body}</p>
        </div>
      </SessionSummarySection>

      <section className="skye-lesson-deck__section">
        <p className="skye-lesson-deck__lesson-meta">Lesson replay</p>
        <h2 className="skye-lesson-deck__heading">Slide deck + whiteboard</h2>

        <div className="skye-lesson-deck__note-card">
          <p className="skye-lesson-deck__note-label">Whiteboard</p>
          <h3 className="skye-lesson-deck__note-title">M1Q11 + equivalent expressions</h3>
          <p className="skye-lesson-deck__focus">
            Live work from session — factor theorem reps, FOIL mapping, and component expansion.
          </p>
          <p className="skye-lesson-deck__habit">
            <a
              href={SKYE_WHITEBOARD_URL}
              className="aurora-btn-ghost"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open whiteboard
            </a>
          </p>
        </div>

        <AgendaTable rows={LESSON2_AGENDA} />

        <h3 className="skye-lesson-deck__slides-heading">Quadratics deck</h3>
        <p className="skye-lesson-deck__habit">
          <Link href={SKYE_LESSON_DECK_HREF} className="skye-lesson-deck__inline-link">
            Open lesson deck (fullscreen)
          </Link>
        </p>
        <SlideEmbed
          title="Quadratics: what they are and how the SAT tests them"
          src="/skye/files/quadratics-lesson"
        />
      </section>

      <p className="skye-plan__foot-link">
        <Link href="/skye/week-1/lesson-1">Week 1 Session 1 · diagnostic review</Link>
        {" · "}
        <Link href="/skye/week-1/report">Week 1 progress report</Link>
        {" · "}
        <Link href="/skye/plan">Improvement plan</Link>
      </p>
    </div>
  );
}
