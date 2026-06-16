import Link from "next/link";

const WEEK_GOALS = [
  "Name the relationship between two sentences before looking at answer choices.",
  "Sort common transition words into contrast, cause, addition, and example buckets without hesitating.",
  "Revisit the three transitions questions you missed on the diagnostic with the new method.",
  "Complete assigned Transitions practice in the Homework Portal by Sunday."
] as const;

export function DanielleWeek2HubContent() {
  return (
    <div className="danielle-week1">
      <div className="danielle-portal__page-head">
        <p className="danielle-portal__eyebrow">Illuminairy · Week 2</p>
        <h1>Lesson schedule</h1>
        <p className="danielle-portal__lede">
          Week 2 focuses on Transitions in Reading and Writing. Lesson 1 (Tuesday, June 16) is an
          interactive session built around games and your diagnostic misses.
        </p>
      </div>

      <section className="danielle-week1__section">
        <h2 className="danielle-week1__heading">Week 2 lessons</h2>
        <div className="danielle-week1__lesson-links">
          <Link href="/danielle/week-2/lesson-1" className="danielle-portal__link-card">
            <h2>Lesson 1 · Tue Jun 16</h2>
            <p>Transitions: method, sorting game, cheat sheet matching, and diagnostic revisits.</p>
          </Link>
        </div>
      </section>

      <section className="danielle-week1__section">
        <h2 className="danielle-week1__heading">Week 1 progress report</h2>
        <p className="danielle-week1__focus">
          Your Week 1 summary (June 9 to 16) is on the portal, including practice stats and the score
          trajectory chart.
        </p>
        <Link href="/danielle/week-1/report" className="danielle-portal__link-card">
          <h2>Week 1 report · Jun 9 to 16</h2>
          <p>89% practice accuracy, on track for 1400, and what we covered in math week one.</p>
        </Link>
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
