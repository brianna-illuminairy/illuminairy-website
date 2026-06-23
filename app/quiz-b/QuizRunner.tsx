'use client';

import { useEffect, useRef } from 'react';
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
import { captureParentConfirmed, captureQuizStepBack } from '@/lib/quiz-funnel-b/analytics';
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
import { QFInsightHit } from '@/app/quiz/components/QFInsightHit';
import {
  educationHitQ3None,
  educationHitQ5Tbd,
  educationHitQ8Scores,
} from '@/lib/quiz-funnel/education-slides';
import { QFProgressProvider } from '@/app/quiz/components/QFProgressContext';
import { BSchoolReferral } from './screens/lab/BSchoolReferral';
import { BComputing } from './screens/lab/BComputing';
import { BPlanReady } from './screens/lab/BPlanReady';
import { BEmailCapture } from './screens/lab/BEmailCapture';
import { BZipCode } from './screens/lab/BZipCode';
import { BParentName } from './screens/lab/BParentName';
import { BPhoneVerify } from './screens/lab/BPhoneVerify';
import { BClaimLesson } from './screens/lab/BClaimLesson';
import { BBookLesson } from './screens/lab/BBookLesson';
import { BPostDevice } from './screens/lab/BPostDevice';
import { BPostShare } from './screens/lab/BPostShare';
import { BPostJoinTip } from './screens/lab/BPostJoinTip';
import { BBookedRedirect } from './screens/lab/BBookedRedirect';

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
  const answersRef = useRef(answers);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  useEffect(() => {
    if (!hydrated) return;
    if (lastStep !== stepId) setLastStep(stepId);
  }, [hydrated, stepId, lastStep, setLastStep]);

  useEffect(() => {
    if (!hydrated || stepId !== 'b-email') return;
    if (params.get('oauth_return') !== '1') return;

    let cancelled = false;

    async function finishOAuthReturn() {
      const cleanedSearch = new URLSearchParams(
        search.startsWith('?') ? search.slice(1) : search
      );
      cleanedSearch.delete('oauth_return');
      cleanedSearch.delete('oauth_error');

      let email = '';
      for (let attempt = 0; attempt < 8 && !cancelled; attempt++) {
        try {
          const res = await fetch('/api/funnel-b/oauth', {
            cache: 'no-store',
            credentials: 'same-origin',
          });
          const data = await res.json().catch(() => ({}));
          email = typeof data.email === 'string' ? data.email.trim().toLowerCase() : '';
          if (email.includes('@')) break;
        } catch {
          /* retry */
        }
        await new Promise((resolve) => setTimeout(resolve, 200 * (attempt + 1)));
      }

      if (cancelled) return;

      if (!email.includes('@')) {
        cleanedSearch.set('oauth_error', '1');
        router.replace(planBuilderBStepHref('b-email', cleanedSearch.toString()));
        return;
      }

      dispatch({ type: 'SET_FIELD', key: 'parentEmail', value: email });

      const merged = { ...answersRef.current, parentEmail: email };
      const routeSteps = getSteps(merged);
      const idx = routeSteps.indexOf('b-email');
      const nextStep =
        idx >= 0 && idx < routeSteps.length - 1 ? routeSteps[idx + 1] : 'b-zip';
      router.replace(planBuilderBStepHref(nextStep, cleanedSearch.toString()));
    }

    void finishOAuthReturn();

    return () => {
      cancelled = true;
    };
  }, [hydrated, stepId, params, search, router, dispatch]);

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

  if (!hydrated) {
    return (
      <div className="qf-page" style={{ color: 'var(--qf-ink)' }}>
        <div className="qf-body">
          <div className="qf-body-inner">
            <p className="qf-lead muted">Loading your plan...</p>
          </div>
        </div>
      </div>
    );
  }

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
    setTimeout(() => advanceAfterAnswer(pending), 120);
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
          answers={a}
          onKhanAnswer={(v) => dispatch({ type: 'SET_FIELD', key: 'bKhanStruggle', value: v })}
          onTutorAnswer={(v) => dispatch({ type: 'SET_FIELD', key: 'bSatTutorBefore', value: v })}
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
            setTimeout(next, 120);
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
