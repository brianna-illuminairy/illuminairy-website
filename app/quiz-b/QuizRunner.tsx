'use client';

import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuiz, type QuizAnswers } from './state';
import { useQuizAnalytics } from './useQuizAnalytics';
import { planBuilderBStepHref } from '@/lib/plan-builder-b-routes';
import {
  QUIZ_BOOKED_STEP,
  QUIZ_ENTRY_STEP,
  canonicalizeQuizStepId,
  resolveGuardedQuizStep,
  resolveQuizResumeStep,
} from '@/lib/quiz-funnel-b/funnel-steps';
import { getLabQuizRouteSteps } from '@/lib/quiz-funnel-b/quiz-route';
import {
  regionIdFromZip,
  regionalUnlockOffer,
} from '@/lib/quiz-funnel-b/regional-schools';
import {
  captureLabComputingPopupAnswered,
  captureParentConfirmed,
  captureQuizStepBack,
} from '@/lib/quiz-funnel-b/analytics';
import {
  QFQWho,
  QFQScoreLower,
  QFQ1Trigger,
  QFQ2Stakes,
  QFQ3TimesTaken,
  QFQ4RecentScore,
  QFQ5Clock,
  QFQ6Blocker,
  QFQ8Goal,
  QFQ9GPA,
} from '@/app/quiz/screens/Questions';
import {
  educationHitQ3None,
  educationHitQ5Tbd,
  educationHitQ8Scores,
} from '@/lib/quiz-funnel/education-slides';
import { QFProgressProvider } from '@/app/quiz/components/QFProgressContext';
import { BSchoolReferral } from '@/app/quiz-b/screens/lab/BSchoolReferral';
import { BStudentGrade } from '@/app/quiz-b/screens/lab/BStudentGrade';

/** One frame so selected option state paints before route change. */
const OPTION_TAP_ADVANCE_MS = 16;

const QFInsightHit = dynamic(
  () => import('@/app/quiz/components/QFInsightHit').then((m) => ({ default: m.QFInsightHit })),
  { ssr: false }
);
const BComputing = dynamic(
  () => import('./screens/lab/BComputing').then((m) => ({ default: m.BComputing })),
  { ssr: false }
);
const BPlanReady = dynamic(
  () => import('./screens/lab/BPlanReady').then((m) => ({ default: m.BPlanReady })),
  { ssr: false }
);
const BEmailCapture = dynamic(
  () => import('./screens/lab/BEmailCapture').then((m) => ({ default: m.BEmailCapture })),
  { ssr: false }
);
const BZipCode = dynamic(
  () => import('./screens/lab/BZipCode').then((m) => ({ default: m.BZipCode })),
  { ssr: false }
);
const BTargetSchools = dynamic(
  () => import('./screens/lab/BTargetSchools').then((m) => ({ default: m.BTargetSchools })),
  { ssr: false }
);
const BRegionalUnlock = dynamic(
  () => import('./screens/lab/BRegionalUnlock').then((m) => ({ default: m.BRegionalUnlock })),
  { ssr: false }
);
const BParentName = dynamic(
  () => import('./screens/lab/BParentName').then((m) => ({ default: m.BParentName })),
  { ssr: false }
);
const BPhoneVerify = dynamic(
  () => import('./screens/lab/BPhoneVerify').then((m) => ({ default: m.BPhoneVerify })),
  { ssr: false }
);
const BClaimLesson = dynamic(
  () => import('./screens/lab/BClaimLesson').then((m) => ({ default: m.BClaimLesson })),
  { ssr: false }
);
const BBookLesson = dynamic(
  () => import('./screens/lab/BBookLesson').then((m) => ({ default: m.BBookLesson })),
  { ssr: false }
);
const BPostDevice = dynamic(
  () => import('./screens/lab/BPostDevice').then((m) => ({ default: m.BPostDevice })),
  { ssr: false }
);
const BPostShare = dynamic(
  () => import('./screens/lab/BPostShare').then((m) => ({ default: m.BPostShare })),
  { ssr: false }
);
const BPostJoinTip = dynamic(
  () => import('./screens/lab/BPostJoinTip').then((m) => ({ default: m.BPostJoinTip })),
  { ssr: false }
);
const BBookedRedirect = dynamic(
  () => import('./screens/lab/BBookedRedirect').then((m) => ({ default: m.BBookedRedirect })),
  { ssr: false }
);

function getSteps(answers: QuizAnswers) {
  return getLabQuizRouteSteps(answers);
}

