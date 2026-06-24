import { cookies } from "next/headers";
import { readQuizSnapshotFromRequestCookies } from "@/lib/quiz-funnel/quiz-cookie";
import { isPlanAEntrySearchStep, PlanAEntryShell } from "./PlanAEntryShell";
import { QuizClientRoot } from "./QuizClientRoot";

type QuizPageProps = {
  searchParams: Promise<{ step?: string }>;
};

export default async function QuizPage({ searchParams }: QuizPageProps) {
  const cookieStore = await cookies();
  const initialSnapshot = readQuizSnapshotFromRequestCookies(cookieStore);
  const { step } = await searchParams;
  const showEntryShell = isPlanAEntrySearchStep(step);

  return (
    <div className="qf-funnel-stage">
      {showEntryShell ? <PlanAEntryShell /> : null}
      <QuizClientRoot initialSnapshot={initialSnapshot} dismissEntryShell={showEntryShell} />
    </div>
  );
}
