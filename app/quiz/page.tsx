import { cookies } from "next/headers";
import { FunnelPageStage } from "@/components/funnel-sibling/FunnelPageStage";
import { FunnelWhoEntryShell } from "@/components/funnel-sibling/FunnelWhoEntryShell";
import { FUNNEL_ENTRY_SHELL_IDS } from "@/lib/funnel-sibling/entry-ids";
import { isPlanAEntryStep } from "@/lib/funnel-sibling/entry-step";
import { readQuizSnapshotFromRequestCookies } from "@/lib/quiz-funnel/quiz-cookie";
import { BASE_QUIZ_ROUTE_STEPS } from "@/lib/quiz-funnel/quiz-route";
import { QuizClientRoot } from "./QuizClientRoot";

const ENTRY_FILL_PCT = Math.round((1 / BASE_QUIZ_ROUTE_STEPS.length) * 100);

type QuizPageProps = {
  searchParams: Promise<{ step?: string }>;
};

export default async function QuizPage({ searchParams }: QuizPageProps) {
  const cookieStore = await cookies();
  const initialSnapshot = readQuizSnapshotFromRequestCookies(cookieStore);
  const { step } = await searchParams;
  const showEntryShell = isPlanAEntryStep(step);

  return (
    <FunnelPageStage
      entryShell={
        showEntryShell ? (
          <FunnelWhoEntryShell id={FUNNEL_ENTRY_SHELL_IDS.planA} progressPct={ENTRY_FILL_PCT} />
        ) : null
      }
    >
      <QuizClientRoot
        initialSnapshot={initialSnapshot}
        entryShellId={showEntryShell ? FUNNEL_ENTRY_SHELL_IDS.planA : undefined}
      />
    </FunnelPageStage>
  );
}
