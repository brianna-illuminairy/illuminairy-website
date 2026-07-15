import Link from "next/link";
import { homeworkPortalLoginUrl } from "@/lib/internal-links";

const WEEK_GOALS = [
  "Label right triangles correctly and use the Pythagorean theorem to find a missing side.",
  "Recognize the 30-60-90 and 45-45-90 special triangles from their angles or side ratios.",
  "Set up SOH CAH TOA: pick the ratio that uses what you have and what you want.",
  "Complete the right triangles questions in the Homework Portal.",
  "Review every miss: read the explanation, use the Homework Portal chatbot for more of that type, and get 3 in a row correct."
] as const;

export function DanielleWeek5HubContent() {
  return (
    <div className="danielle-week1">
      <div className="danielle-portal__page-head">
        <p className="danielle-portal__eyebrow">Illuminairy · Week 5</p>
        <h1>Lesson schedule</h1>
        <p className="danielle-portal__lede">
          Week 5 focuses on right triangles. Lesson 1 (Tuesday, July 14) covers the Pythagorean
          theorem, special right triangles, and SOH CAH TOA, then assigns the right triangles
          practice set in the Homework Portal.
        </p>
      </div>

      <section className="danielle-week1__section">
        <h2 className="danielle-week1__heading">Week 5 lessons</h2>
        <div className="danielle-week1__lesson-links">
          <Link href="/danielle/week-5/lesson-1" className="danielle-portal__link-card">
            <h2>Lesson 1 · Tue Jul 14</h2>
            <p>
              Right triangles: Pythagorean theorem, 30-60-90 and 45-45-90 special triangles, and
              SOH CAH TOA, plus the lesson slide deck.
            </p>
          </Link>
        </div>
      </section>

      <section className="danielle-week1__section" id="week-5-homework-portal">
        <h2 className="danielle-week1__heading">Homework Portal assignments</h2>
        <div className="danielle-week2__homework-list">
          <article className="danielle-week2__homework-card">
            <div className="danielle-week2__homework-card-head">
              <h3 className="danielle-week1__note-title">Right Triangles</h3>
            </div>
            <p className="danielle-week1__focus">
              Complete the right triangles question set after Lesson 1. Label the sides, name the
              triangle type, then pick the tool. Review every miss until you get 3 of that type in a
              row correct.
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
        <h2 className="danielle-week1__heading">Week 5 goals</h2>
        <ol className="danielle-week1__goals">
          {WEEK_GOALS.map((goal) => (
            <li key={goal}>{goal}</li>
          ))}
        </ol>
      </section>
    </div>
  );
}
