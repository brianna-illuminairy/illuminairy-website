import Link from "next/link";
import { TransitionsFlashcardDeck } from "@/components/danielle/transitions-flashcard-deck";
import { DanielleNotConfigured } from "@/components/danielle/not-configured";
import { DaniellePortalShell } from "@/components/danielle/portal-shell";
import { requireDanielleAuth } from "@/lib/danielle-guard";
import { isDanielleConfigured } from "@/lib/danielle-auth";
import { TRANSITION_FLASHCARDS } from "@/lib/danielle-transitions-flashcards";
import { getWeek2Exercise } from "@/lib/danielle-week2-exercises";

const EXERCISE = getWeek2Exercise("transitions-flashcards");

export default async function DanielleWeek2TransitionsFlashcardsExercisePage() {
  if (!isDanielleConfigured()) {
    return <DanielleNotConfigured />;
  }

  await requireDanielleAuth("/danielle/week-2/exercises/transitions-flashcards");

  return (
    <DaniellePortalShell>
      <div className="danielle-week1">
        <div className="danielle-portal__page-head">
          <p className="danielle-portal__eyebrow">Illuminairy · Week 2 · Post-session exercise</p>
          <h1>{EXERCISE?.title ?? "Transitions category flashcards"}</h1>
          <p className="danielle-portal__lede">
            {TRANSITION_FLASHCARDS.length} SAT transition phrases. Pick the category for each card.
            Use <strong>Explain</strong> or <strong>Show me an example</strong> when you need a hint.
            Goal: {EXERCISE?.goal ?? "95% overall accuracy"}.
          </p>
          {EXERCISE && (
            <p className="danielle-portal__lede danielle-week2__exercise-due-inline">
              <strong>Due {EXERCISE.dueLabel}.</strong>{" "}
              <Link href="/danielle/week-2/lesson-1#post-session-exercise" className="danielle-week1__inline-link">
                Back to Lesson 1 summary
              </Link>
            </p>
          )}
        </div>

        <section className="danielle-week1__section">
          <TransitionsFlashcardDeck />
        </section>
      </div>
    </DaniellePortalShell>
  );
}
