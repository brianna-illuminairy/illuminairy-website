'use client'; // @ts-nocheck
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuiz, showGapScreen, type QuizAnswers } from './state';
import { useQuizAnalytics } from './useQuizAnalytics';
import { useQuizAvailabilityPrefetch } from './useQuizAvailabilityPrefetch';
import { captureParentConfirmed } from '@/lib/quiz-funnel/analytics';
import { planBuilderStepHref } from '@/lib/plan-builder-routes';
import { QUIZ_ENTRY_STEP, resolveGuardedQuizStep } from '@/lib/quiz-funnel/funnel-steps';
import { isQuizSelfTaker } from '@/lib/quiz-funnel/subject-voice';
import {
  QFQWho, QFQScoreLower, QFQ1Trigger, QFQ2Stakes, QFQ3TimesTaken, QFQ4RecentScore, QFQDoubts, QFQ5Clock,
  QFQ6Blocker, QFQ7Tried, QFQ8Goal, QFQ9GPA, QFQName,
} from './screens/Questions';
import {
  QFI2Compute, QFIGPAGap, QFV1Projection, QFIDiagnosis, QFISteps,
  QFIComparePrep, QFIDoubtsInsight, QFIHopeScreen,
} from './screens/Interstitials';
import { QFInsightHit } from './components/QFInsightHit';
import { prepFailureInsight } from '@/lib/quiz-funnel/prep-failure-copy';
import {
  educationHitQ3None,
  educationHitQ5Tbd,
  educationHitQ8Scores,
} from '@/lib/quiz-funnel/education-slides';
import {
  QFSPlanReveal,
} from './screens/Results';
import {
  QFS4PlanHandoff, QFS5Approved, QFS7PlanDetails, QFS9Booking, QFS9ThankYou,
} from './screens/Finale';
import { PLAN_HANDOFF_CTA } from '@/lib/quiz-funnel/plan-handoff-copy';
import { QFScreen, QFContinueFooter } from './components/QFShell';
import { QFProgressProvider } from './components/QFProgressContext';

function QuizHydratingShell() {
  return (
    <QFScreen stepIdx={0} showBack={false}
      actions={<QFContinueFooter disabled />}
    >
      <p className="qf-lead muted" aria-live="polite" style={{ marginTop: 8 }}>
        Loading your plan…
      </p>
    </QFScreen>
  );
}

const BASE_STEPS = [
  'q-who','q-score-lower','q1','q2','q3',
  'i-steps',
  'q4','q-doubts','q5',
  'hit-outcome-month-one',
  'q6','q7','hit-q7',
  'i-diag',
  'i-compare',
  'q9','q8','achievability',
  'name',
  'i2',
  'v1',
  's4',
  's5',
];

function getSteps(answers: QuizAnswers) {
  const steps = [...BASE_STEPS];

  if (isQuizSelfTaker(answers.qWho)) {
    const qDoubtsIdx = steps.indexOf('q-doubts');
    if (qDoubtsIdx >= 0) steps.splice(qDoubtsIdx, 1);
  }

  if (answers.q3 === 'none') {
    const q4Idx = steps.indexOf('q4');
    if (q4Idx >= 0) steps.splice(q4Idx, 1);
    // "Since their last SAT score…" has no prior score to reference.
    const qDoubtsIdx = steps.indexOf('q-doubts');
    if (qDoubtsIdx >= 0) steps.splice(qDoubtsIdx, 1);
    const q3Idx = steps.indexOf('q3');
    if (q3Idx >= 0) steps.splice(q3Idx + 1, 0, 'hit-q3-none');
  }

  if (Array.isArray(answers.qDoubts) && answers.qDoubts.length > 0) {
    const qDoubtsIdx = steps.indexOf('q-doubts');
    if (qDoubtsIdx >= 0) steps.splice(qDoubtsIdx + 1, 0, 'doubts-insight');
  }

  if (answers.q5 === 'tbd' || answers.q5 === '2027') {
    const q6Idx = steps.indexOf('q6');
    if (q6Idx >= 0) steps.splice(q6Idx, 0, 'hit-q5-tbd');
  }

  if (answers.q8 === 'tbd') {
    const q9Idx = steps.indexOf('q9');
    if (q9Idx >= 0) steps.splice(q9Idx, 0, 'hit-q8-scores');
  }

  if (showGapScreen(answers)) {
    const idx = steps.indexOf('name');
    if (idx >= 0) steps.splice(idx, 0, 'i-gap');
  }

  return steps;
}

