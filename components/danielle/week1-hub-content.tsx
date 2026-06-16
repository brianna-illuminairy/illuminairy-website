import Link from "next/link";

const WEEK_GOALS = [
  "Name the nonlinear question type (and the Math tool to use) in under 7 seconds on recognition reps.",
  "Move any quadratic to one side, set equal to zero, and start factoring without hesitating.",
  "Complete assigned Homework Portal practice by Sunday, June 15.",
  "Lesson 2: leave with clearer shared-expression factoring and smoother AC-method reps."
] as const;

export function DanielleWeek1HubContent() {
  return (
    <div className="danielle-week1">
      <div className="danielle-portal__page-head">
        <p className="danielle-portal__eyebrow">Illuminairy · Week 1</p>
        <h1>Lesson schedule</h1>
        <p className="danielle-portal__lede">
          Lesson 1 (Tuesday, June 9) is complete. Lesson 2 (Thursday, June 11) focuses on factoring
          depth with a live whiteboard session.
        </p>
      </div>

      <section className="danielle-week1__section">
        <h2 className="danielle-week1__heading">Week 1 progress report</h2>
        <Link href="/danielle/week-1/report" className="danielle-portal__link-card">
          <h2>Week 1 report · Jun 9 to 16</h2>
          <p>Practice stats, score trajectory, session summary, and what is next.</p>
        </Link>
      </section>

      <section className="danielle-week1__section">
        <h2 className="danielle-week1__heading">Week 1 lessons</h2>
        <div className="danielle-week1__lesson-links">
          <Link href="/danielle/week-1/lesson-1" className="danielle-portal__link-card">
            <h2>Lesson 1 · Tue Jun 9</h2>
            <p>Session summary, what we covered, and review slides from Math session 1.</p>
          </Link>
          <Link href="/danielle/week-1/lesson-2" className="danielle-portal__link-card">
            <h2>Lesson 2 · Thu Jun 11</h2>
            <p>Factoring quadratics depth deck and Thursday whiteboard session plan.</p>
          </Link>
        </div>
      </section>

      <section className="danielle-week1__section">
        <h2 className="danielle-week1__heading">Week 1 goals</h2>
        <ol className="danielle-week1__goals">
          {WEEK_GOALS.map((goal) => (
            <li key={goal}>{goal}</li>
          ))}
        </ol>
      </section>

      <section className="danielle-week1__section">
        <h2 className="danielle-week1__heading">Daily practice this week</h2>
        <p className="danielle-week1__focus">About 20 questions a day on non-lesson days.</p>
        <ul className="danielle-week1__practice-list">
          <li>
            <strong>Wed Jun 10:</strong> Homework Portal practice (quadratics and factoring) plus
            Math recognition flashcards
          </li>
          <li>
            <strong>Thu Jun 11:</strong> Lesson 2 day — focus on session; keep chipping away at
            homework when you have time
          </li>
          <li>
            <strong>Fri Jun 12:</strong> Homework Portal practice (quadratics and factoring) plus a
            few nonlinear equation reps
          </li>
          <li>
            <strong>Sat Jun 13:</strong> Homework Portal practice plus Math recognition flashcards
          </li>
          <li>
            <strong>Sun Jun 15:</strong> Finish quadratics homework in the Homework Portal (due date)
          </li>
        </ul>
      </section>
    </div>
  );
}
