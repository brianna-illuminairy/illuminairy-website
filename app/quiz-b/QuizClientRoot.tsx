"use client";

import dynamic from "next/dynamic";
import { QuizProvider } from "./state";
import { useSyncOAuthEmail } from "./useSyncOAuthEmail";
import { UtmCapture } from "./utm-capture";
import type { LabQuizSnapshot } from "@/lib/quiz-funnel-b/quiz-cookie";

const QuizRunnerNoSSR = dynamic(() => import("./QuizRunner"), {
  ssr: false,
  loading: () => (
    <div className="qf-page" style={{ color: "var(--qf-ink)" }}>
      <div className="qf-body">
        <div className="qf-body-inner">
          <p className="qf-lead muted">Loading your plan...</p>
        </div>
      </div>
    </div>
  ),
});

function OAuthEmailSync() {
  useSyncOAuthEmail();
  return null;
}

export function QuizClientRoot({ initialSnapshot }: { initialSnapshot: LabQuizSnapshot | null }) {
  return (
    <QuizProvider initialSnapshot={initialSnapshot}>
      <UtmCapture />
      <OAuthEmailSync />
      <QuizRunnerNoSSR />
    </QuizProvider>
  );
}
