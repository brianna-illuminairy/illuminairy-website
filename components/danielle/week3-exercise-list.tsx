import Link from "next/link";
import { WEEK3_POST_SESSION_EXERCISES } from "@/lib/danielle-week3-exercises";

export function Week3ExerciseList({ showGoal = true }: { showGoal?: boolean }) {
  return (
    <div className="danielle-week2__exercise-list">
      {WEEK3_POST_SESSION_EXERCISES.map((exercise) => (
        <article key={exercise.id} className="danielle-week2__exercise-card">
          <p className="danielle-week1__note-label">Post-session exercise</p>
          <h3 className="danielle-week1__note-title">{exercise.title}</h3>
          {showGoal && (
            <p className="danielle-week2__exercise-due">
              <strong>Goal:</strong> {exercise.goal}
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
