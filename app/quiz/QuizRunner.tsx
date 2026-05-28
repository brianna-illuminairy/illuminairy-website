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
import {
  QFS1Summary, QFS2Science, QFS3Stats, QFS4Authority,
} from './screens/Results';
import {
  QFS5Approved, QFS7PlanDetails, QFS9Booking,
} from './screens/Finale';

// Linear step sequence. i-gap is conditional (inserted before s1 when showGapScreen is true).
const BASE_STEPS = [
  'q1','q2','q3','q4','q5',
  'i1',
  'q6','q7',
  'i-compare',
  'i-diag',
  'i-method',
  'i-steps',
  'i2','q8','i3','q9',
  's1',
  'v1',
  's2','s3','s4',
  's5','s7','s9',
];

function getSteps(answers: QuizAnswers) {
  const steps = [...BASE_STEPS];
  if (showGapScreen(answers)) {
    const idx = steps.indexOf('s1');
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
    case 'q3':  return <QFQ3TimesTaken value={a.q3} onSelect={(v: string) => setQAndAdvance('q3', v)} onBack={back} />;
    case 'q4':  return <QFQ4RecentScore value={a.q4} onSelect={(v: string) => setQAndAdvance('q4', v)} onBack={back} />;
    case 'q5':  return <QFQ5Clock     value={a.q5} onSelect={(v: string) => setQAndAdvance('q5', v)} onBack={back} />;
    case 'i1':  return <QFI1Proof     onContinue={next} onBack={back} q2={a.q2} q5={a.q5} />;
    case 'q6':  return <QFQ6Blocker   value={a.q6 as any} onToggle={(id: string) => toggleQ('q6', id)} onContinue={next} onBack={back} />;
    case 'q7':  return <QFQ7Tried     value={a.q7 as any} onToggle={(id: string) => toggleQ('q7', id)} onContinue={next} onBack={back} q3={a.q3} />;
    case 'i-compare': return <QFIComparePrep onContinue={next} onBack={back} q7={a.q7 as any} />;
    case 'i-diag': return <QFIDiagnosis onContinue={next} onBack={back} q4={a.q4} q6={a.q6 as any} q7={a.q7 as any} q5={a.q5} />;
    case 'i-method': return <QFIMethod onContinue={next} onBack={back} q5={a.q5} />;
    case 'i-steps': return <QFISteps onContinue={next} onBack={back} />;
    case 'i2':  return <QFI2Compute   onContinue={next} onBack={back} q4={a.q4} q5={a.q5} q6={a.q6} />;
    case 'q8':  return <QFQ8Goal      value={a.q8} onSelect={(v: string) => setQAndAdvance('q8', v)} onBack={back} />;
    case 'i3':  return <QFI3Bridge    onContinue={next} onBack={back} q5={a.q5} />;
    case 'q9':  return <QFQ9GPA       value={a.q9} onSelect={(v: string) => { setQ('q9', v); setTimeout(next, 120); }} onBack={back} />;
    case 'i-gap': return <QFIGPAGap   onContinue={next} onBack={back} q4={a.q4} q9={a.q9} />;
    case 's1':  return <QFS1Summary   answers={a} onContinue={next} onBack={back} />;
    case 'v1':  return <QFV1Projection onContinue={next} onBack={back} q4={a.q4} q5={a.q5} q8={a.q8} />;
    case 's2':  return <QFS2Science   onContinue={next} onBack={back} q6={a.q6 as any} />;
    case 's3':  return <QFS3Stats     onContinue={next} onBack={back} />;
    case 's4':  return <QFS4Authority onContinue={next} onBack={back} />;
    case 's5':  return <QFS5Approved  onContinue={next} onBack={back} answers={a} dispatch={dispatch as (action: { type: string; key?: string; value?: unknown }) => void} />;
    case 's7':  return <QFS7PlanDetails onContinue={next} onBack={back} />;
    case 's9':  return <QFS9Booking   onComplete={() => goTo('s9')} onBack={back} answers={a} />;
    default:    return <QFQ1Trigger   value={a.q1} onSelect={(v: string) => setQAndAdvance('q1', v)} onBack={back} />;
  }
}
