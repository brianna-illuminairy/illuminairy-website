'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuiz, showGapScreen, type QuizAnswers } from './state';
import { useQuizAnalytics } from './useQuizAnalytics';
import { useQuizAvailabilityPrefetch } from './useQuizAvailabilityPrefetch';
import { captureParentConfirmed } from '@/lib/quiz-funnel/analytics';
import { planBuilderStepHref } from '@/lib/plan-builder-routes';
import {
  QUIZ_BOOKED_STEP,
  QUIZ_ENTRY_STEP,
  resolveGuardedQuizStep,
  resolveQuizResumeStep,
} from '@/lib/quiz-funnel/funnel-steps';
import { getQuizRouteSteps } from '@/lib/quiz-funnel/quiz-route';
import {
  QFQWho, QFQScoreLower, QFQ1Trigger, QFQ2Stakes, QFQ3TimesTaken, QFQ4RecentScore, QFQDoubts, QFQ5Clock,
  QFQ6Blocker, QFQ7Tried, QFQ8Goal, QFQ9GPA, QFQName,
} from './screens/Questions';
import {
  QFI2Compute, QFIGPAGap, QFV1Projection, QFIDiagnosis, QFISteps,
  QFIComparePrep, QFIDoubtsInsight, QFIHopeScreen,
  QFSPlanReveal, QFS4PlanHandoff, QFS5Approved, QFS9ThankYou,
} from './lazy-screens';
import { QFInsightHit } from './components/QFInsightHit';
import { prepFailureInsight } from '@/lib/quiz-funnel/prep-failure-copy';
import {
  educationHitQ3None,
  educationHitQ5Tbd,
  educationHitQ8Scores,
} from '@/lib/quiz-funnel/education-slides';
import { PLAN_HANDOFF_CTA } from '@/lib/quiz-funnel/plan-handoff-copy';
import { QFProgressProvider } from './components/QFProgressContext';

function getSteps(answers: QuizAnswers) {
  return getQuizRouteSteps(answers);
}

