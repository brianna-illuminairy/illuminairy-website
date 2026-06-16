import Link from "next/link";
import { Week2ExerciseList } from "@/components/danielle/week2-exercise-list";
import { Week2HomeworkPortalList } from "@/components/danielle/week2-homework-portal-list";
import { Week2HomeworkWorkflow } from "@/components/danielle/week2-homework-workflow";
import { DanielleNotConfigured } from "@/components/danielle/not-configured";
import { DaniellePortalShell } from "@/components/danielle/portal-shell";
import { requireDanielleAuth } from "@/lib/danielle-guard";
import { isDanielleConfigured } from "@/lib/danielle-auth";
import { POST_SESSION_2_HOMEWORK } from "@/lib/danielle-post-session-2-notes";

export default async function DanielleWeek2ExercisesPage() {
  if (!isDanielleConfigured()) {
    return <DanielleNotConfigured />;
  }

  await requireDanielleAuth("/danielle/week-2/exercises");

  return (
    <DaniellePortalShell>
      <div className="danielle-week1">
        <div className="danielle-portal__page-head">
          <p className="danielle-portal__eyebrow">Illuminairy · Week 2</p>
          <h1>Post-session exercises</h1>
          <p className="danielle-portal__lede">
            Step 3 in your homework path: flashcard rounds until 95% accuracy. Complete steps 1–3
            before Transitions 1 (due June 17).
          </p>
        </div>

        <section className="danielle-week1__section">
          <h2 className="danielle-week1__heading">Full homework order</h2>
          <Week2HomeworkWorkflow />
        </section>

        <section className="danielle-week1__section">
          <h2 className="danielle-week1__heading">Flashcard deck</h2>
          <Week2ExerciseList />
        </section>

        <section className="danielle-week1__section">
          <h2 className="danielle-week1__heading">{POST_SESSION_2_HOMEWORK.headline}</h2>
          <Week2HomeworkPortalList />
        </section>

        <p className="danielle-week1__habit">
          <Link href="/danielle/week-2/lesson-1#post-session-exercise" className="danielle-week1__inline-link">
            Lesson 1 post-session summary
          </Link>
        </p>
      </div>
    </DaniellePortalShell>
  );
}
