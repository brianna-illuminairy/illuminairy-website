'use client';

import { useState } from 'react';
import { QFScreen, QFButton } from '@/app/quiz/components/QFShell';
import { captureScoreReviewLinkShared } from '@/lib/score-review-funnel/analytics';
import { formatReviewCallWhen } from '@/lib/score-review-funnel/thank-you-copy';

type Props = {
  kidName: string;
  callStart?: string;
  shared: boolean;
  onSharedChange: (value: boolean) => void;
  onContinue: () => void;
  onBack: () => void;
};

export function SrShare({
  kidName,
  callStart,
  shared,
  onSharedChange,
  onContinue,
  onBack,
}: Props) {
  const [shareError, setShareError] = useState<string | null>(null);
  const displayName = kidName.trim() || 'your student';
  const whenLine = formatReviewCallWhen(callStart);

  async function handleShare() {
    setShareError(null);
    const text = `${displayName}, your free June SAT Score Review with Illuminairy is booked for ${whenLine}. Join the call with your College Board login ready. Check your email for the calendar invite.`;

    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({ title: 'Illuminairy SAT Score Review', text });
        onSharedChange(true);
        captureScoreReviewLinkShared();
        return;
      } catch {
        setShareError('Share cancelled or unavailable.');
      }
    }

    try {
      await navigator.clipboard.writeText(text);
      onSharedChange(true);
      captureScoreReviewLinkShared();
    } catch {
      setShareError('Could not copy message. You can text them from your phone.');
    }
  }

  return (
    <QFScreen
      stepIdx={12}
      onBack={onBack}
      showProgress={false}
      actions={
        <QFButton kind="forest" onClick={onContinue} disabled={!shared}>
          Done
        </QFButton>
      }
    >
      <div className="gap-22">
        <div>
          <p className="qf-meta" style={{ color: 'var(--qf-forest)', marginBottom: 8 }}>
            One more step
          </p>
          <h1 className="qf-h1">Share the call details with {displayName}.</h1>
          <p className="qf-lead" style={{ marginTop: 12 }}>
            Text them so they know when to join and to have their College Board login ready.
          </p>
        </div>

        <QFButton kind="ghost" onClick={handleShare}>
          {shared ? 'Shared' : 'Share with student'}
        </QFButton>

        {shareError ? (
          <p className="qf-field-error" role="alert">
            {shareError}
          </p>
        ) : null}

        {shared ? (
          <p className="qf-meta" style={{ color: 'var(--qf-forest)' }}>
            Reminder: they need their College Board login on the call.
          </p>
        ) : null}
      </div>
    </QFScreen>
  );
}
