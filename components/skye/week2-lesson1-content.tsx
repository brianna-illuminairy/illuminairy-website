import Link from "next/link";
import { AgendaTable, SlideEmbed } from "@/components/skye/lesson-shared";

const WHITEBOARD_URL = "https://link.excalidraw.com/l/A4T4CdBzqDH/5FcyM67mE1R";

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
      "Problem set on factoring and the quadratic formula (due before Session 2). Radicals and discriminant come next session.",
  },
] as const;

export function SkyeWeek2Lesson1Content() {
  return (
    <div className="skye-lesson-deck">
      <header className="aurora-portal__page-head">
        <p className="aurora-eyebrow">Illuminairy · Week 2 · Session 1</p>
        <h1 className="aurora-portal__title">Nonlinear and quadratic equations</h1>
        <p className="aurora-portal__lede">
          Factoring patterns and the quadratic formula. Radicals and the discriminant are saved for
          Session 2.
        </p>
      </header>

      <section className="skye-lesson-deck__section">
        <div className="skye-lesson-deck__note-card">
          <p className="skye-lesson-deck__note-label">Session format</p>
          <h3 className="skye-lesson-deck__note-title">Deck + live whiteboard</h3>
          <p className="skye-lesson-deck__focus">
            Use the slide deck below for the factoring refresher and special forms. M1Q11, the
            quadratic formula, and factor theorem reps happen live on the shared whiteboard.
          </p>
          <p className="skye-lesson-deck__habit">
            <a
              href={WHITEBOARD_URL}
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
            This is a nonlinear equation with a constant — the y − 42 problem that trips up most
            students. We work the full answer on the whiteboard, not in the deck below.
          </p>
          <p className="skye-lesson-deck__habit">
            <a href={WHITEBOARD_URL} target="_blank" rel="noopener noreferrer">
              M1Q11 solution on whiteboard →
            </a>
          </p>
        </div>

        <h3 className="skye-lesson-deck__slides-heading">Lesson deck</h3>
        <p className="skye-lesson-deck__focus">
          Quadratics overview, factoring patterns, and SAT-style practice questions. Open fullscreen
          during session or review after class.
        </p>
        <p className="skye-lesson-deck__habit">
          <Link href="/skye/files/quadratics-lesson" className="skye-lesson-deck__inline-link">
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
