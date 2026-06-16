import Link from "next/link";
import { WEEK2_POST_SESSION_EXERCISES } from "@/lib/danielle-week2-exercises";

export function Week2ExerciseList({ showDue = true }: { showDue?: boolean }) {
  return (
    <div className="danielle-week2__exercise-list">
      {WEEK2_POST_SESSION_EXERCISES.map((exercise) => (
        <article key={exercise.id} className="danielle-week2__exercise-card">
          <p className="danielle-week1__note-label">Post-session exercise</p>
          <h3 className="danielle-week1__note-title">{exercise.title}</h3>
          {showDue && (
            <p className="danielle-week2__exercise-due">
              <strong>Due {exercise.dueLabel}.</strong> Goal: {exercise.goal}
            </p>
          )}
          <p className="danielle-week1__focus">{exercise.summary}</p>
          <ul className="danielle-week1__practice-list">
            {exercise.instructions.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
          <p className="danielle-week1__habit">
            <Link href={exercise.href} className="danielle-portal__pdf-open">
              Open exercise
            </Link>
          </p>
        </article>
      ))}
    </div>
  );
}
