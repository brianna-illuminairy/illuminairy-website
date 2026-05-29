'use client'; // @ts-nocheck
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuiz, showGapScreen, type QuizAnswers } from './state';
import { useQuizAnalytics } from './useQuizAnalytics';
import {
  QFQ1Trigger, QFQ2Stakes, QFQ3TimesTaken, QFQ4RecentScore, QFQ5Clock,
  QFQ6Blocker, QFQ7Tried, QFQ8Goal, QFQ9GPA,
} from './screens/Questions';
import {
  QFI1Proof, QFI2Compute, QFI3Bridge, QFIGPAGap, QFV1Projection, QFIDiagnosis, QFIMethod, QFISteps,
  QFIComparePrep,
} from './screens/Interstitials';
import { QFInsightHit } from './components/QFInsightHit';
import { prepFailureInsight } from '@/lib/quiz-funnel/prep-failure-copy';
import {
  insightHitAfterQ4,
} from '@/lib/quiz-funnel/insight-hits';
import {
  educationHitQ3None,
  educationHitQ5Tbd,
  educationHitQ5Timing,
  educationHitQ8Scores,
  educationHitOutcomeMonthOne,
} from '@/lib/quiz-funnel/education-slides';
import {
  QFSPlanReveal, QFS2Science, QFS3Stats, QFS4Authority,
} from './screens/Results';
import {
  QFS5Approved, QFS7PlanDetails, QFS9Booking, QFS9ThankYou,
} from './screens/Finale';

const BASE_STEPS = [
  'q1','q2','q3','q4','q5',
  'i1',
  'q6','q7','hit-q7',
  'i-compare',
  'i-diag',
  'i-method',
  'i-steps',
  'i2','q8','i3','q9',
  'reveal',
  'v1',
  's2','s3','s4',
  's5','s7','s9',
];

function getSteps(answers: QuizAnswers) {
  const steps = [...BASE_STEPS];

  if (answers.q3 === 'none') {
    const q4Idx = steps.indexOf('q4');
    if (q4Idx >= 0) steps.splice(q4Idx, 1);
    const q3Idx = steps.indexOf('q3');
    if (q3Idx >= 0) steps.splice(q3Idx + 1, 0, 'hit-q3-none');
  }

  if (answers.q1 === 'gpa-sat') {
    const q5Idx = steps.indexOf('q5');
    if (q5Idx >= 0) steps.splice(q5Idx, 0, 'hit-q4');
  }

  if (answers.q5 === 'tbd') {
    const i1Idx = steps.indexOf('i1');
    if (i1Idx >= 0) steps.splice(i1Idx, 0, 'hit-q5-tbd');
  } else if (answers.q5 === '2027') {
    const i1Idx = steps.indexOf('i1');
    if (i1Idx >= 0) steps.splice(i1Idx, 0, 'hit-q5-timing');
  }

  const iStepsIdx = steps.indexOf('i-steps');
  if (iStepsIdx >= 0) steps.splice(iStepsIdx + 1, 0, 'hit-outcome-month-one');

  if (answers.q8 === 'tbd') {
    const i3Idx = steps.indexOf('i3');
    if (i3Idx >= 0) steps.splice(i3Idx, 0, 'hit-q8-scores');
  }

  if (showGapScreen(answers)) {
    const idx = steps.indexOf('reveal');
    steps.splice(idx, 0, 'i-gap');
  }

  return steps;
}

