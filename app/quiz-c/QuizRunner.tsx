'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { commitQuizAnswers, scheduleOptionTapAdvance } from '@/lib/funnel-sibling/option-tap-advance';
import { useQuiz, type QuizAnswers } from './state';
import { useQuizAnalytics } from './useQuizAnalytics';
import { scoreReviewStepHref } from '@/lib/score-review-routes';
import {
  QUIZ_ENTRY_STEP,
  QUIZ_BOOKED_STEP,
  canonicalizeQuizStepId,
  resolveGuardedQuizStep,
  resolveQuizResumeStep,
} from '@/lib/score-review-funnel/funnel-steps';
import { getScoreReviewRouteSteps } from '@/lib/score-review-funnel/quiz-route';
import { captureScoreReviewStepBack } from '@/lib/score-review-funnel/analytics';
import {
  SrOptionScreen,
  SrMultiOptionScreen,
  SR_GRADE_OPTIONS,
  SR_SCORE_OPTIONS,
  SR_PREPARED_OPTIONS,
  SR_TEST_DATE_OPTIONS,
  SR_TARGET_OPTIONS,
} from './screens/IntakeScreens';
import { SrSchoolReferral } from './screens/SrSchoolReferral';
import { SrEmailCapture } from './screens/SrEmailCapture';
import { SrParentName } from './screens/SrParentName';
import { SrPhoneVerify } from './screens/SrPhoneVerify';
import { SrBook } from './screens/SrBook';
import { SrPrepCb } from './screens/SrPrepCb';
import { SrShare } from './screens/SrShare';
import { SrThankYou } from './screens/SrThankYou';
import { QFProgressProvider } from '@/app/quiz/components/QFProgressContext';

function getSteps(answers: QuizAnswers) {
  return getScoreReviewRouteSteps(answers);
}

