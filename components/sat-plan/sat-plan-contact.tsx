"use client";

import { useEffect, useMemo, useState } from "react";
import { FunnelContactBody } from "@/components/sat-plan/funnel-contact-body";
import { QuizStepTemplate } from "@/components/sat-plan/quiz-step-template";
import { trackSatPlanFunnelEvent } from "@/lib/sat-plan-funnel/analytics";
import { studentPossessiveLabel } from "@/lib/sat-plan-funnel/student-voice";
import { loadSatPlanState, patchSatPlanAnswers } from "@/lib/sat-plan-funnel/state";

type SatPlanContactProps = {
  onBack: () => void;
  onContinue: () => void;
};

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function SatPlanContact({ onBack, onContinue }: SatPlanContactProps) {
  const answers = loadSatPlanState().answers;
  const [email, setEmail] = useState(answers.parent_email ?? "");
  const [phone, setPhone] = useState(answers.parent_phone ?? "");
  const [consent, setConsent] = useState(false);

  const headline = useMemo(() => {
    const label = studentPossessiveLabel(answers);
    return `Get ${label} SAT improvement plan`;
  }, [answers]);

  useEffect(() => {
    trackSatPlanFunnelEvent("intake_step_view", {
      step_id: "contact",
      path: "spine",
      layout: "form"
    });
  }, []);

  const canContinue = isValidEmail(email) && consent;

  const handleContinue = () => {
    if (!canContinue) return;
    patchSatPlanAnswers({
      parent_email: email.trim(),
      parent_phone: phone.trim() || undefined
    });
    trackSatPlanFunnelEvent("contact_submit", {
      step_id: "contact",
      has_phone: Boolean(phone.trim())
    });
    trackSatPlanFunnelEvent("intake_step_complete", {
      step_id: "contact",
      has_phone: Boolean(phone.trim())
    });
    onContinue();
  };

  return (
    <QuizStepTemplate
      stepId="contact"
      headline={headline}
      hint="Parent email required. We'll show the full plan on the next screen."
      bodyVariant="copy"
      continueLabel="See the plan"
      continueDisabled={!canContinue}
      onContinue={handleContinue}
      onBack={onBack}
    >
      <FunnelContactBody
        email={email}
        phone={phone}
        consent={consent}
        onEmailChange={setEmail}
        onPhoneChange={setPhone}
        onConsentChange={setConsent}
      />
    </QuizStepTemplate>
  );
}
