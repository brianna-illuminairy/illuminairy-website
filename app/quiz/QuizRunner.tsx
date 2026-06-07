'use client'; // @ts-nocheck
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuiz, showGapScreen, type QuizAnswers } from './state';
import { useQuizAnalytics } from './useQuizAnalytics';
import { useQuizAvailabilityPrefetch } from './useQuizAvailabilityPrefetch';
import { captureParentConfirmed } from '@/lib/quiz-funnel/analytics';
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

const BASE_STEPS = [
  'q-who','q-score-lower','q1','q2','q3',
  'i-steps',
  'q4','q-doubts','q5',
  'hit-outcome-month-one',
  'q6','q7','hit-q7',
  'i-diag',
  'i-compare',
  'q8','achievability','q9',
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

  const requestedStep = params.get('step') || QUIZ_ENTRY_STEP;
  const steps = getSteps(answers);
  const stepId = resolveGuardedQuizStep(answers, requestedStep, steps);
  const currentIdx = steps.indexOf(stepId);
  const gapScreen = showGapScreen(answers);

  useEffect(() => {
    if (!hydrated) return;
    if (stepId !== requestedStep) {
      router.replace(`/quiz?step=${stepId}`);
    }
  }, [hydrated, stepId, requestedStep, router]);

  useQuizAnalytics(stepId, currentIdx, answers, gapScreen);
  useQuizAvailabilityPrefetch(stepId);

  function goTo(id: string) {
    router.replace(`/quiz?step=${id}`);
  }

  function advanceAfterAnswer(pending: Partial<QuizAnswers>) {
    const merged = { ...answers, ...pending };
    const routeSteps = getSteps(merged);
    const idx = routeSteps.indexOf(stepId);
    if (idx < routeSteps.length - 1) goTo(routeSteps[idx + 1]);
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

  switch (stepId) {
    case 'q-who':
      return <QFQWho value={a.qWho} onSelect={(v: string) => setQAndAdvance('qWho', v)} onBack={back} />;
    case 'q-score-lower':
      return (
        <QFQScoreLower
          value={a.qScoreLower}
          qWho={a.qWho}
          onSelect={(v: string) => setQAndAdvance('qScoreLower', v)}
          onBack={back}
        />
      );
    case 'q1':  return <QFQ1Trigger   value={a.q1} onSelect={(v: string) => setQAndAdvance('q1', v)} onBack={back} />;
    case 'q2':  return <QFQ2Stakes    value={a.q2} qWho={qWho} onSelect={(v: string) => setQAndAdvance('q2', v)} onBack={back} />;
    case 'q3':
      return (
        <QFQ3TimesTaken
          value={a.q3}
          qWho={qWho}
          onSelect={(v: string) => {
            setQAndAdvance('q3', v, v === 'none' ? { q4: 'na' } : undefined);
          }}
          onBack={back}
        />
      );
    case 'hit-q3-none':
      return (
        <QFInsightHit
          hit={educationHitQ3None()}
          onContinue={next}
          onBack={back}
          stepIdx={6}
        />
      );
    case 'q4':  return <QFQ4RecentScore value={a.q4} qWho={qWho} onSelect={(v: string) => setQAndAdvance('q4', v)} onBack={back} q3={a.q3} />;
    case 'q-doubts': return <QFQDoubts value={a.qDoubts as any} onToggle={(id: string) => toggleQ('qDoubts', id)} onContinue={next} onBack={back} />;
    case 'doubts-insight': return <QFIDoubtsInsight onContinue={next} onBack={back} qDoubts={a.qDoubts as any} />;
    case 'q5':  return <QFQ5Clock     value={a.q5} qWho={qWho} onSelect={(v: string) => setQAndAdvance('q5', v)} onBack={back} />;
    case 'hit-q5-tbd':
      return (
        <QFInsightHit
          hit={educationHitQ5Tbd()}
          onContinue={next}
          onBack={back}
          stepIdx={8}
        />
      );
    case 'q6':  return <QFQ6Blocker   value={a.q6 as any} qWho={qWho} onToggle={(id: string) => toggleQ('q6', id)} onContinue={next} onBack={back} />;
    case 'q7':  return <QFQ7Tried     value={a.q7 as any} qWho={qWho} onToggle={(id: string) => toggleQ('q7', id)} onContinue={next} onBack={back} q3={a.q3} />;
    case 'hit-q7':
      return (
        <QFInsightHit
          hit={prepFailureInsight(a.q7, a.q6)}
          onContinue={next}
          onBack={back}
          stepIdx={9}
          manual
        />
      );
    case 'i-compare': return <QFIComparePrep onContinue={next} onBack={back} q7={a.q7 as any} />;
    case 'i-diag': return <QFIDiagnosis onContinue={next} onBack={back} q3={a.q3} q4={a.q4} q6={a.q6 as any} q7={a.q7 as any} q5={a.q5} />;
    case 'i-steps': return <QFISteps onContinue={next} onBack={back} />;
    case 'hit-outcome-month-one':
      return <QFIHopeScreen onContinue={next} onBack={back} q5={a.q5} />;
    case 'i2':  return <QFI2Compute   onContinue={next} onBack={back} q2={a.q2} q4={a.q4} q5={a.q5} q6={a.q6} q7={a.q7 as any} q8={a.q8} q9={a.q9} name={a.kidName as string} />;
    case 'q8':  return <QFQ8Goal      value={a.q8} qWho={qWho} onSelect={(v: string) => setQAndAdvance('q8', v)} onBack={back} />;
    case 'hit-q8-scores':
      return (
        <QFInsightHit
          hit={educationHitQ8Scores(a.q2, qWho)}
          onContinue={next}
          onBack={back}
          stepIdx={12}
        />
      );

    case 'q9':  return <QFQ9GPA       value={a.q9} qWho={qWho} onSelect={(v: string) => setQAndAdvance('q9', v)} onBack={back} />;
    case 'i-gap': return <QFIGPAGap   onContinue={next} onBack={back} q4={a.q4} q9={a.q9} />;
    case 'name':
      return (
        <QFQName
          value={a.kidName as string}
          qWho={qWho}
          onChange={(v: string) => dispatch({ type: 'SET_FIELD', key: 'kidName', value: v })}
          onContinue={next}
          onBack={back}
        />
      );
    case 'achievability':
    case 'reveal': // deprecated alias for old deep links + share page
    case 's1':
      return <QFSPlanReveal answers={a} onContinue={next} onBack={back} />;
    case 'v1':  return <QFV1Projection onContinue={next} onBack={back} answers={a} />;
    case 's4':
      return (
        <QFS4PlanHandoff
          onContinue={next}
          onBack={back}
          answers={a}
          ctaLabel={PLAN_HANDOFF_CTA}
        />
      );
    case 's5':
      return (
        <QFS5Approved
          onContinue={next}
          onBack={back}
          answers={a}
          dispatch={dispatch as (action: { type: string; key?: string; value?: unknown }) => void}
          onBooked={() => goTo('booked')}
        />
      );
    case 's7':
      return <QFS7PlanDetails onContinue={() => goTo('s5')} onBack={back} answers={a} />;
    case 's9':
      return (
        <QFS9Booking
          onBooked={() => goTo('booked')}
          onBack={back}
          answers={a}
          dispatch={dispatch as (action: { type: string; key?: string; value?: unknown }) => void}
        />
      );
    case 'booked':
      return <QFS9ThankYou onDone={() => router.push('/')} answers={a} />;
    default:    return <QFQWho value={a.qWho} onSelect={(v: string) => setQAndAdvance('qWho', v)} onBack={back} />;
  }
}