export default function QuizRunner() {
  const router = useRouter();
  const params = useSearchParams();
  const { answers, dispatch, lastStep, setLastStep, hydrated } = useQuiz();
  const search = params.toString();

  const rawStep = params.get('step');
  const requestedStep = canonicalizeQuizStepId(rawStep || QUIZ_ENTRY_STEP);
  const steps = getSteps(answers);
  const resumeStep =
    !rawStep || requestedStep === QUIZ_BOOKED_STEP
      ? resolveQuizResumeStep(answers, steps, lastStep)
      : requestedStep;
  const stepId =
    resumeStep === QUIZ_BOOKED_STEP
      ? QUIZ_BOOKED_STEP
      : resolveGuardedQuizStep(answers, resumeStep, steps);
  const currentIdx = steps.indexOf(stepId);
  const requestedIdx = steps.indexOf(requestedStep);
  const guardedIdx = steps.indexOf(stepId);
  const stepsKey = steps.join('|');

  useEffect(() => {
    if (!hydrated) return;
    if (lastStep !== stepId) setLastStep(stepId);
  }, [hydrated, stepId, lastStep, setLastStep]);

  useEffect(() => {
    if (!hydrated) return;
    if (resumeStep !== requestedStep) {
      router.replace(planBuilderBStepHref(resumeStep, search));
      return;
    }
    if (requestedIdx >= 0 && guardedIdx >= 0 && requestedIdx > guardedIdx) {
      router.replace(planBuilderBStepHref(stepId, search));
    } else if (requestedIdx < 0 && stepId !== requestedStep) {
      router.replace(planBuilderBStepHref(stepId, search));
    }
  }, [hydrated, stepId, requestedStep, resumeStep, router, search, requestedIdx, guardedIdx, stepsKey]);

  useQuizAnalytics(stepId, currentIdx, answers, hydrated);

  function goTo(id: string) {
    router.replace(planBuilderBStepHref(id, search));
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
    if (idx > 0) {
      const toStep = steps[idx - 1];
      captureQuizStepBack({
        from_step: stepId,
        to_step: toStep,
        from_index: idx,
        to_index: idx - 1,
      });
      goTo(toStep);
    } else {
      router.back();
    }
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
    window.setTimeout(() => advanceAfterAnswer(pending), OPTION_TAP_ADVANCE_MS);
  }

  const a = answers;
  const qWho = a.qWho ?? 'child';

  let stepContent;
  switch (stepId) {
    case 'q1-parent-child':
      stepContent = (
        <QFQWho value={a.qWho} onSelect={(v: string) => setQAndAdvance('qWho', v)} onBack={back} />
      );
      break;
    case 'q-grade':
      stepContent = (
        <BStudentGrade
          value={a.qGrade}
          qWho={a.qWho}
          onSelect={(v: string) => setQAndAdvance('qGrade', v)}
          onBack={back}
        />
      );
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
    case 'q1':
      stepContent = (
        <QFQ1Trigger value={a.q1} qWho={qWho} onSelect={(v: string) => setQAndAdvance('q1', v)} onBack={back} />
      );
      break;
    case 'q2':
      stepContent = (
        <QFQ2Stakes value={a.q2} qWho={qWho} onSelect={(v: string) => setQAndAdvance('q2', v)} onBack={back} />
      );
      break;
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
        <QFInsightHit hit={educationHitQ3None(qWho)} onContinue={next} onBack={back} stepIdx={6} />
      );
      break;
    case 'q4':
      stepContent = (
        <QFQ4RecentScore
          value={a.q4}
          qWho={qWho}
          onSelect={(v: string) => setQAndAdvance('q4', v)}
          onBack={back}
          q3={a.q3}
        />
      );
      break;
    case 'q5':
      stepContent = (
        <QFQ5Clock value={a.q5} qWho={qWho} onSelect={(v: string) => setQAndAdvance('q5', v)} onBack={back} />
      );
      break;
    case 'hit-q5-tbd':
      stepContent = (
        <QFInsightHit hit={educationHitQ5Tbd(qWho)} onContinue={next} onBack={back} stepIdx={8} />
      );
      break;
    case 'q6':
      stepContent = (
        <QFQ6Blocker value={a.q6} qWho={qWho} onToggle={(id: string) => toggleQ('q6', id)} onContinue={next} onBack={back} />
      );
      break;
    case 'q8':
      stepContent = (
        <QFQ8Goal value={a.q8} qWho={qWho} onSelect={(v: string) => setQAndAdvance('q8', v)} onBack={back} />
      );
      break;
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
    case 'q9':
      stepContent = (
        <QFQ9GPA value={a.q9} qWho={qWho} onSelect={(v: string) => setQAndAdvance('q9', v)} onBack={back} />
      );
      break;
    case 'q-school-referral':
      stepContent = (
        <BSchoolReferral
          value={a.qSchoolReferral}
          onSelect={(v: string) => setQAndAdvance('qSchoolReferral', v)}
          onBack={back}
        />
      );
      break;
    case 'b-computing':
      stepContent = (
        <BComputing
          onKhanAnswer={(v) => {
            captureLabComputingPopupAnswered({ popup: 'khan', answer: v });
            dispatch({ type: 'SET_FIELD', key: 'bKhanStruggle', value: v });
          }}
          onTutorAnswer={(v) => {
            captureLabComputingPopupAnswered({ popup: 'tutor', answer: v });
            dispatch({ type: 'SET_FIELD', key: 'bSatTutorBefore', value: v });
          }}
          onContinue={next}
          onBack={back}
        />
      );
      break;
    case 'b-plan-ready':
      stepContent = <BPlanReady answers={a} onContinue={next} onBack={back} />;
      break;
    case 'b-email':
      stepContent = (
        <BEmailCapture
          value={a.parentEmail}
          onChange={(v) => dispatch({ type: 'SET_FIELD', key: 'parentEmail', value: v })}
          onContinue={next}
          onBack={back}
        />
      );
      break;
    case 'b-zip':
      stepContent = (
        <BZipCode
          value={a.parentZip}
          onChange={(v) => dispatch({ type: 'SET_FIELD', key: 'parentZip', value: v })}
          onContinue={() => {
            dispatch({ type: 'SET_FIELD', key: 'targetRegionId', value: regionIdFromZip(a.parentZip) });
            next();
          }}
          onBack={back}
        />
      );
      break;
    case 'b-target-schools':
      stepContent = (
        <BTargetSchools
          zip={a.parentZip}
          value={a.targetSchoolIds}
          onChange={(ids) => dispatch({ type: 'SET_FIELD', key: 'targetSchoolIds', value: ids })}
          onContinue={() => {
            const offer = regionalUnlockOffer(a.targetRegionId || regionIdFromZip(a.parentZip));
            dispatch({ type: 'SET_FIELD', key: 'targetRegionId', value: offer.regionId });
            dispatch({ type: 'SET_FIELD', key: 'regionalDiscountCode', value: offer.discountCode });
            dispatch({ type: 'SET_FIELD', key: 'regionalDiscountPct', value: offer.discountPct });
            next();
          }}
          onBack={back}
        />
      );
      break;
    case 'b-regional-unlock':
      stepContent = (
        <BRegionalUnlock
          regionId={a.targetRegionId || regionIdFromZip(a.parentZip)}
          targetSchoolIds={a.targetSchoolIds}
          q5={a.q5}
          onContinue={next}
          onBack={back}
        />
      );
      break;
    case 'b-parent-name':
      stepContent = (
        <BParentName
          value={a.parentName}
          onChange={(v) => dispatch({ type: 'SET_FIELD', key: 'parentName', value: v })}
          onContinue={next}
          onBack={back}
        />
      );
      break;
    case 'b-phone':
      stepContent = (
        <BPhoneVerify
          answers={a}
          phone={a.parentPhone}
          verifiedAt={a.phoneVerifiedAt}
          onPhoneChange={(v) => dispatch({ type: 'SET_FIELD', key: 'parentPhone', value: v })}
          onVerified={(stamp) => dispatch({ type: 'SET_FIELD', key: 'phoneVerifiedAt', value: stamp })}
          onContinue={next}
          onBack={back}
        />
      );
      break;
    case 'b-claim':
      stepContent = (
        <BClaimLesson
          checked={a.claimCommitment}
          onCheckChange={(v) => dispatch({ type: 'SET_FIELD', key: 'claimCommitment', value: v })}
          onContinue={next}
          onBack={back}
        />
      );
      break;
    case 'b-book':
      stepContent = (
        <BBookLesson
          answers={a}
          dispatch={dispatch as (action: { type: string; key?: string; value?: unknown }) => void}
          onBooked={() => goTo('b-post-device')}
          onBack={back}
        />
      );
      break;
    case 'b-post-device':
      stepContent = (
        <BPostDevice
          value={a.devicePreference}
          onSelect={(v) => {
            dispatch({ type: 'SET_FIELD', key: 'devicePreference', value: v });
            void fetch('/api/portal/device', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ devicePreference: v }),
            });
            setTimeout(next, OPTION_TAP_ADVANCE_MS);
          }}
          onBack={back}
        />
      );
      break;
    case 'b-post-share':
      stepContent = (
        <BPostShare
          kidName={a.kidName}
          shared={a.lessonLinkShared}
          onSharedChange={(v) => dispatch({ type: 'SET_FIELD', key: 'lessonLinkShared', value: v })}
          onContinue={() => goTo('b-post-join-tip')}
          onBack={back}
        />
      );
      break;
    case 'b-post-join-tip':
      stepContent = (
        <BPostJoinTip onContinue={() => goTo(QUIZ_BOOKED_STEP)} onBack={back} />
      );
      break;
    case 'booked':
      stepContent = <BBookedRedirect />;
      break;
    default:
      stepContent = (
        <QFQWho value={a.qWho} onSelect={(v: string) => setQAndAdvance('qWho', v)} onBack={back} />
      );
  }

  return (
    <QFProgressProvider index={Math.max(0, currentIdx)} total={steps.length}>
      {stepContent}
    </QFProgressProvider>
  );
}
