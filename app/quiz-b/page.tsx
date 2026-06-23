import { cookies } from "next/headers";
import { readQuizSnapshotFromRequestCookies } from "@/lib/quiz-funnel-b/quiz-cookie";
import { QuizClientRoot } from "./QuizClientRoot";

export default async function QuizBPage() {
  const cookieStore = await cookies();
  const initialSnapshot = readQuizSnapshotFromRequestCookies(cookieStore);
  return (
    <div className="qf-funnel-stage">
      <QuizClientRoot initialSnapshot={initialSnapshot} />
    </div>
  );
}
