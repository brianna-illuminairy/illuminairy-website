"use client";

import { useEffect } from "react";
import { AssessmentShell } from "@/components/assessment/assessment-shell";
import { trackAssessmentFunnelEvent } from "@/lib/assessment-funnel/analytics";

type AssessmentCompleteProps = {
  onBack: () => void;
};

export function AssessmentComplete({ onBack }: AssessmentCompleteProps) {
  useEffect(() => {
    trackAssessmentFunnelEvent("assessment_complete", { step_id: "complete" });
  }, []);

  return (
    <AssessmentShell stepId="complete" showBack onBack={onBack} variant="quiz">
      <div className="assessment-complete-panel">
        <h1 className="quiz-step-headline">Your assessment is complete</h1>
        <div className="quiz-step-copy">
          <p>
            You&apos;ve shared enough for us to understand your family&apos;s situation. A
            member of our team can walk through next steps when you&apos;re ready—there&apos;s no
            obligation from this page.
          </p>
          <p>
            Questions? Email{" "}
            <a href="mailto:support@illuminairy.com" style={{ color: "var(--assessment-celestial)" }}>
              support@illuminairy.com
            </a>
            .
          </p>
        </div>
      </div>
    </AssessmentShell>
  );
}
