import { cookies } from "next/headers";
import { readQuizSnapshotFromRequestCookies } from "@/lib/quiz-funnel-b/quiz-cookie";
import { isPlanBEntrySearchStep, PlanBEntryShell } from "./PlanBEntryShell";
import { QuizClientRoot } from "./QuizClientRoot";

type QuizBPageProps = {
  searchParams: Promise<{ step?: string }>;
};

export default async function QuizBPage({ searchParams }: QuizBPageProps) {
  const cookieStore = await cookies();
  const initialSnapshot = readQuizSnapshotFromRequestCookies(cookieStore);
  const { step } = await searchParams;
  const showEntryShell = isPlanBEntrySearchStep(step);

  return (
    <div className="qf-funnel-stage">
      {showEntryShell ? <PlanBEntryShell /> : null}
      <QuizClientRoot initialSnapshot={initialSnapshot} dismissEntryShell={showEntryShell} />
    </div>
  );
}
