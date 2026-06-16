import Link from "next/link";
import { TransitionsCheatSheet } from "@/components/danielle/transitions-cheat-sheet";
import { DanielleNotConfigured } from "@/components/danielle/not-configured";
import { DaniellePortalShell } from "@/components/danielle/portal-shell";
import { requireDanielleAuth } from "@/lib/danielle-guard";
import { isDanielleConfigured } from "@/lib/danielle-auth";
import { TRANSITION_COMMON_PHRASE_COUNT } from "@/lib/danielle-transitions-cheat-sheet";

export default async function DanielleWeek2CheatSheetPage() {
  if (!isDanielleConfigured()) {
    return <DanielleNotConfigured />;
  }

  await requireDanielleAuth("/danielle/week-2/cheat-sheet");

  return (
    <DaniellePortalShell>
      <div className="danielle-week1">
        <div className="danielle-portal__page-head">
          <p className="danielle-portal__eyebrow">Illuminairy · Week 2 · Quick reference</p>
          <h1>Transitions cheat sheet</h1>
          <p className="danielle-portal__lede">
            {TRANSITION_COMMON_PHRASE_COUNT} most common Digital SAT transition words in four
            categories. Memorize these before the flashcard deck.
          </p>
          <p className="danielle-portal__lede danielle-week2__exercise-due-inline">
            <Link href="/danielle/week-2/lesson-1#homework-workflow" className="danielle-week1__inline-link">
              Homework workflow
            </Link>
            {" · "}
            <Link href="/danielle/week-2/exercises/transitions-flashcards" className="danielle-week1__inline-link">
              Flashcard deck
            </Link>
          </p>
        </div>

        <section className="danielle-week1__section">
          <TransitionsCheatSheet />
        </section>
      </div>
    </DaniellePortalShell>
  );
}
