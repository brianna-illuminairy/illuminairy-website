import { cookies } from "next/headers";
import { readQuizSnapshotFromRequestCookies } from "@/lib/quiz-funnel/quiz-cookie";
import { QuizClientRoot } from "./QuizClientRoot";

export default async function QuizPage() {
  // Cookie snapshot is fallback-only: localStorage/session + server visitors are primary.
  const cookieStore = await cookies();
  const initialSnapshot = readQuizSnapshotFromRequestCookies(cookieStore);
  return (
    <div className="qf-funnel-stage">
      <QuizClientRoot initialSnapshot={initialSnapshot} />
    </div>
  );
}
