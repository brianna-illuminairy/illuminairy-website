"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { useDismissFunnelEntryShell } from "@/components/funnel-sibling/funnel-client-root";
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
  entryShellId?: string;
};

export function QuizClientRoot({ initialSnapshot, entryShellId }: QuizClientRootProps) {
  const onRunnerMounted = useDismissFunnelEntryShell(entryShellId);

  return (
    <QuizProvider initialSnapshot={initialSnapshot}>
      <OAuthEmailSync />
      <Suspense fallback={null}>
        <QuizRunner onMounted={onRunnerMounted} />
      </Suspense>
    </QuizProvider>
  );
}
