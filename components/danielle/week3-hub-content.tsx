import Link from "next/link";
import { homeworkPortalLoginUrl } from "@/lib/internal-links";
import {
  POST_SESSION_3_LESSON2_HOMEWORK,
  WEEK3_EE_MISS_LESSON1,
  WEEK3_EE_MISS_LESSON2,
  WEEK3_EE_MISS_TOTAL,
  WEEK3_HOMEWORK_PORTAL_SETS
} from "@/lib/danielle-post-session-3-notes";

const WEEK_GOALS = [
  `Finish reviewing all ${WEEK3_EE_MISS_TOTAL} incorrect or skipped equivalent expressions homework problems (${WEEK3_EE_MISS_LESSON1} done in Lesson 1, ${WEEK3_EE_MISS_LESSON2} in Lesson 2).`,
  "Memorize the factoring patterns from the equivalent expressions deck (GCF, difference of squares, perfect squares, AC method).",
  "Complete Equivalent Expressions 3 in the Homework Portal.",
  "Complete the Equivalent Expressions Quiz in the Homework Portal after set 3."
] as const;

export function DanielleWeek3HubContent() {
  return (
    <div className="danielle-week1">
      <div className="danielle-portal__page-head">
        <p className="danielle-portal__eyebrow">Illuminairy · Week 3</p>
        <h1>Lesson schedule</h1>
        <p className="danielle-portal__lede">
          Week 3 focuses on equivalent expressions. Lesson 1 (Tuesday, June 23) reviewed{" "}
          {WEEK3_EE_MISS_LESSON1} of {WEEK3_EE_MISS_TOTAL} homework misses. Lesson 2 (Thursday,
          June 26) finishes the remaining {WEEK3_EE_MISS_LESSON2}, runs the patterns deck, and
          assigns Homework Portal practice.
        </p>
      </div>

      <section className="danielle-week1__section" id="week-3-homework-portal">
        <h2 className="danielle-week1__heading">{POST_SESSION_3_LESSON2_HOMEWORK.headline}</h2>
        <p className="danielle-week1__focus">{POST_SESSION_3_LESSON2_HOMEWORK.body}</p>
        <div className="danielle-week2__homework-list">
          {WEEK3_HOMEWORK_PORTAL_SETS.map((set) => (
            <article key={set.id} className="danielle-week2__homework-card">
              <div className="danielle-week2__homework-card-head">
                <h3 className="danielle-week1__note-title">{set.title}</h3>
              </div>
              <p className="danielle-week1__focus">{set.note}</p>
            </article>
          ))}
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
        <h2 className="danielle-week1__heading">Week 3 lessons</h2>
        <div className="danielle-week1__lesson-links">
          <Link href="/danielle/week-3/lesson-1" className="danielle-portal__link-card">
            <h2>Lesson 1 · Tue Jun 23</h2>
            <p>
              Homework review part 1: {WEEK3_EE_MISS_LESSON1} of {WEEK3_EE_MISS_TOTAL} incorrect or
              skipped EE problems, plus 8 independent medium reps.
            </p>
          </Link>
          <Link href="/danielle/week-3/lesson-2" className="danielle-portal__link-card">
            <h2>Lesson 2 · Thu Jun 26</h2>
            <p>
              Homework review part 2: remaining {WEEK3_EE_MISS_LESSON2} misses, patterns deck, plus
              Equivalent Expressions 3 and the quiz in the Homework Portal.
            </p>
          </Link>
        </div>
      </section>

      <section className="danielle-week1__section">
        <h2 className="danielle-week1__heading">Week 3 goals</h2>
        <ol className="danielle-week1__goals">
          {WEEK_GOALS.map((goal) => (
            <li key={goal}>{goal}</li>
          ))}
        </ol>
      </section>
    </div>
  );
}
