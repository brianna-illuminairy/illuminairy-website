import Link from "next/link";
import { Week2ExerciseList } from "@/components/danielle/week2-exercise-list";
import { Week2HomeworkPortalList } from "@/components/danielle/week2-homework-portal-list";
import { Week2HomeworkWorkflow } from "@/components/danielle/week2-homework-workflow";
import { POST_SESSION_2_HOMEWORK } from "@/lib/danielle-post-session-2-notes";

const WEEK_GOALS = [
  "Review the Transitions slide deck in more depth after session.",
  "Memorize the four categories and the cheat sheet word list.",
  "Hit 95% on the category flashcard deck before starting Homework Portal sets.",
  "Complete Transitions 1 in the Homework Portal by Wednesday, June 17.",
  "Complete Transitions 2 by Friday, June 27.",
  "Complete Transitions 3 · Untimed (16 hard), then Transitions 3 · Timed (30 hard, due June 28)."
] as const;

export function DanielleWeek2HubContent() {
  return (
    <div className="danielle-week1">
      <div className="danielle-portal__page-head">
        <p className="danielle-portal__eyebrow">Illuminairy · Week 2</p>
        <h1>Lesson schedule</h1>
        <p className="danielle-portal__lede">
          Week 2 focuses on Transitions. Lesson 1 (Tuesday, June 16) is complete. Homework:
          slide deck review → flashcards at 95% → Transitions 1 → Transitions 2 → Transitions 3 untimed →
          Transitions 3 timed (30 hard, due June 28).
        </p>
      </div>

      <section className="danielle-week1__section" id="week-2-homework-workflow">
        <h2 className="danielle-week1__heading">Homework order</h2>
        <Week2HomeworkWorkflow />
      </section>

      <section className="danielle-week1__section" id="week-2-exercises">
        <h2 className="danielle-week1__heading">Post-session exercise · flashcards</h2>
        <p className="danielle-week1__focus">
          Step 3 in the homework path. Tracks rounds and accuracy per round until you hit 95%.
        </p>
        <Week2ExerciseList />
        <p className="danielle-week1__habit">
          <Link href="/danielle/week-2/exercises" className="danielle-week1__inline-link">
            Open exercises hub
          </Link>
        </p>
      </section>

      <section className="danielle-week1__section" id="week-2-homework-portal">
        <h2 className="danielle-week1__heading">{POST_SESSION_2_HOMEWORK.headline}</h2>
        <p className="danielle-week1__focus">{POST_SESSION_2_HOMEWORK.body}</p>
        <Week2HomeworkPortalList />
      </section>

      <section className="danielle-week1__section">
        <h2 className="danielle-week1__heading">Week 2 progress report</h2>
        <p className="danielle-week1__focus">
          Your Week 2 summary (June 16 to 23) is on the portal, including Transitions homework scores,
          Equivalent Expressions error patterns, and the plan for advanced algebra.
        </p>
        <Link href="/danielle/week-2/report" className="danielle-portal__link-card">
          <h2>Week 2 report · Jun 16 to 23</h2>
          <p>91% practice accuracy, Transitions 1 at 96%, and what we are covering in Math this week.</p>
        </Link>
      </section>

      <section className="danielle-week1__section">
        <h2 className="danielle-week1__heading">Week 2 lessons</h2>
        <div className="danielle-week1__lesson-links">
          <Link href="/danielle/week-2/lesson-1" className="danielle-portal__link-card">
            <h2>Lesson 1 · Tue Jun 16</h2>
            <p>Session summary, homework steps, and interactive Transitions lesson replay.</p>
          </Link>
          <Link href="/danielle/week-2/lesson-2" className="danielle-portal__link-card">
            <h2>Lesson 2 · Thu Jun 18</h2>
            <p>
              Medium transitions deck plus Homework Portal · Transitions 3 · Timed: 30 hard questions, due
              June 28.
            </p>
          </Link>
        </div>
      </section>

      <section className="danielle-week1__section">
        <h2 className="danielle-week1__heading">Week 2 goals</h2>
        <ol className="danielle-week1__goals">
          {WEEK_GOALS.map((goal) => (
            <li key={goal}>{goal}</li>
          ))}
        </ol>
      </section>
    </div>
  );
}
