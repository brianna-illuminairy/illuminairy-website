"use client";

import { useEffect, useRef, useState } from "react";
import { Int8MentorshipSplash } from "@/components/sat-plan/int8-mentorship-splash";
import { QuizStepTemplate } from "@/components/sat-plan/quiz-step-template";
import { trackSatPlanFunnelEvent } from "@/lib/sat-plan-funnel/analytics";

type SatPlanInt8MentorshipProps = {
  onBack: () => void;
  onContinue: () => void;
};

/** Block same-tap ghost clicks on Continue after the last pair reveals. */
const CONTINUE_UNLOCK_MS = 500;

export function SatPlanInt8Mentorship({ onBack, onContinue }: SatPlanInt8MentorshipProps) {
  const [revealed, setRevealed] = useState(false);
  const [continueReady, setContinueReady] = useState(false);
  const continueTimerRef = useRef<number | null>(null);

  useEffect(() => {
    trackSatPlanFunnelEvent("intake_step_view", {
      step_id: "prep-failed-mentors",
      path: "spine",
      layout: "interstitial"
    });
  }, []);

  useEffect(() => {
    return () => {
      if (continueTimerRef.current !== null) {
        window.clearTimeout(continueTimerRef.current);
      }
    };
  }, []);

  const handleRevealedChange = (next: boolean) => {
    setRevealed(next);
    if (continueTimerRef.current !== null) {
      window.clearTimeout(continueTimerRef.current);
      continueTimerRef.current = null;
    }
    if (!next) {
      setContinueReady(false);
      return;
    }
    setContinueReady(false);
    continueTimerRef.current = window.setTimeout(() => {
      setContinueReady(true);
      continueTimerRef.current = null;
    }, CONTINUE_UNLOCK_MS);
  };

  const handleContinue = () => {
    if (!continueReady) return;
    trackSatPlanFunnelEvent("intake_step_complete", {
      step_id: "prep-failed-mentors",
      mentorship_revealed: revealed
    });
    onContinue();
  };

  const headlineNode = revealed ? (
    <>
      One thing in <strong>common</strong>.
    </>
  ) : (
    <>
      Recognize these <strong>pairs</strong>?
    </>
  );

  const hint = revealed
    ? continueReady
      ? null
      : "Read the reveal, then tap Continue"
    : "Tap each pair above to continue";

  return (
    <QuizStepTemplate
      stepId="prep-failed-mentors"
      headlineNode={headlineNode}
      hint={hint}
      bodyVariant="copy"
      onContinue={handleContinue}
      onBack={onBack}
      continueDisabled={!continueReady}
    >
      <Int8MentorshipSplash onRevealedChange={handleRevealedChange} />
    </QuizStepTemplate>
  );
}
