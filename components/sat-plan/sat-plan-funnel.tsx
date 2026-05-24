"use client";

import { useCallback, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SatPlanBook } from "@/components/sat-plan/sat-plan-book";
import { SatPlanContact } from "@/components/sat-plan/sat-plan-contact";
import { SatPlanGpa } from "@/components/sat-plan/sat-plan-gpa";
import { SatPlanHours } from "@/components/sat-plan/sat-plan-hours";
import { SatPlanInt2GpaParadox } from "@/components/sat-plan/sat-plan-int2-gpa-paradox";
import { SatPlanInt6Timeline } from "@/components/sat-plan/sat-plan-int6-timeline";
import { SatPlanInt8Mentorship } from "@/components/sat-plan/sat-plan-int8-mentorship";
import { SatPlanInt8PrepComparison } from "@/components/sat-plan/sat-plan-int8-prep-comparison";
import { SatPlanHistory } from "@/components/sat-plan/sat-plan-history";
import { SatPlanInt3Retake } from "@/components/sat-plan/sat-plan-int3-retake";
import { SatPlanLanding } from "@/components/sat-plan/sat-plan-landing";
import { SatPlanPlanPath } from "@/components/sat-plan/sat-plan-plan-path";
import { SatPlanPlanReady } from "@/components/sat-plan/sat-plan-plan-ready";
import { SatPlanPrep } from "@/components/sat-plan/sat-plan-prep";
import { SatPlanReport } from "@/components/sat-plan/sat-plan-report";
import { SatPlanSatChanged } from "@/components/sat-plan/sat-plan-sat-changed";
import { SatPlanSchools } from "@/components/sat-plan/sat-plan-schools";
import { SatPlanScore } from "@/components/sat-plan/sat-plan-score";
import { SatPlanTarget } from "@/components/sat-plan/sat-plan-target";
import { SatPlanTestDate } from "@/components/sat-plan/sat-plan-test-date";
import { SatPlanTrust } from "@/components/sat-plan/sat-plan-trust";
import { SatPlanWho } from "@/components/sat-plan/sat-plan-who";
import { SatPlanWrong } from "@/components/sat-plan/sat-plan-wrong";
import { SatPlanWorries } from "@/components/sat-plan/sat-plan-worries";
import { trackSatPlanFunnelEvent } from "@/lib/sat-plan-funnel/analytics";
import {
  isTestedHistory,
  lastInt8Step,
  nextStepAfterContact,
  nextStepAfterGpa,
  nextStepAfterGpaParadox,
  nextStepAfterHistory,
  nextStepAfterHours,
  nextStepAfterInt8Mentors,
  nextStepAfterInt8Plateau,
  nextStepAfterInt8Proof,
  nextStepAfterPlanPath,
  nextStepAfterPlanReady,
  nextStepAfterPrep,
  nextStepAfterPrepFailed,
  nextStepAfterReport,
  nextStepAfterSatChanged,
  nextStepAfterSchools,
  nextStepAfterScore,
  nextStepAfterTestDate,
  nextStepAfterTimeline,
  nextStepAfterWrong,
  stepBeforeBook,
  stepBeforeContact,
  stepBeforeGpa,
  stepBeforeGpaParadox,
  stepBeforeHours,
  stepBeforeInt8,
  stepBeforePlanPath,
  stepBeforePlanReady,
  stepBeforePrep,
  stepBeforeReport,
  stepBeforeSatChanged,
  stepBeforeSchools,
  stepBeforeScore,
  stepBeforeTestDate,
  stepBeforeTimeline,
  stepBeforeWrong,
  usesInt8Trilogy
} from "@/lib/sat-plan-funnel/funnel-routing";
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

  useEffect(() => {
    if (step !== "wrong") return;
    if (!isTestedHistory(answers().test_history)) goTo("sat-changed");
  }, [step, goTo]);

  useEffect(() => {
    if (step !== "prep-failed-stub") return;
    const prepMethod = loadSatPlanState().answers.prep_method;
    if (!usesInt8Trilogy(prepMethod)) return;
    goTo("prep-failed-plateau");
  }, [step, goTo]);

  const answers = () => loadSatPlanState().answers;

  const stubContinue = (stepId: SatPlanStep, next: SatPlanStep) => {
    trackSatPlanFunnelEvent("intake_step_complete", { step_id: stepId });
    goTo(next);
  };

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
        <SatPlanWho onBack={() => goTo("worries")} onContinue={() => goTo("target")} />
      ) : null}

      {step === "target" ? (
        <SatPlanTarget onBack={() => goTo("who")} onContinue={() => goTo("trust")} />
      ) : null}

      {step === "trust" ? (
        <SatPlanTrust onBack={() => goTo("target")} onContinue={() => goTo("history")} />
      ) : null}

      {step === "history" ? (
        <SatPlanHistory
          onBack={() => goTo("trust")}
          onContinue={() => {
            goTo(nextStepAfterHistory(answers().test_history));
          }}
        />
      ) : null}

      {step === "int3-retake" ? (
        <SatPlanInt3Retake
          onBack={() => goTo("history")}
          onContinue={() => goTo("prep")}
        />
      ) : null}

      {step === "prep" ? (
        <SatPlanPrep
          onBack={() => goTo(stepBeforePrep(answers().test_history))}
          onContinue={() => goTo(nextStepAfterPrep(answers().prep_method))}
        />
      ) : null}

      {step === "prep-failed-plateau" ? (
        <SatPlanInt8PrepComparison
          beat="plateau"
          stepId="prep-failed-plateau"
          onBack={() => goTo(stepBeforeInt8("prep-failed-plateau", answers().test_history))}
          onContinue={() => goTo(nextStepAfterInt8Plateau())}
        />
      ) : null}

      {step === "prep-failed-proof" ? (
        <SatPlanInt8PrepComparison
          beat="proof"
          stepId="prep-failed-proof"
          onBack={() => goTo(stepBeforeInt8("prep-failed-proof", answers().test_history))}
          onContinue={() => goTo(nextStepAfterInt8Proof())}
        />
      ) : null}

      {step === "prep-failed-mentors" ? (
        <SatPlanInt8Mentorship
          onBack={() => goTo(stepBeforeInt8("prep-failed-mentors", answers().test_history))}
          onContinue={() => goTo(nextStepAfterInt8Mentors())}
        />
      ) : null}

      {step === "prep-failed-guided" ? (
        <SatPlanInt8PrepComparison
          beat="guided"
          stepId="prep-failed-guided"
          onBack={() => goTo(stepBeforeInt8("prep-failed-guided", answers().test_history))}
          onContinue={() => goTo(nextStepAfterPrepFailed(answers().test_history))}
        />
      ) : null}

      {step === "prep-failed-stub" ? (
        <SatPlanInt8PrepComparison
          onBack={() => goTo(stepBeforeInt8("prep-failed-stub", answers().test_history))}
          onContinue={() => goTo(nextStepAfterPrepFailed(answers().test_history))}
        />
      ) : null}

      {step === "hours" ? (
        <SatPlanHours
          onBack={() => goTo(stepBeforeHours(answers()))}
          onContinue={() => goTo(nextStepAfterHours())}
        />
      ) : null}

      {step === "score" ? (
        <SatPlanScore
          onBack={() => goTo(stepBeforeScore())}
          onContinue={() => goTo(nextStepAfterScore())}
        />
      ) : null}

      {step === "wrong" ? (
        <SatPlanWrong
          onBack={() => goTo(stepBeforeWrong())}
          onContinue={() => goTo(nextStepAfterWrong())}
        />
      ) : null}

      {step === "sat-changed" ? (
        <SatPlanSatChanged
          onBack={() => goTo(stepBeforeSatChanged(answers()))}
          onContinue={() => goTo(nextStepAfterSatChanged())}
        />
      ) : null}

      {step === "gpa" ? (
        <SatPlanGpa
          onBack={() => goTo(stepBeforeGpa(answers()))}
          onContinue={() => goTo(nextStepAfterGpa())}
        />
      ) : null}

      {step === "gpa-paradox" ? (
        <SatPlanInt2GpaParadox
          onBack={() => goTo(stepBeforeGpaParadox())}
          onContinue={() => goTo(nextStepAfterGpaParadox())}
        />
      ) : null}

      {step === "test-date" ? (
        <SatPlanTestDate
          onBack={() => goTo(stepBeforeTestDate())}
          onContinue={() => goTo(nextStepAfterTestDate())}
        />
      ) : null}

      {step === "timeline" ? (
        <SatPlanInt6Timeline
          onBack={() => goTo(stepBeforeTimeline())}
          onContinue={() => goTo(nextStepAfterTimeline())}
        />
      ) : null}

      {step === "schools" ? (
        <SatPlanSchools
          onBack={() => goTo(stepBeforeSchools())}
          onContinue={() => goTo(nextStepAfterSchools())}
        />
      ) : null}

      {step === "plan-path" ? (
        <SatPlanPlanPath
          onBack={() => goTo(stepBeforePlanPath())}
          onContinue={() => goTo(nextStepAfterPlanPath())}
        />
      ) : null}

      {step === "contact" ? (
        <SatPlanContact
          onBack={() => goTo(stepBeforeContact())}
          onContinue={() => goTo(nextStepAfterContact())}
        />
      ) : null}

      {step === "plan-ready" ? (
        <SatPlanPlanReady
          onBack={() => goTo(stepBeforePlanReady())}
          onContinue={() => goTo(nextStepAfterPlanReady())}
        />
      ) : null}

      {step === "report" ? (
        <SatPlanReport
          onBack={() => goTo(stepBeforeReport())}
          onContinue={() => goTo(nextStepAfterReport())}
        />
      ) : null}

      {step === "book" ? (
        <SatPlanBook
          onBack={() => goTo(stepBeforeBook())}
          onContinue={() => stubContinue("book", "book")}
        />
      ) : null}
    </div>
  );
}
