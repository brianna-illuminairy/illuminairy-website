"use client";

import { useCallback, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SatPlanBook } from "@/components/sat-plan/sat-plan-book";
import { SatPlanBooked } from "@/components/sat-plan/sat-plan-booked";
import { SatPlanCh3Method } from "@/components/sat-plan/sat-plan-ch3-method";
import { SatPlanCh3Path } from "@/components/sat-plan/sat-plan-ch3-path";
import { SatPlanCh3Preview } from "@/components/sat-plan/sat-plan-ch3-preview";
import { SatPlanCh3Social } from "@/components/sat-plan/sat-plan-ch3-social";
import { SatPlanContact } from "@/components/sat-plan/sat-plan-contact";
import { SatPlanIntCh2ScoreFit } from "@/components/sat-plan/sat-plan-int-ch2-score-fit";
import { SatPlanStudentName } from "@/components/sat-plan/sat-plan-student-name";
import { SatPlanGpa } from "@/components/sat-plan/sat-plan-gpa";
import { SatPlanInt2GpaParadox } from "@/components/sat-plan/sat-plan-int2-gpa-paradox";
import { SatPlanInt6Timeline } from "@/components/sat-plan/sat-plan-int6-timeline";
import { SatPlanInt8SelfStudyFail } from "@/components/sat-plan/sat-plan-int8-self-study-fail";
import { SatPlanInt8GroupClassFail } from "@/components/sat-plan/sat-plan-int8-group-class-fail";
import { SatPlanInt8DiagnosticDriven } from "@/components/sat-plan/sat-plan-int8-diagnostic-driven";
import { SatPlanInt8MistakeDriven } from "@/components/sat-plan/sat-plan-int8-mistake-driven";
import { SatPlanInt8PrepComparison } from "@/components/sat-plan/sat-plan-int8-prep-comparison";
import { SatPlanHistory } from "@/components/sat-plan/sat-plan-history";
import { SatPlanInt3Retake } from "@/components/sat-plan/sat-plan-int3-retake";
import { SatPlanSchools } from "@/components/sat-plan/sat-plan-schools";
import { SatPlanLanding } from "@/components/sat-plan/sat-plan-landing";
import { SatPlanPlanPath } from "@/components/sat-plan/sat-plan-plan-path";
import { SatPlanRevealBottlenecks } from "@/components/sat-plan/sat-plan-reveal-bottlenecks";
import { SatPlanRevealDiagnosis } from "@/components/sat-plan/sat-plan-reveal-diagnosis";
import { SatPlanRevealProof } from "@/components/sat-plan/sat-plan-reveal-proof";
import { SatPlanRevealStakes } from "@/components/sat-plan/sat-plan-reveal-stakes";
import { SatPlanPrep } from "@/components/sat-plan/sat-plan-prep";
import { SatPlanSatChanged } from "@/components/sat-plan/sat-plan-sat-changed";
import { SatPlanScore } from "@/components/sat-plan/sat-plan-score";
import { SatPlanTarget } from "@/components/sat-plan/sat-plan-target";
import { SatPlanTestDate } from "@/components/sat-plan/sat-plan-test-date";
import { SatPlanTrust } from "@/components/sat-plan/sat-plan-trust";
import { SatPlanWho } from "@/components/sat-plan/sat-plan-who";
import { SatPlanWrong } from "@/components/sat-plan/sat-plan-wrong";
import { SatPlanMeaning } from "@/components/sat-plan/sat-plan-meaning";
import { SatPlanWorries } from "@/components/sat-plan/sat-plan-worries";
import { trackSatPlanFunnelEvent } from "@/lib/sat-plan-funnel/analytics";
import { usePrefetchInt12FormatImages } from "@/lib/sat-plan-funnel/use-prefetch-int12-format-images";
import {
  isTestedHistory,
  lastInt8Step,
  nextStepAfterBook,
  nextStepAfterCh3Method,
  nextStepAfterCh3Path,
  nextStepAfterCh3Preview,
  nextStepAfterCh3Social,
  nextStepAfterContact,
  nextStepAfterGpa,
  nextStepAfterGpaParadox,
  nextStepAfterHistory,
  nextStepAfterSchools,
  nextStepAfterScoreFit,
  nextStepAfterStudentName,
  nextStepAfterWho,
  nextStepAfterInt8SelfStudy,
  nextStepAfterInt8GroupClass,
  nextStepAfterInt8Plateau,
  nextStepAfterInt8Proof,
  nextStepAfterInt8Guided,
  nextStepAfterPlanPath,
  nextStepAfterRevealBottlenecks,
  nextStepAfterRevealDiagnosis,
  nextStepAfterRevealProof,
  nextStepAfterRevealStakes,
  nextStepAfterPrep,
  nextStepAfterPrepFailed,
  nextStepAfterSatChanged,
  nextStepAfterScore,
  nextStepAfterTestDate,
  nextStepAfterTimeline,
  nextStepAfterWrong,
  stepBeforeBook,
  stepBeforeBooked,
  stepBeforeCh3Method,
  stepBeforeCh3Path,
  stepBeforeCh3Preview,
  stepBeforeCh3Social,
  stepBeforeContact,
  stepBeforeGpa,
  stepBeforeGpaParadox,
  stepBeforeInt8,
  stepBeforePlanPath,
  stepBeforeScoreFit,
  stepBeforeSchools,
  stepBeforeRevealBottlenecks,
  stepBeforeRevealDiagnosis,
  stepBeforeRevealProof,
  stepBeforeRevealStakes,
  stepBeforePrep,
  stepBeforeStudentName,
  stepBeforeTarget,
  stepBeforeTrust,
  stepBeforeSatChanged,
  stepBeforeScore,
  stepBeforeTestDate,
  stepBeforeTimeline,
  stepBeforeWrong,
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

  const answers = () => loadSatPlanState().answers;

  const prefetchInt12Format =
    step === "wrong" ||
    step === "prep-failed-mistake-driven" ||
    step === "prep-failed-guided";
  usePrefetchInt12FormatImages(prefetchInt12Format);

  useEffect(() => {
    if (step !== "wrong") return;
    if (!isTestedHistory(answers().test_history)) goTo("sat-changed");
  }, [step, goTo]);

  useEffect(() => {
    if (step !== "prep-failed-mentors") return;
    goTo("prep-failed-guided");
  }, [step, goTo]);

  const stubContinue = (stepId: SatPlanStep, next: SatPlanStep) => {
    trackSatPlanFunnelEvent("intake_step_complete", { step_id: stepId });
    goTo(next);
  };

  return (
    <div className={`satplan-funnel${isQuiz ? " satplan-funnel--quiz" : ""}`}>
      {step === "landing" ? (
        <SatPlanLanding onStart={() => goTo("meaning")} />
      ) : null}

      {step === "meaning" ? (
        <SatPlanMeaning
          onBack={() => goTo("landing")}
          onContinue={() => goTo("worries")}
        />
      ) : null}

      {step === "worries" ? (
        <SatPlanWorries
          onBack={() => goTo("meaning")}
          onContinue={() => goTo("who")}
        />
      ) : null}

      {step === "who" ? (
        <SatPlanWho
          onBack={() => goTo("worries")}
          onContinue={() => goTo(nextStepAfterWho())}
        />
      ) : null}

      {step === "student-name" ? (
        <SatPlanStudentName
          onBack={() => goTo(stepBeforeStudentName())}
          onContinue={() => goTo(nextStepAfterStudentName())}
        />
      ) : null}

      {step === "target" ? (
        <SatPlanTarget
          onBack={() => goTo(stepBeforeTarget())}
          onContinue={() => goTo("trust")}
        />
      ) : null}

      {step === "trust" ? (
        <SatPlanTrust
          onBack={() => goTo(stepBeforeTrust())}
          onContinue={() => goTo("history")}
        />
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
          onContinue={() => goTo("score")}
        />
      ) : null}

      {step === "prep" ? (
        <SatPlanPrep
          onBack={() => goTo(stepBeforePrep(answers().test_history))}
          onContinue={() => goTo(nextStepAfterPrep(answers().prep_method))}
        />
      ) : null}

      {step === "prep-failed-self-study" ? (
        <SatPlanInt8SelfStudyFail
          onBack={() =>
            goTo(stepBeforeInt8("prep-failed-self-study", answers().test_history))
          }
          onContinue={() => goTo(nextStepAfterInt8SelfStudy())}
        />
      ) : null}

      {step === "prep-failed-group-class" ? (
        <SatPlanInt8GroupClassFail
          onBack={() =>
            goTo(stepBeforeInt8("prep-failed-group-class", answers().test_history))
          }
          onContinue={() => goTo(nextStepAfterInt8GroupClass())}
        />
      ) : null}

      {step === "prep-failed-plateau" ? (
        <SatPlanInt8PrepComparison
          beat="plateau"
          stepId="prep-failed-plateau"
          onBack={() =>
            goTo(stepBeforeInt8("prep-failed-plateau", answers().test_history))
          }
          onContinue={() => goTo(nextStepAfterInt8Plateau())}
        />
      ) : null}

      {step === "prep-failed-proof" ? (
        <SatPlanInt8PrepComparison
          beat="proof"
          stepId="prep-failed-proof"
          onBack={() =>
            goTo(
              stepBeforeInt8(
                "prep-failed-proof",
                answers().test_history,
                answers().prep_method
              )
            )
          }
          onContinue={() =>
            goTo(nextStepAfterInt8Proof(answers().test_history))
          }
        />
      ) : null}

      {step === "prep-failed-guided" ? (
        <SatPlanInt8DiagnosticDriven
          onBack={() =>
            goTo(
              stepBeforeInt8(
                "prep-failed-guided",
                answers().test_history,
                answers().prep_method
              )
            )
          }
          onContinue={() =>
            goTo(nextStepAfterInt8Guided(answers().test_history))
          }
        />
      ) : null}

      {step === "prep-failed-mistake-driven" ? (
        <SatPlanInt8MistakeDriven
          onBack={() =>
            goTo(
              stepBeforeInt8(
                "prep-failed-mistake-driven",
                answers().test_history,
                answers().prep_method
              )
            )
          }
          onContinue={() =>
            goTo(
              nextStepAfterPrepFailed(
                answers().test_history,
                answers().prep_method
              )
            )
          }
        />
      ) : null}

      {step === "score" ? (
        <SatPlanScore
          onBack={() => goTo(stepBeforeScore(answers()))}
          onContinue={() => goTo(nextStepAfterScore())}
        />
      ) : null}

      {step === "wrong" ? (
        <SatPlanWrong
          onBack={() => goTo(stepBeforeWrong(answers()))}
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

      {step === "score-fit" ? (
        <SatPlanIntCh2ScoreFit
          onBack={() => goTo(stepBeforeScoreFit())}
          onContinue={() => goTo(nextStepAfterScoreFit())}
        />
      ) : null}

      {step === "plan-path" ? (
        <SatPlanPlanPath
          onBack={() => goTo(stepBeforePlanPath())}
          onContinue={() => goTo(nextStepAfterPlanPath())}
        />
      ) : null}

      {step === "ch3-social" ? (
        <SatPlanCh3Social
          onBack={() => goTo(stepBeforeCh3Social())}
          onContinue={() => goTo(nextStepAfterCh3Social())}
        />
      ) : null}

      {step === "ch3-method" ? (
        <SatPlanCh3Method
          onBack={() => goTo(stepBeforeCh3Method())}
          onContinue={() => goTo(nextStepAfterCh3Method())}
        />
      ) : null}

      {step === "ch3-preview" ? (
        <SatPlanCh3Preview
          onBack={() => goTo(stepBeforeCh3Preview())}
          onContinue={() => goTo(nextStepAfterCh3Preview())}
        />
      ) : null}

      {step === "ch3-path" ? (
        <SatPlanCh3Path
          onBack={() => goTo(stepBeforeCh3Path())}
          onContinue={() => goTo(nextStepAfterCh3Path())}
        />
      ) : null}

      {step === "contact" ? (
        <SatPlanContact
          onBack={() => goTo(stepBeforeContact())}
          onContinue={() => goTo(nextStepAfterContact())}
        />
      ) : null}

      {step === "reveal-stakes" ? (
        <SatPlanRevealStakes
          onBack={() => goTo(stepBeforeRevealStakes())}
          onContinue={() => goTo(nextStepAfterRevealStakes())}
        />
      ) : null}

      {step === "reveal-diagnosis" ? (
        <SatPlanRevealDiagnosis
          onBack={() => goTo(stepBeforeRevealDiagnosis())}
          onContinue={() => goTo(nextStepAfterRevealDiagnosis())}
        />
      ) : null}

      {step === "reveal-bottlenecks" ? (
        <SatPlanRevealBottlenecks
          onBack={() => goTo(stepBeforeRevealBottlenecks())}
          onContinue={() => goTo(nextStepAfterRevealBottlenecks())}
        />
      ) : null}

      {step === "reveal-proof" ? (
        <SatPlanRevealProof
          onBack={() => goTo(stepBeforeRevealProof())}
          onContinue={() => goTo(nextStepAfterRevealProof())}
        />
      ) : null}

      {step === "book" ? (
        <SatPlanBook
          onBack={() => goTo(stepBeforeBook())}
          onContinue={() => goTo(nextStepAfterBook())}
        />
      ) : null}

      {step === "booked" ? (
        <SatPlanBooked
          onBack={() => goTo(stepBeforeBooked())}
          onContinue={() => stubContinue("booked", "booked")}
        />
      ) : null}
    </div>
  );
}
