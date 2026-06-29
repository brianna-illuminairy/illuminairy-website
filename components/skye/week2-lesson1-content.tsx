import Link from "next/link";
import { AgendaTable, SlideEmbed } from "@/components/skye/lesson-shared";
import {
  POST_SESSION_1_HOMEWORK,
  POST_SESSION_1_NEXT_SESSION,
  POST_SESSION_1_SUMMARY,
  POST_SESSION_1_WINS,
  SKYE_HOMEWORK_PORTAL_SETS,
  SKYE_LESSON_DECK_HREF,
  SKYE_WHITEBOARD_URL,
} from "@/lib/skye-post-session-1-notes";
import { homeworkPortalLoginUrl } from "@/lib/internal-links";

const LESSON1_AGENDA = [
  {
    time: "Start",
    segment: "Quadratics overview",
    detail:
      "What makes an equation quadratic, standard form, and when the SAT is testing zeros, vertex, or maximum/minimum.",
  },
  {
    time: "Next",
    segment: "Factoring refresher",
    detail:
      "GCF, difference of squares, perfect square trinomials, basic trinomials, and the AC method — walk through the deck together.",
  },
  {
    time: "Live",
    segment: "M1Q11 whiteboard",
    detail:
      "Full solution to Module 1 Question 11 (nonlinear equation with a constant — the y − 42 problem most students miss).",
  },
  {
    time: "Live",
    segment: "Quadratic formula + factor theorem",
    detail:
      "Introduce the quadratic formula on the whiteboard, then factor-theorem examples from diagnostic-style questions.",
  },
  {
    time: "Wrap",
    segment: "Homework",
    detail:
      "Equivalent Expressions 1 and 2 in the Homework Portal (due before the next session).",
  },
] as const;

export function SkyeWeek2Lesson1Content() {
  return (
    <div className="skye-lesson-deck">
      <header className="aurora-portal__page-head">
        <p className="aurora-eyebrow">Illuminairy · Week 2 · Session 1</p>
        <h1 className="aurora-portal__title">Nonlinear and quadratic equations</h1>
        <p className="aurora-portal__lede">
          Factoring patterns and the quadratic formula. Homework and next-session focus are below;
          session summary notes are pending.
        </p>
      </header>

      <section className="skye-lesson-deck__section" id="post-session-summary">
        <p className="skye-lesson-deck__lesson-meta">Post-session · Monday, June 29</p>
        <h2 className="skye-lesson-deck__heading">Session summary + homework</h2>

        {POST_SESSION_1_SUMMARY ? (
          <>
            <p className="skye-lesson-deck__focus">{POST_SESSION_1_SUMMARY}</p>
            {POST_SESSION_1_WINS.length > 0 ? (
              <>
                <h3 className="skye-lesson-deck__slides-heading">Aha moments from this session</h3>
                <ul className="skye-lesson-deck__wins">
                  {POST_SESSION_1_WINS.map((win) => (
                    <li key={win}>{win}</li>
                  ))}
                </ul>
              </>
            ) : null}
          </>
        ) : (
          <p className="skye-lesson-deck__focus">
            Session summary and aha moments will be posted here once notes from today&apos;s call
            are finalized.
          </p>
        )}

        <div className="skye-lesson-deck__note-card" id="homework-due">
          <p className="skye-lesson-deck__note-label">Homework Portal</p>
          <h3 className="skye-lesson-deck__note-title">{POST_SESSION_1_HOMEWORK.headline}</h3>
          <p className="skye-lesson-deck__focus">{POST_SESSION_1_HOMEWORK.body}</p>
          <ol className="skye-lesson-deck__homework-list">
            {SKYE_HOMEWORK_PORTAL_SETS.map((set) => (
              <li key={set.id}>
                <strong>{set.title}</strong> — {set.note}
              </li>
            ))}
          </ol>
          <p className="skye-lesson-deck__habit">
            <a href={homeworkPortalLoginUrl} target="_blank" rel="noopener noreferrer">
              Open Homework Portal →
            </a>
          </p>
        </div>

        <div className="skye-lesson-deck__callout">
          <p className="skye-lesson-deck__note-label">{POST_SESSION_1_NEXT_SESSION.headline}</p>
          <h3 className="skye-lesson-deck__note-title">Miss review on homework</h3>
          <p className="skye-lesson-deck__focus">{POST_SESSION_1_NEXT_SESSION.body}</p>
        </div>
      </section>

      <section className="skye-lesson-deck__section">
        <p className="skye-lesson-deck__lesson-meta">Lesson replay</p>
        <h2 className="skye-lesson-deck__heading">Slide deck + whiteboard</h2>

        <div className="skye-lesson-deck__note-card">
          <p className="skye-lesson-deck__note-label">Session format</p>
          <h3 className="skye-lesson-deck__note-title">Deck + live whiteboard</h3>
          <p className="skye-lesson-deck__focus">
            Reopen the deck for the factoring refresher and special forms. M1Q11, the quadratic
            formula, and factor theorem work stay on the shared whiteboard.
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

        <p className="skye-lesson-deck__goal-line">
          <strong>Session goal:</strong> recognize when to factor, apply special-form patterns
          quickly, and set up the quadratic formula when factoring does not finish the job.
        </p>

        <AgendaTable rows={LESSON1_AGENDA} />

        <div className="skye-lesson-deck__callout">
          <p className="skye-lesson-deck__note-label">Diagnostic walkthrough</p>
          <h3 className="skye-lesson-deck__note-title">Module 1 Question 11</h3>
          <p className="skye-lesson-deck__focus">
            Nonlinear equation with a constant — the y − 42 problem that trips up most students.
            Full solution on the whiteboard.
          </p>
          <p className="skye-lesson-deck__habit">
            <a href={SKYE_WHITEBOARD_URL} target="_blank" rel="noopener noreferrer">
              M1Q11 solution on whiteboard →
            </a>
          </p>
        </div>

        <h3 className="skye-lesson-deck__slides-heading">Lesson deck</h3>
        <p className="skye-lesson-deck__focus">
          Quadratics overview, factoring patterns, and SAT-style practice questions.
        </p>
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
        Back to the{" "}
        <Link href="/skye/plan">improvement plan</Link> or{" "}
        <Link href="/skye/diagnostic">diagnostic analysis</Link>.
      </p>
    </div>
  );
}