export default function QuizRunner({ onMounted }: { onMounted?: () => void }) {
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
      router.replace(scoreReviewStepHref(resumeStep, search));
      return;
    }
    if (requestedIdx >= 0 && guardedIdx >= 0 && requestedIdx > guardedIdx) {
      router.replace(scoreReviewStepHref(stepId, search));
    } else if (requestedIdx < 0 && stepId !== requestedStep) {
      router.replace(scoreReviewStepHref(stepId, search));
    }
  }, [hydrated, stepId, requestedStep, resumeStep, router, search, requestedIdx, guardedIdx, stepsKey]);

  useQuizAnalytics(stepId, currentIdx, answers, hydrated);

  useEffect(() => {
    onMounted?.();
  }, [onMounted]);

  function goTo(id: string) {
    router.replace(scoreReviewStepHref(id, search));
  }

  function advanceAfterAnswer(pending: Partial<QuizAnswers>) {
    const merged = { ...answers, ...pending };
    const routeSteps = getSteps(merged);
    const idx = routeSteps.indexOf(stepId);
    if (idx >= 0 && idx < routeSteps.length - 1) {
      goTo(routeSteps[idx + 1]);
    }
  }

  function back() {
    const idx = steps.indexOf(stepId);
    if (idx > 0) {
      const toStep = steps[idx - 1];
      captureScoreReviewStepBack({
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

  function setQAndAdvance(key: string, value: string) {
    commitQuizAnswers({ dispatch, updates: [{ key, value }] });
    scheduleOptionTapAdvance({
      mergedAnswers: { ...answers, [key]: value },
      fromStepId: stepId,
      getRouteSteps: getSteps,
      goTo,
    });
  }

  function toggleQ(key: string, id: string) {
    dispatch({ type: 'TOGGLE_Q', key, id });
  }


  return (
    <QFProgressProvider index={Math.max(0, currentIdx)} total={steps.length}>
      {stepId === 'sr-grade' ? (
        <SrOptionScreen
          stepIdx={1}
          eyebrow="Quick questions"
          title="What grade is your student in?"
          options={SR_GRADE_OPTIONS}
          value={answers.srGrade}
          onSelect={(id) => setQAndAdvance('srGrade', id)}
          onBack={back}
        />
      ) : null}

      {stepId === 'sr-recent-score' ? (
        <SrOptionScreen
          stepIdx={2}
          eyebrow="Their score"
          title="What was their most recent SAT score?"
          hint="June scores count. Pick the closest band."
          options={SR_SCORE_OPTIONS}
          value={answers.srRecentScore}
          onSelect={(id) => setQAndAdvance('srRecentScore', id)}
          onBack={back}
        />
      ) : null}

      {stepId === 'sr-prepared' ? (
        <SrMultiOptionScreen
          stepIdx={3}
          eyebrow="What they tried"
          title="How did they study for the SAT so far?"
          options={SR_PREPARED_OPTIONS}
          value={answers.srPrepared}
          onToggle={(id) => toggleQ('srPrepared', id)}
          onContinue={() => advanceAfterAnswer({})}
          onBack={back}
        />
      ) : null}

      {stepId === 'sr-test-date' ? (
        <SrOptionScreen
          stepIdx={4}
          eyebrow="Timeline"
          title="When is their next SAT?"
          options={SR_TEST_DATE_OPTIONS}
          value={answers.srTestDate}
          onSelect={(id) => setQAndAdvance('srTestDate', id)}
          onBack={back}
        />
      ) : null}

      {stepId === 'sr-target' ? (
        <SrOptionScreen
          stepIdx={5}
          eyebrow="Their goal"
          title="What score do they need for their schools?"
          options={SR_TARGET_OPTIONS}
          value={answers.srTarget}
          onSelect={(id) => setQAndAdvance('srTarget', id)}
          onBack={back}
        />
      ) : null}

      {stepId === 'sr-school-referral' ? (
        <SrSchoolReferral
          value={answers.srSchoolReferral}
          onSelect={(id) => setQAndAdvance('srSchoolReferral', id)}
          onBack={back}
        />
      ) : null}

      {stepId === 'sr-email' ? (
        <SrEmailCapture
          email={answers.parentEmail}
          onEmailChange={(v) => dispatch({ type: 'SET_FIELD', key: 'parentEmail', value: v })}
          onContinue={() => advanceAfterAnswer({})}
          onBack={back}
        />
      ) : null}

      {stepId === 'sr-name' ? (
        <SrParentName
          name={answers.parentName}
          onNameChange={(v) => dispatch({ type: 'SET_FIELD', key: 'parentName', value: v })}
          onContinue={() => advanceAfterAnswer({})}
          onBack={back}
        />
      ) : null}

      {stepId === 'sr-phone' ? (
        <SrPhoneVerify
          phone={answers.parentPhone}
          verifiedAt={answers.phoneVerifiedAt}
          onPhoneChange={(v) => dispatch({ type: 'SET_FIELD', key: 'parentPhone', value: v })}
          onVerified={(stamp) =>
            dispatch({ type: 'SET_FIELD', key: 'phoneVerifiedAt', value: stamp })
          }
          onContinue={() => advanceAfterAnswer({})}
          onBack={back}
        />
      ) : null}

      {stepId === 'sr-book' ? (
        <SrBook
          answers={answers}
          dispatch={dispatch}
          onBooked={() => goTo('sr-prep-cb')}
          onBack={back}
        />
      ) : null}

      {stepId === 'sr-prep-cb' ? (
        <SrPrepCb
          kidName={answers.kidName}
          onAck={() => {
            dispatch({ type: 'SET_FIELD', key: 'cbPrepAck', value: true });
            goTo('sr-share');
          }}
          onBack={back}
        />
      ) : null}

      {stepId === 'sr-share' ? (
        <SrShare
          kidName={answers.kidName}
          callStart={answers.reviewCallStart}
          shared={answers.linkShared}
          onSharedChange={(v) => dispatch({ type: 'SET_FIELD', key: 'linkShared', value: v })}
          onContinue={() => goTo('sr-thank-you')}
          onBack={back}
        />
      ) : null}

      {stepId === 'sr-thank-you' ? (
        <SrThankYou parentName={answers.parentName} callStart={answers.reviewCallStart} />
      ) : null}
    </QFProgressProvider>
  );
}
