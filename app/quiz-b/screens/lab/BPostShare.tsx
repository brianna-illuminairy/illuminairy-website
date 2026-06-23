'use client';

import { useState } from 'react';
import Image from 'next/image';
import { captureLabLessonLinkShared } from '@/lib/quiz-funnel-b/analytics';
import { QFScreen } from '@/app/quiz/components/QFShell';

/** Gmail inbox mock — Plan B post-book share step. */
export const PLAN_B_GMAIL_WELCOME_IMAGE = '/photos/gmail-welcome-sat-session-link.png';

type Props = {
  kidName: string;
  shared: boolean;
  onSharedChange: (value: boolean) => void;
  onContinue: () => void;
  onBack: () => void;
};

function ShareIcon() {
  return (
    <svg
      className="qfb-post-share__share-icon"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 3v10M12 3l4 4M12 3L8 7M5 10v9a2 2 0 002 2h10a2 2 0 002-2v-9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function BPostShare({ kidName, shared, onSharedChange, onContinue, onBack }: Props) {
  const [shareError, setShareError] = useState<string | null>(null);
  const displayName = kidName.trim() || 'your student';

  async function handleShare() {
    setShareError(null);
    const url = typeof window !== 'undefined' ? window.location.origin : 'https://illuminairy.com';
    const text = `Free SAT lesson booked for ${displayName}. Open your session link: ${url}/portal`;

    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: 'Illuminairy SAT session link',
          text,
          url: `${url}/portal`,
        });
        onSharedChange(true);
        captureLabLessonLinkShared();
        return;
      } catch {
        setShareError('Share cancelled or unavailable.');
      }
    }

    try {
      await navigator.clipboard.writeText(text);
      onSharedChange(true);
      captureLabLessonLinkShared();
    } catch {
      setShareError('Could not copy link. You can share from email instead.');
    }
  }

  function handleNext() {
    onContinue();
  }

  return (
    <QFScreen stepIdx={22} showProgress={false} showBack={false}>
      <div className="qfb-post-share">
        <article className="qfb-post-share__card qf-card">
          <div className="qfb-post-share__band">
            <button
              type="button"
              className="qfb-post-share__close"
              aria-label="Back"
              onClick={onBack}
            >
              ×
            </button>
          </div>

          <figure className="qfb-post-share__figure">
            <Image
              src={PLAN_B_GMAIL_WELCOME_IMAGE}
              alt='Gmail inbox showing an email from Illuminairy with subject "Welcome to Illuminairy: SAT Session Link".'
              width={1200}
              height={900}
              sizes="(min-width: 480px) 420px, 92vw"
              priority
            />
          </figure>

          <div className="qfb-post-share__copy">
            <h1 className="qfb-post-share__title">
              Open the email link on a computer or tablet
            </h1>
            <p className="qfb-post-share__lead">
              We already sent you an email with all the instructions, please check it carefully
            </p>

            <div className="qfb-post-share__or" aria-hidden="true">
              <span>or</span>
            </div>

            <p className="qfb-post-share__secondary">
              You can also share link to another device you are planning to use
            </p>

            <button type="button" className="qfb-post-share__share-btn" onClick={handleShare}>
              {shared ? 'Link shared' : 'Share lesson link'}
              <ShareIcon />
            </button>

            {shareError ? (
              <p className="qf-field-error" role="alert">
                {shareError}
              </p>
            ) : null}
          </div>

          <div className="qfb-post-share__nav">
            <button type="button" className="qfb-post-share__nav-btn qfb-post-share__nav-btn--back" onClick={onBack}>
              ← Back
            </button>
            <button
              type="button"
              className="qfb-post-share__nav-btn qfb-post-share__nav-btn--next"
              onClick={handleNext}
            >
              Next →
            </button>
          </div>
        </article>
      </div>
    </QFScreen>
  );
}
