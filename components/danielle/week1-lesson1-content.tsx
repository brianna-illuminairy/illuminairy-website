import {
  POST_SESSION_1_FACTORING_BRIDGE,
  POST_SESSION_1_HOMEWORK,
  POST_SESSION_1_NEXT_SESSION,
  POST_SESSION_1_WINS
} from "@/lib/danielle-post-session-1-notes";
import { AgendaTable, MathDeck } from "@/components/danielle/week1-shared";

const LESSON1_COVERED = [
  {
    time: "6:00 to 6:20",
    segment: "Nonlinear equation types",
    detail:
      "Absolute value, quadratics, rationals, and line-and-curve systems. When to graph vs solve by hand, and when exact form means no calculator."
  },
  {
    time: "6:20 to 6:35",
    segment: "Absolute value + quadratics",
    detail:
      "Absolute value: set the inside equal to positive and negative; no solution if the right side is negative. Quadratics: move to one side, set equal to zero, factor."
  },
  {
    time: "6:35 to 6:50",
    segment: "Rationals + recognition reps",
    detail:
      "When x is in the denominator, get rid of the fraction first. Quick reps naming problem types and the first move for each."
  },
  {
    time: "6:50 to 7:00",
    segment: "Factoring foundations",
    detail:
      "GCF, simple trinomials, AC method, negative leading terms, difference of squares, and perfect squares. The step-by-step recipe for every quadratic."
  },
  {
    time: "End of session",
    segment: "Diagnostic walk-through",
    detail:
      "Module 1 Q4 (shared-expression / y minus c pattern). Module 2 Q11 preview (radical answer — we pick this up in Lesson 2)."
  }
] as const;

const LESSON1_DECKS = [
  {
    order: 1,
    title: "Recognition · nonlinear equations",
    when: "Lesson 1 · Tuesday, June 9",
    why: "Five nonlinear types, calculator vs by-hand rules, and the first move for each.",
    src: "/danielle/files/nonlinear-slides"
  },
  {
    order: 2,
    title: "Factoring · session 1",
    when: "Lesson 1 · Tuesday, June 9",
    why: "GCF, trinomials, AC method, and special patterns — the base for every quadratic solve.",
    src: "/danielle/files/factoring-slides"
  }
] as const;

export function DanielleWeek1Lesson1Content() {
  return (
    <div className="danielle-week1">
      <div className="danielle-portal__page-head">
        <p className="danielle-portal__eyebrow">Illuminairy · Week 1 · Lesson 1</p>
        <h1>Math · nonlinear equations and factoring</h1>
        <p className="danielle-portal__lede">
          Tuesday, June 9, 6:00 to 7:00 PM CT. Complete. We mapped the five nonlinear types, built
          your by-hand rules, started factoring fluency, and walked your Module 1 diagnostic miss.
        </p>
      </div>

      <section className="danielle-week1__section danielle-week1__notes" id="post-session-1">
        <p className="danielle-week1__lesson-meta">Post Session 1 · Tuesday, June 9</p>
        <h2 className="danielle-week1__heading">Session 1 summary</h2>
        <p className="danielle-week1__focus">
          Strong first Math session. You reviewed the diagnostic beforehand and said it matched what
          you saw on test day. You stayed engaged for the full hour, asked for a worked absolute
          value example, and walked through the Module 1 miss with me.
        </p>

        <h3 className="danielle-week1__slides-heading">Skills from this session</h3>
        <ul className="danielle-week1__wins">
          {POST_SESSION_1_WINS.map((win) => (
            <li key={win}>{win}</li>
          ))}
        </ul>

        <p className="danielle-week1__focus">{POST_SESSION_1_FACTORING_BRIDGE}</p>

        <div className="danielle-week1__score-card">
          <h3 className="danielle-week1__score-card-title">{POST_SESSION_1_NEXT_SESSION.headline}</h3>
          <ul className="danielle-week1__practice-list">
            {POST_SESSION_1_NEXT_SESSION.intro.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="danielle-week1__focus">{POST_SESSION_1_NEXT_SESSION.lede}</p>
          <ul className="danielle-week1__score-list">
            {POST_SESSION_1_NEXT_SESSION.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
          <p className="danielle-week1__focus">{POST_SESSION_1_NEXT_SESSION.closing}</p>
        </div>

        <div className="danielle-week1__note-card" id="homework-due">
          <p className="danielle-week1__note-label">Session note</p>
          <h3 className="danielle-week1__note-title">{POST_SESSION_1_HOMEWORK.headline}</h3>
          <p className="danielle-week1__focus">
            <strong>Due {POST_SESSION_1_HOMEWORK.dueLabel}.</strong> {POST_SESSION_1_HOMEWORK.body}
          </p>
        </div>

        <p className="danielle-week1__habit">
          <strong>Portal alerts:</strong> We email and text you when session notes or lesson materials
          are added. No signup needed.
        </p>
      </section>

      <section className="danielle-week1__section danielle-week1__lesson">
        <p className="danielle-week1__lesson-meta">
          Lesson 1 · Tuesday, June 9 · 6:00 to 7:00 PM CT · Math · Complete
        </p>
        <h2 className="danielle-week1__heading">What we covered</h2>
        <p className="danielle-week1__focus">
          Both diagnostic misses were quadratics the calculator could not finish: Module 1 Q4
          (shared-expression pattern) and Module 2 Q11 (exact radical form). Session 1 built
          recognition rules and the factoring base. Slides stay here for review.
        </p>
        <AgendaTable rows={LESSON1_COVERED} />
        <p className="danielle-week1__habit">
          <strong>Calculator habit:</strong> read the question first, name the type, decide
          calculator or by hand, then name the approach.
        </p>

        <h3 className="danielle-week1__slides-heading">Session 1 slides (review)</h3>
        {LESSON1_DECKS.map((deck) => (
          <MathDeck key={deck.order} {...deck} />
        ))}
      </section>
    </div>
  );
}
