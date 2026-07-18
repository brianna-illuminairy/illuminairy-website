import { MathDeck } from "@/components/danielle/week1-shared";

const DECK_SRC = "/danielle/files/algebra-lesson-1-linear-equations";

export function DanielleSatAlgebraContent() {
  return (
    <div className="danielle-week1">
      <div className="danielle-portal__page-head" id="sat-algebra">
        <p className="danielle-portal__eyebrow">Illuminairy · Bonus session</p>
        <h1>SAT Algebra · linear equations</h1>
        <p className="danielle-portal__lede">
          Saturday bonus review (about 3 hours) · Algebra. One-variable equations: integer
          coefficients, variables on both sides, fractions, plug-in, number of solutions, word
          problems, and interpreting parts of an equation. Use the slides below if you miss the
          live session — the recording will be added here after class.
        </p>
      </div>

      <section className="danielle-week1__section danielle-week1__lesson">
        <p className="danielle-week1__lesson-meta">Bonus Saturday · SAT Algebra review</p>
        <h2 className="danielle-week1__heading">Lesson slides</h2>
        <p className="danielle-week1__focus">
          Work through the deck at your own pace. Pause on the Show me walks and drills. Homework
          from the master bank uses the same skills with different questions.
        </p>
        <MathDeck
          order={1}
          title="Linear Equations · Lesson 1"
          when="Bonus Saturday SAT Algebra review"
          why="One-variable equations from concept through SAT-style practice."
          src={DECK_SRC}
        />
        <p className="danielle-week1__habit">
          <a href={DECK_SRC} className="danielle-portal__pdf-open" target="_blank" rel="noopener noreferrer">
            Open lesson fullscreen
          </a>
        </p>
      </section>

      <section className="danielle-week1__section danielle-week1__notes">
        <h2 className="danielle-week1__heading">Session recording</h2>
        <div className="danielle-week1__note-card">
          <p className="danielle-week1__note-label">Coming after class</p>
          <h3 className="danielle-week1__note-title">Video of the live session</h3>
          <p className="danielle-week1__focus">
            After Saturday&apos;s review, the recording will be posted on this page so you can
            rewatch any module.
          </p>
        </div>
      </section>
    </div>
  );
}
