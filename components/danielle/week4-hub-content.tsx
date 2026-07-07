import Link from "next/link";
import { homeworkPortalLoginUrl } from "@/lib/internal-links";

const WEEK_GOALS = [
  "Learn the two Command of Evidence question types: textual and quantitative.",
  "Use one habit on every evidence question: read the claim, predict the proof, then match it.",
  "Master the exponent rules and convert between radical and fractional-exponent form to match equivalent expressions.",
  "Complete both Homework Portal sets: Command of Evidence (after Lesson 1) and exponents and radicals (after Lesson 2).",
  "Review every miss: read the explanation, use the Homework Portal chatbot for more of that type, and get 3 in a row correct."
] as const;

export function DanielleWeek4HubContent() {
  return (
    <div className="danielle-week1">
      <div className="danielle-portal__page-head">
        <p className="danielle-portal__eyebrow">Illuminairy · Week 4</p>
        <h1>Lesson schedule</h1>
        <p className="danielle-portal__lede">
          Week 4 covers two topics. Lesson 1 (Tuesday, July 7) is Reading &amp; Writing Command of
          Evidence. Lesson 2 (Thursday, July 9) is an equivalent expressions Math lesson on exponents
          and radicals. Each lesson assigns a practice set in the Homework Portal.
        </p>
      </div>

      <section className="danielle-week1__section">
        <h2 className="danielle-week1__heading">Week 4 lessons</h2>
        <div className="danielle-week1__lesson-links">
          <Link href="/danielle/week-4/lesson-1" className="danielle-portal__link-card">
            <h2>Lesson 1 · Tue Jul 7</h2>
            <p>
              Command of Evidence: textual evidence (support a claim from the passage) and
              quantitative evidence (read graphs and tables), plus the lesson slide deck.
            </p>
          </Link>
          <Link href="/danielle/week-4/lesson-2" className="danielle-portal__link-card">
            <h2>Lesson 2 · Thu Jul 9</h2>
            <p>
              Equivalent expressions: exponents and radicals. Exponent rules, fractional exponents,
              and rewriting radicals to match equivalent forms, plus the lesson slide deck.
            </p>
          </Link>
        </div>
      </section>

      <section className="danielle-week1__section" id="week-4-homework-portal">
        <h2 className="danielle-week1__heading">Homework Portal assignments</h2>
        <div className="danielle-week2__homework-list">
          <article className="danielle-week2__homework-card">
            <div className="danielle-week2__homework-card-head">
              <h3 className="danielle-week1__note-title">Command of Evidence</h3>
            </div>
            <p className="danielle-week1__focus">
              Complete the Command of Evidence question set after Lesson 1. Read the claim first,
              predict the proof, then match it. Review every miss until you get 3 of that type in a
              row correct.
            </p>
          </article>
          <article className="danielle-week2__homework-card">
            <div className="danielle-week2__homework-card-head">
              <h3 className="danielle-week1__note-title">Equivalent Expressions · exponents and radicals</h3>
            </div>
            <p className="danielle-week1__focus">
              Complete the exponents and radicals question set after Lesson 2. Name the rule on every
              step, and review every miss until you get 3 of that type in a row correct.
            </p>
          </article>
        </div>
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
      </section>

      <section className="danielle-week1__section">
        <h2 className="danielle-week1__heading">Week 4 goals</h2>
        <ol className="danielle-week1__goals">
          {WEEK_GOALS.map((goal) => (
            <li key={goal}>{goal}</li>
          ))}
        </ol>
      </section>
    </div>
  );
}
