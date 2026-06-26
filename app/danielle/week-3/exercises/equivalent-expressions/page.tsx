import Link from "next/link";
import { EeExerciseHub } from "@/components/danielle/ee-exercise-hub";
import { DanielleNotConfigured } from "@/components/danielle/not-configured";
import { DaniellePortalShell } from "@/components/danielle/portal-shell";
import { requireDanielleAuth } from "@/lib/danielle-guard";
import { isDanielleConfigured } from "@/lib/danielle-auth";
import { getWeek3Exercise } from "@/lib/danielle-week3-exercises";

const EXERCISE = getWeek3Exercise("equivalent-expressions-practice");

export default async function DanielleWeek3EeExercisePage() {
  if (!isDanielleConfigured()) {
    return <DanielleNotConfigured />;
  }

  await requireDanielleAuth("/danielle/week-3/exercises/equivalent-expressions");

  return (
    <DaniellePortalShell>
      <div className="danielle-week1">
        <div className="danielle-portal__page-head">
          <p className="danielle-portal__eyebrow">Illuminairy · Week 3 · Post-session exercise</p>
          <h1>{EXERCISE?.title ?? "Equivalent expressions practice hub"}</h1>
          <p className="danielle-portal__lede">
            Step 3 in the post-session workflow. Pass all four sections, then open Equivalent
            Expressions 3 (untimed, 100% accuracy).
          </p>
          <p className="danielle-portal__lede danielle-week2__exercise-due-inline">
            <Link href="/danielle/week-3/formula-sheet" className="danielle-week1__inline-link">
              Formula sheet
            </Link>
            {" · "}
            <Link href="/danielle/week-3/exercises" className="danielle-week1__inline-link">
              Exercises hub
            </Link>
            {" · "}
            <Link href="/danielle/week-3/lesson-2#post-session-resources" className="danielle-week1__inline-link">
              Lesson 2 summary
            </Link>
          </p>
        </div>

        <section className="danielle-week1__section">
          <EeExerciseHub />
        </section>
      </div>
    </DaniellePortalShell>
  );
}
