import { AgendaTable, MathDeck } from "@/components/danielle/week1-shared";
import { homeworkPortalLoginUrl } from "@/lib/internal-links";

const LESSON2_AGENDA = [
  {
    time: "6:00 to 6:20",
    segment: "Exponent rules",
    detail:
      "Product, quotient, and power rules; zero and negative exponents. Rewrite expressions so the bases match before combining."
  },
  {
    time: "6:20 to 6:40",
    segment: "Radicals as exponents",
    detail:
      "Fractional exponents and roots are the same idea. Convert between radical and exponent form, then simplify."
  },
  {
    time: "6:40 to 6:55",
    segment: "Simplify + equivalent forms",
    detail:
      "Combine and simplify so a messy expression matches a clean answer choice. Watch for equivalent-but-rewritten forms."
  },
  {
    time: "6:55 to 7:00",
    segment: "Wrap + homework set",
    detail:
      "Name the rule before each step, then set up the equivalent expressions (exponents and radicals) practice in the Homework Portal."
  }
] as const;

const LESSON2_DECKS = [
  {
    order: 1,
    title: "Exponents and Radicals",
    when: "Lesson 2 · Thursday, July 9",
    why: "Exponent rules, fractional exponents, and radicals — rewrite and simplify to match equivalent forms.",
    src: "/danielle/files/exponents-radicals-slides"
  }
] as const;

export function DanielleWeek4Lesson2Content() {
  return (
    <div className="danielle-week1">
      <div className="danielle-portal__page-head" id="lesson-2">
        <p className="danielle-portal__eyebrow">Illuminairy · Week 4 · Lesson 2</p>
        <h1>Math · equivalent expressions: exponents and radicals</h1>
        <p className="danielle-portal__lede">
          Thursday, July 9, 6:00 to 7:00 PM CT · Math. An equivalent expressions lesson focused on
          exponents and radicals: exponent rules, fractional exponents, and rewriting radicals so a
          messy expression matches a clean answer choice.
        </p>
      </div>

      <section className="danielle-week1__section danielle-week1__lesson">
        <p className="danielle-week1__lesson-meta">
          Lesson 2 · Thursday, July 9 · 6:00 to 7:00 PM CT · Math
        </p>
        <h2 className="danielle-week1__heading">What we cover today</h2>
        <p className="danielle-week1__focus">
          Exponents and radicals are the same tool in two costumes. We build the exponent rules,
          convert radicals to fractional exponents, and simplify so equivalent expressions line up
          with the answer choices. The slides below run the full lesson.
        </p>
        <AgendaTable rows={LESSON2_AGENDA} />
        <p className="danielle-week1__habit">
          <strong>Simplify habit:</strong> name the rule before each step (product, quotient, power,
          negative, fractional), then match the bases before you combine.
        </p>

        <h3 className="danielle-week1__slides-heading">Lesson slides</h3>
        {LESSON2_DECKS.map((deck) => (
          <MathDeck key={deck.order} {...deck} />
        ))}
      </section>

      <section className="danielle-week1__section danielle-week1__notes">
        <h2 className="danielle-week1__heading">After the lesson · homework</h2>
        <div className="danielle-week1__note-card" id="homework-due">
          <p className="danielle-week1__note-label">Practice portal</p>
          <h3 className="danielle-week1__note-title">
            Complete the exponents and radicals practice in the Homework Portal
          </h3>
          <p className="danielle-week1__focus">
            After today&apos;s lesson, log in to the practice portal and finish the equivalent
            expressions (exponents and radicals) question set. Name the rule on every step, and review
            each miss: read the explanation and get three of that type in a row correct.
          </p>
          <p className="danielle-week1__habit">
            <a
              href={homeworkPortalLoginUrl}
              className="danielle-portal__pdf-open"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open Homework Portal
            </a>
          </p>
        </div>
        <p className="danielle-week1__habit">
          <strong>Portal alerts:</strong> We email and text you when session notes or lesson
          materials are added. No signup needed.
        </p>
      </section>
    </div>
  );
}
