import { AgendaTable, MathDeck } from "@/components/danielle/week1-shared";
import { homeworkPortalLoginUrl } from "@/lib/internal-links";

const LESSON1_AGENDA = [
  {
    time: "6:00 to 6:20",
    segment: "Right triangle basics",
    detail:
      "Label the legs and hypotenuse, then use the Pythagorean theorem to find a missing side. Name the special triangles before reaching for the calculator."
  },
  {
    time: "6:20 to 6:40",
    segment: "Special right triangles",
    detail:
      "30-60-90 and 45-45-90 side ratios. Recognize them from the angles or side pattern so you can skip long calculation."
  },
  {
    time: "6:40 to 6:55",
    segment: "SOH CAH TOA",
    detail:
      "Set up sine, cosine, and tangent from the right triangle. Pick the ratio that uses what you have and what you want."
  },
  {
    time: "6:55 to 7:00",
    segment: "Wrap + homework set",
    detail:
      "Name the triangle type and the first move for each, then set up the right triangles practice in the Homework Portal."
  }
] as const;

const LESSON1_DECKS = [
  {
    order: 1,
    title: "Right Triangles",
    when: "Lesson 1 · Tuesday, July 14",
    why: "Pythagorean theorem, special right triangles, and SOH CAH TOA — recognize the setup before you calculate.",
    src: "/danielle/files/triangles-lesson-1-slides"
  }
] as const;

export function DanielleWeek5Lesson1Content() {
  return (
    <div className="danielle-week1">
      <div className="danielle-portal__page-head" id="lesson-1">
        <p className="danielle-portal__eyebrow">Illuminairy · Week 5 · Lesson 1</p>
        <h1>Math · right triangles</h1>
        <p className="danielle-portal__lede">
          Tuesday, July 14, 6:00 to 7:00 PM CT · Math. Right triangles: the Pythagorean theorem,
          the 30-60-90 and 45-45-90 special triangles, and setting up SOH CAH TOA to find a missing
          side or angle.
        </p>
      </div>

      <section className="danielle-week1__section danielle-week1__lesson">
        <p className="danielle-week1__lesson-meta">
          Lesson 1 · Tuesday, July 14 · 6:00 to 7:00 PM CT · Math
        </p>
        <h2 className="danielle-week1__heading">What we cover today</h2>
        <p className="danielle-week1__focus">
          Right triangles reward recognition over grinding. We label the sides, use the Pythagorean
          theorem, memorize the two special-triangle ratios, and set up SOH CAH TOA so trig problems
          become one clean step. The slides below run the full lesson.
        </p>
        <AgendaTable rows={LESSON1_AGENDA} />
        <p className="danielle-week1__habit">
          <strong>Setup habit:</strong> label the legs and hypotenuse, name the triangle type, then
          pick the tool (Pythagorean, special ratio, or SOH CAH TOA) before you compute.
        </p>

        <h3 className="danielle-week1__slides-heading">Lesson slides</h3>
        {LESSON1_DECKS.map((deck) => (
          <MathDeck key={deck.order} {...deck} />
        ))}
      </section>

      <section className="danielle-week1__section danielle-week1__notes">
        <h2 className="danielle-week1__heading">After the lesson · homework</h2>
        <div className="danielle-week1__note-card" id="homework-due">
          <p className="danielle-week1__note-label">Practice portal</p>
          <h3 className="danielle-week1__note-title">
            Complete the right triangles practice in the Homework Portal
          </h3>
          <p className="danielle-week1__focus">
            After today&apos;s lesson, log in to the practice portal and finish the right triangles
            question set. Name the triangle type on every question, and review each miss: read the
            explanation and get three of that type in a row correct.
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
