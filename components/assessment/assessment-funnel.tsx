"use client";

import { useCallback, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AssessmentComplete } from "@/components/assessment/assessment-complete";
import { AssessmentCurrent } from "@/components/assessment/assessment-current";
import { AssessmentInsightPath } from "@/components/assessment/assessment-insight-path";
import { AssessmentInsightSituation } from "@/components/assessment/assessment-insight-situation";
import { AssessmentSituation } from "@/components/assessment/assessment-situation";
import { AssessmentTarget } from "@/components/assessment/assessment-target";
import { AssessmentTestDate } from "@/components/assessment/assessment-test-date";
import { AssessmentTried } from "@/components/assessment/assessment-tried";
import { AssessmentWho } from "@/components/assessment/assessment-who";
import { AssessmentLandingLow } from "@/components/assessment/landing/assessment-landing-low";
import { trackAssessmentFunnelEvent } from "@/lib/assessment-funnel/analytics";
import { nextStepAfter, stepBefore } from "@/lib/assessment-funnel/funnel-routing";
import {
  assessmentPathForStep,
  loadAssessmentState,
  saveAssessmentState,
  setAssessmentStep,
  stepFromSearchParam
} from "@/lib/assessment-funnel/state";
import type { AssessmentStep } from "@/lib/assessment-funnel/types";

export function AssessmentFunnel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const stepParam = searchParams.get("step");
  const ctxParam = searchParams.get("ctx");
  const step = useMemo(() => stepFromSearchParam(stepParam), [stepParam]);

  useEffect(() => {
    const stored = loadAssessmentState();
    const landing_ctx = ctxParam === "high" ? "high" : "low";
    if (stored.step !== step || stored.landing_ctx !== landing_ctx) {
      saveAssessmentState({ ...stored, step, landing_ctx });
    }
  }, [step, ctxParam]);

  useEffect(() => {
    trackAssessmentFunnelEvent("funnel_landing_view", { step, landing_ctx: ctxParam ?? "low" });
  }, [step, ctxParam]);

  const goTo = useCallback(
    (next: AssessmentStep) => {
      setAssessmentStep(next);
      router.replace(assessmentPathForStep(next));
    },
    [router]
  );

  const goNext = useCallback(
    (from: AssessmentStep) => {
      const answers = loadAssessmentState().answers;
      goTo(nextStepAfter(from, answers));
    },
    [goTo]
  );

  const goBack = useCallback(
    (from: AssessmentStep) => {
      const prev = stepBefore(from);
      if (prev === "landing") {
        goTo("landing");
        return;
      }
      trackAssessmentFunnelEvent("intake_step_back", { step_id: from });
      goTo(prev);
    },
    [goTo]
  );

  if (step === "landing") {
    return <AssessmentLandingLow onStartAssessment={() => goTo("situation")} />;
  }

  if (step === "situation") {
    return (
      <AssessmentSituation onBack={() => goBack("situation")} onContinue={() => goNext("situation")} />
    );
  }

  if (step === "who") {
    return <AssessmentWho onBack={() => goBack("who")} onContinue={() => goNext("who")} />;
  }

  if (step === "target") {
    return <AssessmentTarget onBack={() => goBack("target")} onContinue={() => goNext("target")} />;
  }

  if (step === "current") {
    return <AssessmentCurrent onBack={() => goBack("current")} onContinue={() => goNext("current")} />;
  }

  if (step === "tried") {
    return <AssessmentTried onBack={() => goBack("tried")} onContinue={() => goNext("tried")} />;
  }

  if (step === "test-date") {
    return (
      <AssessmentTestDate onBack={() => goBack("test-date")} onContinue={() => goNext("test-date")} />
    );
  }

  if (step === "insight-situation") {
    return (
      <AssessmentInsightSituation
        onBack={() => goBack("insight-situation")}
        onContinue={() => goNext("insight-situation")}
      />
    );
  }

  if (step === "insight-path") {
    return (
      <AssessmentInsightPath
        onBack={() => goBack("insight-path")}
        onContinue={() => goNext("insight-path")}
      />
    );
  }

  if (step === "complete") {
    return <AssessmentComplete onBack={() => goBack("complete")} />;
  }

  return <AssessmentLandingLow onStartAssessment={() => goTo("situation")} />;
}
