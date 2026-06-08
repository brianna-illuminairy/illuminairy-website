import { Suspense } from "react";
import { cookies } from "next/headers";
import { QuizProvider } from "./state";
import QuizRunner from "./QuizRunner";
import { readQuizSnapshotFromRequestCookies } from "@/lib/quiz-funnel/quiz-cookie";

export default async function QuizPage() {
  const cookieStore = await cookies();
  const initialSnapshot = readQuizSnapshotFromRequestCookies(cookieStore);

  return (
    <div className="qf-funnel-stage">
      <QuizProvider initialSnapshot={initialSnapshot}>
        <Suspense fallback={null}>
          <QuizRunner />
        </Suspense>
      </QuizProvider>
    </div>
  );
}
