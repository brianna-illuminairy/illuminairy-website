"use client";

import { useCallback, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SatPlanFunnelStub } from "@/components/sat-plan/sat-plan-chapter-stub";
import { SatPlanGpa } from "@/components/sat-plan/sat-plan-gpa";
import { SatPlanHours } from "@/components/sat-plan/sat-plan-hours";
import { SatPlanInt8Mentorship } from "@/components/sat-plan/sat-plan-int8-mentorship";
import { SatPlanInt8PrepComparison } from "@/components/sat-plan/sat-plan-int8-prep-comparison";
import { SatPlanHistory } from "@/components/sat-plan/sat-plan-history";
import { SatPlanInt3Retake } from "@/components/sat-plan/sat-plan-int3-retake";
import { SatPlanLanding } from "@/components/sat-plan/sat-plan-landing";
import { SatPlanPrep } from "@/components/sat-plan/sat-plan-prep";
import { SatPlanScore } from "@/components/sat-plan/sat-plan-score";
import { SatPlanTarget } from "@/components/sat-plan/sat-plan-target";
import { SatPlanTestDate } from "@/components/sat-plan/sat-plan-test-date";
import { SatPlanTrust } from "@/components/sat-plan/sat-plan-trust";
import { SatPlanWho } from "@/components/sat-plan/sat-plan-who";
import { SatPlanWorries } from "@/components/sat-plan/sat-plan-worries";
import { trackSatPlanFunnelEvent } from "@/lib/sat-plan-funnel/analytics";
import {
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
        <SatPlanFunnelStub
          stepId="wrong"
          title="What went wrong?"
          body="Multiselect question — placeholder. Continue to preview the rest of the funnel."
          onBack={() => goTo(stepBeforeWrong())}
          onContinue={() => stubContinue("wrong", nextStepAfterWrong())}
        />
      ) : null}

      {step === "gpa" ? (
        <SatPlanGpa
          onBack={() => goTo(stepBeforeGpa(answers()))}
          onContinue={() => goTo(nextStepAfterGpa())}
        />
      ) : null}

      {step === "gpa-paradox" ? (
        <SatPlanFunnelStub
          stepId="gpa-paradox"
          title="Smart kid / GPA–SAT gap"
          body="INT2 interstitial — placeholder."
          onBack={() => goTo(stepBeforeGpaParadox())}
          onContinue={() => stubContinue("gpa-paradox", nextStepAfterGpaParadox())}
        />
      ) : null}

      {step === "test-date" ? (
        <SatPlanTestDate
          onBack={() => goTo(stepBeforeTestDate())}
          onContinue={() => goTo(nextStepAfterTestDate())}
        />
      ) : null}

      {step === "timeline" ? (
        <SatPlanFunnelStub
          stepId="timeline"
          title="Weeks until test"
          body="INT6 timeline interstitial — placeholder."
          onBack={() => goTo(stepBeforeTimeline())}
          onContinue={() => stubContinue("timeline", nextStepAfterTimeline())}
        />
      ) : null}

      {step === "schools" ? (
        <SatPlanFunnelStub
          stepId="schools"
          title="Target schools"
          body="Free-text schools question — placeholder. Skip ships in the real screen."
          onBack={() => goTo(stepBeforeSchools())}
          onContinue={() => stubContinue("schools", nextStepAfterSchools())}
          continueLabel="Skip for now"
        />
      ) : null}

      {step === "plan-path" ? (
        <SatPlanFunnelStub
          stepId="plan-path"
          title="Your score gap"
          body="INT6 prediction — gap points, 182 avg, path graph — placeholder."
          onBack={() => goTo(stepBeforePlanPath())}
          onContinue={() => stubContinue("plan-path", nextStepAfterPlanPath())}
        />
      ) : null}

      {step === "contact" ? (
        <SatPlanFunnelStub
          stepId="contact"
          title="Get your plan"
          body="Parent email + phone + TCPA — placeholder."
          onBack={() => goTo(stepBeforeContact())}
          onContinue={() => stubContinue("contact", nextStepAfterContact())}
        />
      ) : null}

      {step === "plan-ready" ? (
        <SatPlanFunnelStub
          stepId="plan-ready"
          title="Your plan is ready"
          body="Pre-report bridge interstitial — placeholder."
          onBack={() => goTo(stepBeforePlanReady())}
          onContinue={() => stubContinue("plan-ready", nextStepAfterPlanReady())}
        />
      ) : null}

      {step === "report" ? (
        <SatPlanFunnelStub
          stepId="report"
          title="Your SAT plan"
          body="Personalized on-screen report — placeholder."
          onBack={() => goTo(stepBeforeReport())}
          onContinue={() => stubContinue("report", nextStepAfterReport())}
        />
      ) : null}

      {step === "book" ? (
        <SatPlanFunnelStub
          stepId="book"
          title="Book your free review"
          body="Calendly embed + confirmation — placeholder. End of funnel outline."
          onBack={() => goTo(stepBeforeBook())}
          onContinue={() => stubContinue("book", "book")}
          continueLabel="Done (preview)"
        />
      ) : null}
    </div>
  );
}
