"use client";

import { useEffect, useState } from "react";
import { QuizStepTemplate } from "@/components/sat-plan/quiz-step-template";
import { trackSatPlanFunnelEvent } from "@/lib/sat-plan-funnel/analytics";
import { contactHeadline } from "@/lib/sat-plan-funnel/personalization";
import { loadSatPlanState, patchSatPlanAnswers } from "@/lib/sat-plan-funnel/state";

type SatPlanContactProps = {
  onBack: () => void;
  onContinue: () => void;
};

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function SatPlanContact({ onBack, onContinue }: SatPlanContactProps) {
  const saved = loadSatPlanState().answers;
  const [email, setEmail] = useState(saved.parent_email ?? "");
  const [phone, setPhone] = useState(saved.parent_phone ?? "");

  useEffect(() => {
    trackSatPlanFunnelEvent("intake_step_view", {
      step_id: "contact",
      path: "spine",
      layout: "form"
    });
  }, []);

  const handleContinue = () => {
    if (!isValidEmail(email)) return;
    patchSatPlanAnswers({
      parent_email: email.trim(),
      parent_phone: phone.trim() || undefined
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
      headline={contactHeadline()}
      hint="We'll email your personalized plan — no spam."
      bodyVariant="copy"
      continueDisabled={!isValidEmail(email)}
      onContinue={handleContinue}
      onBack={onBack}
    >
      <div className="sf-form">
        <label className="sf-field" htmlFor="satplan-contact-email">
          <span className="sf-field__label">Email</span>
          <input
            id="satplan-contact-email"
            className="sf-input"
            type="email"
            autoComplete="email"
            inputMode="email"
            value={email}
            placeholder="you@email.com"
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        <label className="sf-field" htmlFor="satplan-contact-phone">
          <span className="sf-field__label">Phone (optional)</span>
          <input
            id="satplan-contact-phone"
            className="sf-input"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            value={phone}
            placeholder="(555) 555-5555"
            onChange={(event) => setPhone(event.target.value)}
          />
        </label>
      </div>
    </QuizStepTemplate>
  );
}