export default function QuizRunner() {
  const router = useRouter();
  const params = useSearchParams();
  const { answers, dispatch } = useQuiz();

  const stepId = params.get('step') || 'q1';
  const steps = getSteps(answers);
  const currentIdx = steps.indexOf(stepId);
  const gapScreen = showGapScreen(answers);

  useQuizAnalytics(stepId, currentIdx, answers, gapScreen);

  function goTo(id: string) {
    router.replace(`/quiz?step=${id}`);
  }

  function next() {
    const idx = steps.indexOf(stepId);
    if (idx < steps.length - 1) goTo(steps[idx + 1]);
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

  function setQAndAdvance(key: string, value?: string) {
    dispatch({ type: 'SET_Q', key, value });
    setTimeout(next, 120);
  }

  const a = answers;

  switch (stepId) {
    case 'q1':  return <QFQ1Trigger   value={a.q1} onSelect={(v: string) => setQAndAdvance('q1', v)} onBack={back} />;
    case 'q2':  return <QFQ2Stakes    value={a.q2} onSelect={(v: string) => setQAndAdvance('q2', v)} onBack={back} />;
    case 'q3':
      return (
        <QFQ3TimesTaken
          value={a.q3}
          onSelect={(v: string) => {
            if (v === 'none') dispatch({ type: 'SET_Q', key: 'q4', value: 'na' });
            setQAndAdvance('q3', v);
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
          stepIdx={4}
        />
      );
    case 'q4':  return <QFQ4RecentScore value={a.q4} onSelect={(v: string) => setQAndAdvance('q4', v)} onBack={back} q3={a.q3} />;
    case 'hit-q4':
      return (
        <QFInsightHit
          hit={insightHitAfterQ4(a.q1)!}
          onContinue={next}
          onBack={back}
          stepIdx={4}
        />
      );
    case 'q5':  return <QFQ5Clock     value={a.q5} onSelect={(v: string) => setQAndAdvance('q5', v)} onBack={back} />;
    case 'hit-q5-tbd':
      return (
        <QFInsightHit
          hit={educationHitQ5Tbd()}
          onContinue={next}
          onBack={back}
          stepIdx={6}
        />
      );
    case 'hit-q5-timing':
      return (
        <QFInsightHit
          hit={educationHitQ5Timing()}
          onContinue={next}
          onBack={back}
          stepIdx={6}
        />
      );
    case 'i1':  return <QFI1Proof     onContinue={next} onBack={back} q2={a.q2} q3={a.q3} q5={a.q5} />;
    case 'q6':  return <QFQ6Blocker   value={a.q6 as any} onToggle={(id: string) => toggleQ('q6', id)} onContinue={next} onBack={back} />;
    case 'q7':  return <QFQ7Tried     value={a.q7 as any} onToggle={(id: string) => toggleQ('q7', id)} onContinue={next} onBack={back} q3={a.q3} />;
    case 'hit-q7':
      return (
        <QFInsightHit
          hit={prepFailureInsight(a.q7, a.q6)}
          onContinue={next}
          onBack={back}
          stepIdx={7}
          manual
        />
      );
    case 'i-compare': return <QFIComparePrep onContinue={next} onBack={back} q7={a.q7 as any} />;
    case 'i-diag': return <QFIDiagnosis onContinue={next} onBack={back} q3={a.q3} q4={a.q4} q6={a.q6 as any} q7={a.q7 as any} q5={a.q5} />;
    case 'i-method': return <QFIMethod onContinue={next} onBack={back} q5={a.q5} />;
    case 'i-steps': return <QFISteps onContinue={next} onBack={back} />;
    case 'hit-outcome-month-one':
      return (
        <QFInsightHit
          hit={educationHitOutcomeMonthOne()}
          onContinue={next}
          onBack={back}
          stepIdx={11}
        />
      );
    case 'i2':  return <QFI2Compute   onContinue={next} onBack={back} q4={a.q4} q5={a.q5} q6={a.q6} />;
    case 'q8':  return <QFQ8Goal      value={a.q8} onSelect={(v: string) => setQAndAdvance('q8', v)} onBack={back} />;
    case 'hit-q8-scores':
      return (
        <QFInsightHit
          hit={educationHitQ8Scores(a.q2)}
          onContinue={next}
          onBack={back}
          stepIdx={10}
        />
      );
    case 'i3':  return <QFI3Bridge    onContinue={next} onBack={back} q5={a.q5} />;
    case 'q9':  return <QFQ9GPA       value={a.q9} onSelect={(v: string) => { setQ('q9', v); setTimeout(next, 120); }} onBack={back} />;
    case 'i-gap': return <QFIGPAGap   onContinue={next} onBack={back} q4={a.q4} q9={a.q9} />;
    case 'reveal':
    case 's1':
      return <QFSPlanReveal answers={a} onContinue={next} onBack={back} />;
    case 'v1':  return <QFV1Projection onContinue={next} onBack={back} q4={a.q4} q5={a.q5} q8={a.q8} />;
    case 's2':  return <QFS2Science   onContinue={next} onBack={back} q6={a.q6 as any} />;
    case 's3':  return <QFS3Stats     onContinue={next} onBack={back} />;
    case 's4':  return <QFS4Authority onContinue={next} onBack={back} />;
    case 's5':  return <QFS5Approved  onContinue={next} onBack={back} answers={a} dispatch={dispatch as (action: { type: string; key?: string; value?: unknown }) => void} />;
    case 's7':  return <QFS7PlanDetails onContinue={next} onBack={back} answers={a} />;
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
    default:    return <QFQ1Trigger   value={a.q1} onSelect={(v: string) => setQAndAdvance('q1', v)} onBack={back} />;
  }
}
