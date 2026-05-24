"use client";

import { useCallback, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SatPlanChapterStub } from "@/components/sat-plan/sat-plan-chapter-stub";
import { SatPlanLanding } from "@/components/sat-plan/sat-plan-landing";
import { SatPlanWho } from "@/components/sat-plan/sat-plan-who";
import { SatPlanWorries } from "@/components/sat-plan/sat-plan-worries";
import { trackSatPlanFunnelEvent } from "@/lib/sat-plan-funnel/analytics";
import {
  loadSatPlanState,
  satPlanPathForStep,
  saveSatPlanState,
  setSatPlanStep,
  stepFromSearchParam
} from "@/lib/sat-plan-funnel/state";
import type { SatPlanStep } from "@/lib/sat-plan-funnel/types";

export function SatPlanFunnel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const stepParam = searchParams.get("step");
  const step = useMemo(() => stepFromSearchParam(stepParam), [stepParam]);
  const isQuiz = step !== "landing";

  useEffect(() => {
    const stored = loadSatPlanState();
    if (stored.step !== step) {
      saveSatPlanState({ ...stored, step });
    }
  }, [step]);

  useEffect(() => {
    trackSatPlanFunnelEvent("funnel_landing_view", { step });
  }, [step]);

  const goTo = useCallback(
    (next: SatPlanStep) => {
      setSatPlanStep(next);
      router.replace(satPlanPathForStep(next));
    },
    [router]
  );

  return (
    <div className={`satplan-funnel${isQuiz ? " satplan-funnel--quiz" : ""}`}>
      {step === "landing" ? (
        <SatPlanLanding onStart={() => goTo("worries")} />
      ) : null}

      {step === "worries" ? (
        <SatPlanWorries
          onBack={() => goTo("landing")}
          onContinue={() => goTo("who")}
        />
      ) : null}

      {step === "who" ? (
        <SatPlanWho onBack={() => goTo("worries")} onContinue={() => goTo("target-stub")} />
      ) : null}

      {step === "target-stub" ? (
        <SatPlanChapterStub
          stepId="target-stub"
          title="Target score"
          onBack={() => goTo("who")}
        />
      ) : null}
    </div>
  );
}
