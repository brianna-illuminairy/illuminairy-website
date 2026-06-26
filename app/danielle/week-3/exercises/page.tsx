import Link from "next/link";
import { Week3ExerciseList } from "@/components/danielle/week3-exercise-list";
import { Week3PostSessionResources } from "@/components/danielle/week3-post-session-resources";
import { DanielleNotConfigured } from "@/components/danielle/not-configured";
import { DaniellePortalShell } from "@/components/danielle/portal-shell";
import { requireDanielleAuth } from "@/lib/danielle-guard";
import { isDanielleConfigured } from "@/lib/danielle-auth";
import { POST_SESSION_3_LESSON2_HOMEWORK, WEEK3_HOMEWORK_PORTAL_SETS } from "@/lib/danielle-post-session-3-notes";
import { homeworkPortalLoginUrl } from "@/lib/internal-links";

export default async function DanielleWeek3ExercisesPage() {
  if (!isDanielleConfigured()) {
    return <DanielleNotConfigured />;
  }

  await requireDanielleAuth("/danielle/week-3/exercises");

  return (
    <DaniellePortalShell>
      <div className="danielle-week1">
        <div className="danielle-portal__page-head">
          <p className="danielle-portal__eyebrow">Illuminairy · Week 3</p>
          <h1>Post-session exercises</h1>
          <p className="danielle-portal__lede">
            Pattern sort, FOIL builder, and missing-value drills. Complete the practice hub before
            Equivalent Expressions 3 and the quiz in the Homework Portal.
          </p>
        </div>

        <section className="danielle-week1__section">
          <Week3PostSessionResources />
        </section>

        <section className="danielle-week1__section">
          <h2 className="danielle-week1__heading">Practice hub</h2>
          <Week3ExerciseList />
        </section>

        <section className="danielle-week1__section">
          <h2 className="danielle-week1__heading">{POST_SESSION_3_LESSON2_HOMEWORK.headline}</h2>
          <p className="danielle-week1__focus">{POST_SESSION_3_LESSON2_HOMEWORK.body}</p>
          <div className="danielle-week2__homework-list">
            {WEEK3_HOMEWORK_PORTAL_SETS.map((set) => (
              <article key={set.id} className="danielle-week2__homework-card">
                <h3 className="danielle-week1__note-title">{set.title}</h3>
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

        <p className="danielle-week1__habit">
          <Link href="/danielle/week-3/lesson-2#post-session-resources" className="danielle-week1__inline-link">
            Lesson 2 post-session summary
          </Link>
        </p>
      </div>
    </DaniellePortalShell>
  );
}
