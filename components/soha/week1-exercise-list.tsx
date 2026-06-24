import Link from "next/link";
import { WEEK1_POST_SESSION_EXERCISES } from "@/lib/soha-week1-exercises";

export function Week1ExerciseList({ showDue = true }: { showDue?: boolean }) {
  return (
    <div className="soha-week1__exercise-list">
      {WEEK1_POST_SESSION_EXERCISES.map((exercise) => (
        <article key={exercise.id} className="soha-week1__exercise-card">
          <p className="soha-week1__note-label">Post-session exercise</p>
          <h3 className="soha-week1__note-title">{exercise.title}</h3>
          {showDue && (
            <p className="soha-week1__exercise-due">
              <strong>Due {exercise.dueLabel}.</strong> Goal: {exercise.goal}
            </p>
          )}
          <p className="soha-week1__focus">{exercise.summary}</p>
          <ul className="soha-week1__practice-list">
            {exercise.instructions.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
          <p className="soha-week1__habit">
            <Link href={exercise.href} className="aurora-btn-primary">
              Open exercise
            </Link>
          </p>
        </article>
      ))}
    </div>
  );
}
