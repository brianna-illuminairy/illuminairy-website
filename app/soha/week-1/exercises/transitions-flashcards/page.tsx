import Link from "next/link";
import { TransitionsFlashcardDeck } from "@/components/danielle/transitions-flashcard-deck";
import { SohaNotConfigured } from "@/components/soha/not-configured";
import { SohaPortalShell } from "@/components/soha/portal-shell";
import { isSohaConfigured } from "@/lib/soha-auth";
import { TRANSITION_FLASHCARDS } from "@/lib/danielle-transitions-flashcards";
import { getWeek1Exercise } from "@/lib/soha-week1-exercises";
import { requireSohaAuth } from "@/lib/soha-guard";

const EXERCISE = getWeek1Exercise("transitions-flashcards");
const SOHA_FLASHCARD_STORAGE_KEY = "soha-transitions-flashcard-stats-v1";

export default async function SohaWeek1TransitionsFlashcardsPage() {
  if (!isSohaConfigured()) {
    return <SohaNotConfigured />;
  }

  await requireSohaAuth("/soha/week-1/exercises/transitions-flashcards");

  return (
    <SohaPortalShell>
      <div className="soha-week1 aurora-portal__content">
        <div className="soha-week1__page-head">
          <p className="aurora-eyebrow">Illuminairy · Week 1 · Exercise</p>
          <h1 className="soha-week1__title">{EXERCISE?.title ?? "Transitions category flashcards"}</h1>
          <p className="soha-week1__lede">
            {TRANSITION_FLASHCARDS.length} SAT transition phrases. Pick the category for each card. Use{" "}
            <strong>Explain</strong> or <strong>Show me an example</strong> when you need a hint. Goal:{" "}
            {EXERCISE?.goal ?? "3 rounds in a row at 95%+"}.
          </p>
          {EXERCISE && (
            <p className="soha-week1__exercise-due-inline">
              <strong>Due {EXERCISE.dueLabel}.</strong>{" "}
              <Link href="/soha/week-1/lesson-1#homework" className="soha-week1__inline-link">
                Back to Lesson 1 homework
              </Link>
            </p>
          )}
        </div>

        <section className="soha-week1__section">
          <TransitionsFlashcardDeck
            storageKey={SOHA_FLASHCARD_STORAGE_KEY}
            goalMode="consecutive"
            consecutiveRounds={3}
          />
        </section>
      </div>
    </SohaPortalShell>
  );
}
