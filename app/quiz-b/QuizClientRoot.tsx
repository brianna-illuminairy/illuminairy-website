"use client";

import { QuizProvider } from "./state";
import QuizRunner from "./QuizRunner";
import { useSyncOAuthEmail } from "./useSyncOAuthEmail";
import type { LabQuizSnapshot } from "@/lib/quiz-funnel-b/quiz-cookie";

function OAuthEmailSync() {
  useSyncOAuthEmail();
  return null;
}

export function QuizClientRoot({ initialSnapshot }: { initialSnapshot: LabQuizSnapshot | null }) {
  return (
    <QuizProvider initialSnapshot={initialSnapshot}>
      <OAuthEmailSync />
      <QuizRunner />
    </QuizProvider>
  );
}
