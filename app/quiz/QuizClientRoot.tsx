"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { useDismissFunnelEntryShell } from "@/components/funnel-sibling/funnel-client-root";
import { QuizProvider } from "./state";
import type { QuizSnapshot } from "@/lib/quiz-funnel/quiz-cookie";

const QuizRunner = dynamic(() => import("./QuizRunner"), { ssr: false });

type QuizClientRootProps = {
  initialSnapshot: QuizSnapshot | null;
  entryShellId?: string;
};

export function QuizClientRoot({ initialSnapshot, entryShellId }: QuizClientRootProps) {
  const onRunnerMounted = useDismissFunnelEntryShell(entryShellId);

  return (
    <QuizProvider initialSnapshot={initialSnapshot}>
      <Suspense fallback={null}>
        <QuizRunner onMounted={onRunnerMounted} />
      </Suspense>
    </QuizProvider>
  );
}
