"use client";

import { useEffect, useMemo } from "react";
import { FunnelBookBody } from "@/components/sat-plan/funnel-book-body";
import { QuizStepTemplate } from "@/components/sat-plan/quiz-step-template";
import { trackSatPlanFunnelEvent } from "@/lib/sat-plan-funnel/analytics";
import { buildBookCtaCopy } from "@/lib/sat-plan-funnel/final-reveal-copy";
import { useSatPlanAnswers } from "@/lib/sat-plan-funnel/use-sat-plan-answers";
import { site } from "@/lib/site";

type SatPlanBookProps = {
  onBack: () => void;
  onContinue: () => void;
};

function calendlyEmbedUrl(base: string): string {
  try {
    const url = new URL(base);
    url.searchParams.set("hide_event_type_details", "1");
    url.searchParams.set("hide_gdpr_banner", "1");
    url.searchParams.set("background_color", "ffffff");
    url.searchParams.set("text_color", "1a1a2e");
    url.searchParams.set("primary_color", "0d9488");
    return url.toString();
  } catch {
    return base;
  }
}

export function SatPlanBook({ onBack, onContinue }: SatPlanBookProps) {
  const answers = useSatPlanAnswers();
  const copy = useMemo(() => buildBookCtaCopy(answers), [answers]);
  const embedSrc = useMemo(() => calendlyEmbedUrl(site.calendlyUrl), []);

  useEffect(() => {
    trackSatPlanFunnelEvent("calendly_open", {
      step_id: "book",
      path: "spine",
      layout: "conversion"
    });
    trackSatPlanFunnelEvent("intake_step_view", {
      step_id: "book",
      path: "spine",
      layout: "conversion"
    });
  }, []);

  const handleContinue = () => {
    trackSatPlanFunnelEvent("intake_step_complete", { step_id: "book" });
    onContinue();
  };

  return (
    <QuizStepTemplate
      stepId="book"
      headline={copy.headline}
      hint="15 minutes — no obligation."
      bodyVariant="copy"
      headlineTier="compact"
      continueLabel="I scheduled my call"
      onContinue={handleContinue}
      onBack={onBack}
    >
      <FunnelBookBody
        embedSrc={embedSrc}
        intro={copy.intro}
        agenda={copy.agenda}
        footnote={copy.footnote}
      />
    </QuizStepTemplate>
  );
}
