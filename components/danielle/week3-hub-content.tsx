import Link from "next/link";
import { Week3HomeworkWorkflow } from "@/components/danielle/week3-homework-workflow";
import { Week3ExerciseList } from "@/components/danielle/week3-exercise-list";
import { homeworkPortalLoginUrl } from "@/lib/internal-links";
import { WEEK3_FORMULA_SHEET_HREF } from "@/lib/danielle-equivalent-expressions-formula-sheet";
import {
  POST_SESSION_3_LESSON2_HOMEWORK,
  WEEK3_EE_MISS_LESSON1,
  WEEK3_EE_MISS_LESSON2,
  WEEK3_EE_MISS_TOTAL,
  WEEK3_HOMEWORK_PORTAL_SETS
} from "@/lib/danielle-post-session-3-notes";

const WEEK_GOALS = [
  `Finish reviewing all ${WEEK3_EE_MISS_TOTAL} incorrect or skipped equivalent expressions homework problems (${WEEK3_EE_MISS_LESSON1} done in Lesson 1, ${WEEK3_EE_MISS_LESSON2} in Lesson 2).`,
  "Review the formula sheet and patterns deck after Lesson 2.",
  "Pass all four sections in the practice hub (pattern, FOIL, combine & simplify, missing values).",
  "Complete Equivalent Expressions 3 in the Homework Portal (untimed, 100% accuracy).",
  "Review every miss from set 3: read the solution, use the Homework Portal chatbot for more of that type, and get 3 in a row correct.",
  "Be ready for the Equivalent Expressions Quiz at the start of Week 4."
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

      <section className="danielle-week1__section" id="week-3-post-session-resources">
        <h2 className="danielle-week1__heading">Post-session resources</h2>
        <p className="danielle-week1__focus">
          Formula sheet, whiteboard notes, and the patterns deck for review after class.
        </p>
        <Link href={WEEK3_FORMULA_SHEET_HREF} className="danielle-portal__link-card">
          <h2>Equivalent expressions formula sheet</h2>
          <p>
            Perfect squares, difference of squares, and FOIL matching (factored = expanded).
          </p>
        </Link>
        <Link href="/danielle/week-3/exercises/equivalent-expressions" className="danielle-portal__link-card">
          <h2>Equivalent expressions practice hub</h2>
          <p>Pattern sort, FOIL builder, combine & simplify, and missing values. Pass all four before set 3.</p>
        </Link>
      </section>

      <section className="danielle-week1__section" id="week-3-homework-workflow">
        <h2 className="danielle-week1__heading">{POST_SESSION_3_LESSON2_HOMEWORK.headline}</h2>
        <p className="danielle-week1__focus">{POST_SESSION_3_LESSON2_HOMEWORK.body}</p>
        <Week3HomeworkWorkflow />
      </section>

      <section className="danielle-week1__section" id="week-3-exercises">
        <h2 className="danielle-week1__heading">Post-session exercise</h2>
        <Week3ExerciseList />
      </section>

      <section className="danielle-week1__section" id="week-3-homework-portal">
        <h2 className="danielle-week1__heading">Homework Portal assignments</h2>
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
        <h2 className="danielle-week1__heading">Week 3 progress report</h2>
        <p className="danielle-week1__focus">
          Your Week 3 summary (June 23 to 30) is on the portal, including equivalent expressions
          sessions, hard transitions and math homework, and the plan for next week.
        </p>
        <Link href="/danielle/week-3/report" className="danielle-portal__link-card">
          <h2>Week 3 report · Jun 23 to 30</h2>
          <p>1220 estimated score (+10 this week), 119 practice problems, and command of evidence up next.</p>
        </Link>
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
              post-session homework (formula sheet, practice hub, Equivalent Expressions 3).
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