export default function QuizRunner() {
  const router = useRouter();
  const params = useSearchParams();
  const { answers, dispatch, lastStep, setLastStep } = useQuiz();
  const search = params.toString();

  const requestedStep = params.get('step') || QUIZ_ENTRY_STEP;
  const steps = getSteps(answers);
  const resumeStep =
    requestedStep === QUIZ_ENTRY_STEP || requestedStep === QUIZ_BOOKED_STEP
      ? resolveQuizResumeStep(answers, steps, lastStep)
      : requestedStep;
  const stepId =
    resumeStep === QUIZ_BOOKED_STEP
      ? QUIZ_BOOKED_STEP
      : resolveGuardedQuizStep(answers, resumeStep, steps);
  const currentIdx = steps.indexOf(stepId);
  const gapScreen = showGapScreen(answers);

  useEffect(() => {
    if (lastStep !== stepId) setLastStep(stepId);
  }, [stepId, lastStep, setLastStep]);

  useEffect(() => {
    if (resumeStep !== requestedStep) {
      router.replace(planBuilderStepHref(resumeStep, search));
      return;
    }
    const reqIdx = steps.indexOf(requestedStep);
    const guardIdx = steps.indexOf(stepId);
    if (reqIdx >= 0 && guardIdx >= 0 && reqIdx > guardIdx) {
      router.replace(planBuilderStepHref(stepId, search));
    } else if (reqIdx < 0 && stepId !== requestedStep) {
      router.replace(planBuilderStepHref(stepId, search));
    }
  }, [stepId, requestedStep, resumeStep, router, search, steps]);

  useQuizAnalytics(stepId, currentIdx, answers, gapScreen);
  useQuizAvailabilityPrefetch(stepId);

  function goTo(id: string) {
    router.replace(planBuilderStepHref(id, search));
  }

  function advanceAfterAnswer(pending: Partial<QuizAnswers>) {
    const merged = { ...answers, ...pending };
    const routeSteps = getSteps(merged);
    const idx = routeSteps.indexOf(stepId);
    if (idx >= 0 && idx < routeSteps.length - 1) {
      goTo(routeSteps[idx + 1]);
    }
  }

  function next() {
    advanceAfterAnswer({});
  }

  function back() {
    const idx = steps.indexOf(stepId);
    if (idx > 0) goTo(steps[idx - 1]);
    else router.back();
  }

  function setQ(key: string, value?: string) {
    dispatch({ type: 'SET_Q', key, value });
  }

  function toggleQ(key: string, id: string) {
    dispatch({ type: 'TOGGLE_Q', key, id });
  }

  function setQAndAdvance(key: string, value?: string, extra?: Partial<QuizAnswers>) {
    dispatch({ type: 'SET_Q', key, value });
    if (extra) {
      for (const [k, v] of Object.entries(extra)) {
        if (v !== undefined) dispatch({ type: 'SET_Q', key: k, value: v as string });
      }
    }
    if (key === 'qWho' && value === 'child') {
      captureParentConfirmed(value);
    }
    const pending = { [key]: value, ...extra };
    setTimeout(() => advanceAfterAnswer(pending), 120);
  }

  const a = answers;
  const qWho = a.qWho ?? 'child';

  let stepContent;
  switch (stepId) {
    case 'q-who':
      stepContent = <QFQWho value={a.qWho} onSelect={(v: string) => setQAndAdvance('qWho', v)} onBack={back} />;
      break;
    case 'q-score-lower':
      stepContent = (
        <QFQScoreLower
          value={a.qScoreLower}
          qWho={a.qWho}
          onSelect={(v: string) => setQAndAdvance('qScoreLower', v)}
          onBack={back}
        />
      );
      break;
    case 'q1':  stepContent = <QFQ1Trigger   value={a.q1} onSelect={(v: string) => setQAndAdvance('q1', v)} onBack={back} />; break;
    case 'q2':  stepContent = <QFQ2Stakes    value={a.q2} qWho={qWho} onSelect={(v: string) => setQAndAdvance('q2', v)} onBack={back} />; break;
    case 'q3':
      stepContent = (
        <QFQ3TimesTaken
          value={a.q3}
          qWho={qWho}
          onSelect={(v: string) => {
            setQAndAdvance('q3', v, v === 'none' ? { q4: 'na' } : undefined);
          }}
          onBack={back}
        />
      );
      break;
    case 'hit-q3-none':
      stepContent = (
        <QFInsightHit
          hit={educationHitQ3None(qWho)}
          onContinue={next}
          onBack={back}
          stepIdx={6}
        />
      );
      break;
    case 'q4':  stepContent = <QFQ4RecentScore value={a.q4} qWho={qWho} onSelect={(v: string) => setQAndAdvance('q4', v)} onBack={back} q3={a.q3} />; break;
    case 'q-doubts': stepContent = <QFQDoubts value={a.qDoubts} onToggle={(id: string) => toggleQ('qDoubts', id)} onContinue={next} onBack={back} />; break;
    case 'doubts-insight': stepContent = <QFIDoubtsInsight onContinue={next} onBack={back} qDoubts={a.qDoubts} />; break;
    case 'q5':  stepContent = <QFQ5Clock     value={a.q5} qWho={qWho} onSelect={(v: string) => setQAndAdvance('q5', v)} onBack={back} />; break;
    case 'hit-q5-tbd':
      stepContent = (
        <QFInsightHit
          hit={educationHitQ5Tbd(qWho)}
          onContinue={next}
          onBack={back}
          stepIdx={8}
        />
      );
      break;
    case 'q6':  stepContent = <QFQ6Blocker   value={a.q6} qWho={qWho} onToggle={(id: string) => toggleQ('q6', id)} onContinue={next} onBack={back} />; break;
    case 'q7':  stepContent = <QFQ7Tried     value={a.q7} qWho={qWho} onToggle={(id: string) => toggleQ('q7', id)} onContinue={next} onBack={back} q3={a.q3} />; break;
    case 'hit-q7':
      stepContent = (
        <QFInsightHit
          hit={prepFailureInsight(a.q7, a.q6, qWho)}
          onContinue={next}
          onBack={back}
          stepIdx={9}
          manual
        />
      );
      break;
    case 'i-compare': stepContent = <QFIComparePrep onContinue={next} onBack={back} q7={a.q7} qWho={qWho} />; break;
    case 'i-diag': stepContent = <QFIDiagnosis onContinue={next} onBack={back} q3={a.q3} q4={a.q4} q6={a.q6} q7={a.q7} q5={a.q5} qWho={qWho} />; break;
    case 'i-steps': stepContent = <QFISteps onContinue={next} onBack={back} qWho={qWho} />; break;
    case 'hit-outcome-month-one':
      stepContent = <QFIHopeScreen onContinue={next} onBack={back} q5={a.q5} qWho={qWho} />;
      break;
    case 'i2':  stepContent = <QFI2Compute   onContinue={next} onBack={back} q2={a.q2} q4={a.q4} q5={a.q5} q6={a.q6} q7={a.q7} q8={a.q8} q9={a.q9} name={a.kidName} />; break;
    case 'q8':  stepContent = <QFQ8Goal      value={a.q8} qWho={qWho} onSelect={(v: string) => setQAndAdvance('q8', v)} onBack={back} />; break;
    case 'hit-q8-scores':
      stepContent = (
        <QFInsightHit
          hit={educationHitQ8Scores(a.q2, qWho)}
          onContinue={next}
          onBack={back}
          stepIdx={12}
        />
      );
      break;

    case 'q9':  stepContent = <QFQ9GPA       value={a.q9} qWho={qWho} onSelect={(v: string) => setQAndAdvance('q9', v)} onBack={back} />; break;
    case 'i-gap': stepContent = <QFIGPAGap   onContinue={next} onBack={back} q4={a.q4} q9={a.q9} qWho={qWho} />; break;
    case 'name':
      stepContent = (
        <QFQName
          value={a.kidName}
          qWho={qWho}
          onChange={(v: string) => dispatch({ type: 'SET_FIELD', key: 'kidName', value: v })}
          onContinue={next}
          onBack={back}
        />
      );
      break;
    case 'achievability':
    case 'reveal':
    case 's1':
      stepContent = (
        <QFSPlanReveal
          answers={a}
          onContinue={next}
          onBack={back}
          onEditAnswer={(key: string, value: string) =>
            dispatch({ type: 'SET_Q', key, value })
          }
        />
      );
      break;
    case 'v1':  stepContent = <QFV1Projection onContinue={next} onBack={back} answers={a} />; break;
    case 's4':
      stepContent = (
        <QFS4PlanHandoff
          onContinue={next}
          onBack={back}
          answers={a}
          ctaLabel={PLAN_HANDOFF_CTA}
        />
      );
      break;
    case 's5':
      stepContent = (
        <QFS5Approved
          onContinue={next}
          onBack={back}
          answers={a}
          dispatch={dispatch as (action: { type: string; key?: string; value?: unknown }) => void}
          onBooked={() => goTo('booked')}
        />
      );
      break;
    case 'booked':
      stepContent = <QFS9ThankYou onDone={() => router.push('/')} answers={a} />;
      break;
    default:
      stepContent = <QFQWho value={a.qWho} onSelect={(v: string) => setQAndAdvance('qWho', v)} onBack={back} />;
  }

  return (
    <QFProgressProvider index={Math.max(0, currentIdx)} total={steps.length}>
      {stepContent}
    </QFProgressProvider>
  );
}
