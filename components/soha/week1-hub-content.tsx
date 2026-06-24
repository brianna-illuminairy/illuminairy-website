import Link from "next/link";
import { Week1ExerciseList } from "@/components/soha/week1-exercise-list";

export function SohaWeek1HubContent() {
  return (
    <div className="soha-week1 aurora-portal__content">
      <div className="soha-week1__page-head">
        <p className="aurora-eyebrow">Illuminairy · Week 1</p>
        <h1 className="soha-week1__title">Transitions</h1>
        <p className="soha-week1__lede">
          Week 1 focus: transition questions across all difficulty levels. Start with Lesson 1 for the
          session summary and homework order.
        </p>
      </div>

      <section className="soha-week1__section">
        <h2 className="soha-week1__heading">This week</h2>
        <ul className="soha-week1__goals">
          <li>
            <Link href="/soha/week-1/lesson-1" className="soha-week1__inline-link">
              Lesson 1 · Transitions interactive lesson + homework
            </Link>
          </li>
          <li>
            <Link href="/soha/week-1/exercises" className="soha-week1__inline-link">
              Post-session exercises · flashcard deck
            </Link>
          </li>
        </ul>
      </section>

      <section className="soha-week1__section">
        <h2 className="soha-week1__heading">Post-session exercise</h2>
        <Week1ExerciseList />
      </section>
    </div>
  );
}
