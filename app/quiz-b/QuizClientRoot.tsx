"use client";

import dynamic from "next/dynamic";
import { useCallback } from "react";
import { QuizProvider } from "./state";
import { useSyncOAuthEmail } from "./useSyncOAuthEmail";
import type { LabQuizSnapshot } from "@/lib/quiz-funnel-b/quiz-cookie";

const QuizRunner = dynamic(() => import("./QuizRunner"), { ssr: false });

function OAuthEmailSync() {
  useSyncOAuthEmail();
  return null;
}

type QuizClientRootProps = {
  initialSnapshot: LabQuizSnapshot | null;
  dismissEntryShell?: boolean;
};

export function QuizClientRoot({ initialSnapshot, dismissEntryShell = false }: QuizClientRootProps) {
  const onRunnerMounted = useCallback(() => {
    if (!dismissEntryShell) return;
    document.getElementById("plan-b-entry-ssr")?.remove();
  }, [dismissEntryShell]);

  return (
    <QuizProvider initialSnapshot={initialSnapshot}>
      <OAuthEmailSync />
      <QuizRunner onMounted={onRunnerMounted} />
    </QuizProvider>
  );
}