export default function QuizRunner() {
  const router = useRouter();
  const params = useSearchParams();
  const { answers, dispatch, hydrated } = useQuiz();
  const search = params.toString();

  const requestedStep = params.get('step') || QUIZ_ENTRY_STEP;
  const steps = getSteps(answers);
  const stepId = resolveGuardedQuizStep(answers, requestedStep, steps);
  const currentIdx = steps.indexOf(stepId);
  const gapScreen = showGapScreen(answers);

  useEffect(() => {
    if (!hydrated) return;
    const reqIdx = steps.indexOf(requestedStep);
    const guardIdx = steps.indexOf(stepId);
    if (reqIdx >= 0 && guardIdx >= 0 && reqIdx > guardIdx) {
      router.replace(planBuilderStepHref(stepId, search));
    } else if (reqIdx < 0 && stepId !== requestedStep) {
      router.replace(planBuilderStepHref(stepId, search));
    }
  }, [hydrated, stepId, requestedStep, router, search, steps]);

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

  if (!hydrated) {
    return (
      <QFProgressProvider index={0} total={steps.length}>
        <QuizHydratingShell />
      </QFProgressProvider>
    );
  }

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
          hit={educationHitQ3None()}
          onContinue={next}
          onBack={back}
          stepIdx={6}
        />
      );
      break;
    case 'q4':  stepContent = <QFQ4RecentScore value={a.q4} qWho={qWho} onSelect={(v: string) => setQAndAdvance('q4', v)} onBack={back} q3={a.q3} />; break;
    case 'q-doubts': stepContent = <QFQDoubts value={a.qDoubts as any} onToggle={(id: string) => toggleQ('qDoubts', id)} onContinue={next} onBack={back} />; break;
    case 'doubts-insight': stepContent = <QFIDoubtsInsight onContinue={next} onBack={back} qDoubts={a.qDoubts as any} />; break;
    case 'q5':  stepContent = <QFQ5Clock     value={a.q5} qWho={qWho} onSelect={(v: string) => setQAndAdvance('q5', v)} onBack={back} />; break;
    case 'hit-q5-tbd':
      stepContent = (
        <QFInsightHit
          hit={educationHitQ5Tbd()}
          onContinue={next}
          onBack={back}
          stepIdx={8}
        />
      );
      break;
    case 'q6':  stepContent = <QFQ6Blocker   value={a.q6 as any} qWho={qWho} onToggle={(id: string) => toggleQ('q6', id)} onContinue={next} onBack={back} />; break;
    case 'q7':  stepContent = <QFQ7Tried     value={a.q7 as any} qWho={qWho} onToggle={(id: string) => toggleQ('q7', id)} onContinue={next} onBack={back} q3={a.q3} />; break;
    case 'hit-q7':
      stepContent = (
        <QFInsightHit
          hit={prepFailureInsight(a.q7, a.q6)}
          onContinue={next}
          onBack={back}
          stepIdx={9}
          manual
        />
      );
      break;
    case 'i-compare': stepContent = <QFIComparePrep onContinue={next} onBack={back} q7={a.q7 as any} />; break;
    case 'i-diag': stepContent = <QFIDiagnosis onContinue={next} onBack={back} q3={a.q3} q4={a.q4} q6={a.q6 as any} q7={a.q7 as any} q5={a.q5} />; break;
    case 'i-steps': stepContent = <QFISteps onContinue={next} onBack={back} />; break;
    case 'hit-outcome-month-one':
      stepContent = <QFIHopeScreen onContinue={next} onBack={back} q5={a.q5} />;
      break;
    case 'i2':  stepContent = <QFI2Compute   onContinue={next} onBack={back} q2={a.q2} q4={a.q4} q5={a.q5} q6={a.q6} q7={a.q7 as any} q8={a.q8} q9={a.q9} name={a.kidName as string} />; break;
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
    case 'i-gap': stepContent = <QFIGPAGap   onContinue={next} onBack={back} q4={a.q4} q9={a.q9} />; break;
    case 'name':
      stepContent = (
        <QFQName
          value={a.kidName as string}
          qWho={qWho}
          onChange={(v: string) => dispatch({ type: 'SET_FIELD', key: 'kidName', value: v })}
          onContinue={next}
          onBack={back}
        />
      );
      break;
    case 'achievability':
    case 'reveal': // deprecated alias for old deep links
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
    case 's7':
      stepContent = <QFS7PlanDetails onContinue={() => goTo('s5')} onBack={back} answers={a} />;
      break;
    case 's9':
      stepContent = (
        <QFS9Booking
          onBooked={() => goTo('booked')}
          onBack={back}
          answers={a}
          dispatch={dispatch as (action: { type: string; key?: string; value?: unknown }) => void}
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
