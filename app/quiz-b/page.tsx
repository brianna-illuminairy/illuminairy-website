import { cookies } from "next/headers";
import { FunnelPageStage } from "@/components/funnel-sibling/FunnelPageStage";
import { FunnelWhoEntryShell } from "@/components/funnel-sibling/FunnelWhoEntryShell";
import { FUNNEL_ENTRY_SHELL_IDS } from "@/lib/funnel-sibling/entry-ids";
import { isPlanBEntryStep } from "@/lib/funnel-sibling/entry-step";
import { readQuizSnapshotFromRequestCookies } from "@/lib/quiz-funnel-b/quiz-cookie";
import { BASE_LAB_ROUTE_STEPS } from "@/lib/quiz-funnel-b/quiz-route";
import { QuizClientRoot } from "./QuizClientRoot";

const ENTRY_FILL_PCT = Math.round((1 / BASE_LAB_ROUTE_STEPS.length) * 100);

type QuizBPageProps = {
  searchParams: Promise<{ step?: string }>;
};

export default async function QuizBPage({ searchParams }: QuizBPageProps) {
  const cookieStore = await cookies();
  const initialSnapshot = readQuizSnapshotFromRequestCookies(cookieStore);
  const { step } = await searchParams;
  const showEntryShell = isPlanBEntryStep(step);

  return (
    <FunnelPageStage
      entryShell={
        showEntryShell ? (
          <FunnelWhoEntryShell id={FUNNEL_ENTRY_SHELL_IDS.planB} progressPct={ENTRY_FILL_PCT} />
        ) : null
      }
    >
      <QuizClientRoot
        initialSnapshot={initialSnapshot}
        entryShellId={showEntryShell ? FUNNEL_ENTRY_SHELL_IDS.planB : undefined}
      />
    </FunnelPageStage>
  );
}
