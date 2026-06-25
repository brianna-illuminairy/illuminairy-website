"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { useDismissFunnelEntryShell } from "@/components/funnel-sibling/funnel-client-root";
import { QuizProvider } from "./state";

const QuizRunner = dynamic(() => import("./QuizRunner"), { ssr: false });

type QuizClientRootProps = {
  entryShellId?: string;
};

export function QuizClientRoot({ entryShellId }: QuizClientRootProps) {
  const onRunnerMounted = useDismissFunnelEntryShell(entryShellId);

  return (
    <QuizProvider>
      <Suspense fallback={null}>
        <QuizRunner onMounted={onRunnerMounted} />
      </Suspense>
    </QuizProvider>
  );
}
