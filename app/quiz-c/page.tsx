import { FunnelPageStage } from "@/components/funnel-sibling/FunnelPageStage";
import { ScoreReviewEntryShell } from "@/components/funnel-sibling/ScoreReviewEntryShell";
import { FUNNEL_ENTRY_SHELL_IDS } from "@/lib/funnel-sibling/entry-ids";
import { isScoreReviewEntryStep } from "@/lib/funnel-sibling/entry-step";
import { BASE_SCORE_REVIEW_STEPS } from "@/lib/score-review-funnel/quiz-route";
import { QuizClientRoot } from "./QuizClientRoot";

const ENTRY_FILL_PCT = Math.round((1 / BASE_SCORE_REVIEW_STEPS.length) * 100);

type ScoreReviewQuizPageProps = {
  searchParams: Promise<{ step?: string }>;
};

export default async function ScoreReviewQuizPage({ searchParams }: ScoreReviewQuizPageProps) {
  const { step } = await searchParams;
  const showEntryShell = isScoreReviewEntryStep(step);

  return (
    <FunnelPageStage
      entryShell={
        showEntryShell ? (
          <ScoreReviewEntryShell
            id={FUNNEL_ENTRY_SHELL_IDS.scoreReview}
            progressPct={ENTRY_FILL_PCT}
          />
        ) : null
      }
    >
      <QuizClientRoot
        entryShellId={showEntryShell ? FUNNEL_ENTRY_SHELL_IDS.scoreReview : undefined}
      />
    </FunnelPageStage>
  );
}
