"use client";

import { useEffect, useMemo } from "react";
import { FunnelBookedBody } from "@/components/sat-plan/funnel-booked-body";
import { QuizStepTemplate } from "@/components/sat-plan/quiz-step-template";
import { trackSatPlanFunnelEvent } from "@/lib/sat-plan-funnel/analytics";
import { studentDisplayName } from "@/lib/sat-plan-funnel/student-voice";
import { useSatPlanAnswers } from "@/lib/sat-plan-funnel/use-sat-plan-answers";

type SatPlanBookedProps = {
  onBack: () => void;
  onContinue: () => void;
};

export function SatPlanBooked({ onBack, onContinue }: SatPlanBookedProps) {
  const answers = useSatPlanAnswers();
  const name = useMemo(() => studentDisplayName(answers), [answers]);

  const headline = useMemo(() => {
    if (answers.test_taker === "test_taker_self") return "You're set.";
    return `${name} is on the calendar.`;
  }, [answers.test_taker, name]);

  const bodyCopy = useMemo(() => {
    const possessive = answers.test_taker === "test_taker_self" ? "your" : `${name}'s`;
    const withWhom =
      answers.test_taker === "test_taker_self" ? "anyone helping you" : name;
    return `Check your email for the calendar invite. Share ${possessive} plan snapshot with ${withWhom} and talk through it together.`;
  }, [answers.test_taker, name]);

  useEffect(() => {
    trackSatPlanFunnelEvent("intake_step_view", {
      step_id: "booked",
      path: "spine",
      layout: "confirmation"
    });
  }, []);

  const handleContinue = () => {
    trackSatPlanFunnelEvent("intake_step_complete", { step_id: "booked" });
    onContinue();
  };

  return (
    <QuizStepTemplate
      stepId="booked"
      headline={headline}
      bodyVariant="copy"
      continueLabel="Done"
      onContinue={handleContinue}
      onBack={onBack}
    >
      <FunnelBookedBody bodyCopy={bodyCopy} />
    </QuizStepTemplate>
  );
}
