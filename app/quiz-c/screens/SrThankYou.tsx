'use client';

import { useEffect } from 'react';
import { QFScreen } from '@/app/quiz/components/QFShell';
import {
  thankYouHeadline,
  formatReviewCallWhen,
  THANK_YOU_REMINDER_LINE,
  thankYouSupportLine,
} from '@/lib/score-review-funnel/thank-you-copy';
import { captureScoreReviewThankYouViewed } from '@/lib/score-review-funnel/analytics';

type Props = {
  parentName: string;
  callStart?: string;
};

export function SrThankYou({ parentName, callStart }: Props) {
  const first = parentName.trim().split(/\s+/)[0] ?? '';

  useEffect(() => {
    captureScoreReviewThankYouViewed();
  }, []);

  return (
    <QFScreen stepIdx={13} showProgress={false}>
      <div className="gap-22">
        <div>
          <p className="qf-meta" style={{ color: 'var(--qf-forest)', marginBottom: 8 }}>
            Confirmed
          </p>
          <h1 className="qf-h1">{thankYouHeadline(first)}</h1>
          <p className="qf-lead" style={{ marginTop: 12 }}>
            {formatReviewCallWhen(callStart)}. Check your email for the calendar invite.
          </p>
        </div>

        <div className="qf-card gap-10" style={{ padding: 18 }}>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5 }}>
            {THANK_YOU_REMINDER_LINE}
          </p>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: 'var(--qf-ink-2)' }}>
            {thankYouSupportLine()}
          </p>
        </div>
      </div>
    </QFScreen>
  );
}
