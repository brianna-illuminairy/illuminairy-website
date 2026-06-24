import Link from "next/link";
import { SohaMistakeLogSetup } from "@/components/soha/soha-mistake-log-setup";
import { Week1ExerciseList } from "@/components/soha/week1-exercise-list";
import { Week1HomeworkPortalList } from "@/components/soha/week1-homework-portal-list";
import { Week1HomeworkWorkflow } from "@/components/soha/week1-homework-workflow";
import { SohaNotConfigured } from "@/components/soha/not-configured";
import { SohaPortalShell } from "@/components/soha/portal-shell";
import { isSohaConfigured } from "@/lib/soha-auth";
import { WEEK1_HOMEWORK_INTRO } from "@/lib/soha-post-session-1-notes";
import { requireSohaAuth } from "@/lib/soha-guard";

export default async function SohaWeek1ExercisesPage() {
  if (!isSohaConfigured()) {
    return <SohaNotConfigured />;
  }

  await requireSohaAuth("/soha/week-1/exercises");

  return (
    <SohaPortalShell>
      <div className="soha-week1 aurora-portal__content">
        <div className="soha-week1__page-head">
          <p className="aurora-eyebrow">Illuminairy · Week 1</p>
          <h1 className="soha-week1__title">Week 1 exercises</h1>
          <p className="soha-week1__lede">
            Complete after your Lesson 1 session. Step 2 here: flashcard rounds until three in a
            row hit 95%+. Finish steps 1–2 before Transitions 1 in the Homework Portal.
          </p>
        </div>

        <section className="soha-week1__section">
          <h2 className="soha-week1__heading">Full homework order</h2>
          <Week1HomeworkWorkflow />
        </section>

        <section className="soha-week1__section">
          <h2 className="soha-week1__heading">Mistake log setup</h2>
          <SohaMistakeLogSetup />
        </section>

        <section className="soha-week1__section">
          <h2 className="soha-week1__heading">Flashcard deck</h2>
          <Week1ExerciseList />
        </section>

        <section className="soha-week1__section">
          <h2 className="soha-week1__heading">{WEEK1_HOMEWORK_INTRO.headline}</h2>
          <Week1HomeworkPortalList />
        </section>

        <p className="soha-week1__habit">
          <Link href="/soha/week-1/lesson-1#homework" className="soha-week1__inline-link">
            Lesson 1 homework
          </Link>
        </p>
      </div>
    </SohaPortalShell>
  );
}
