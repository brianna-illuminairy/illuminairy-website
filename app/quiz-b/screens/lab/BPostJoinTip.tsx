'use client';

import { PlanBPortalStage } from '@/components/plan-b/PlanBPortalStage';

type Props = {
  onContinue: () => void;
  onBack: () => void;
};

export function BPostJoinTip({ onContinue, onBack }: Props) {
  return (
    <PlanBPortalStage showSuccessBanner activeTabId="lessons">
      <div className="qfb-post-share">
        <article className="qfb-post-share__card qf-card qfb-post-join-tip">
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

          <div className="qfb-post-join-tip__copy">
            <h1 className="qfb-post-share__title">
              Click &ldquo;Join Lesson&rdquo; 5 minutes before the start
            </h1>
            <p className="qfb-post-share__lead">
              Join lesson button will be active 5 minutes before the lesson, click and wait for
              tutor to join as well
            </p>
          </div>

          <div className="qfb-post-share__nav">
            <button
              type="button"
              className="qfb-post-share__nav-btn qfb-post-share__nav-btn--back"
              onClick={onBack}
            >
              ← Back
            </button>
            <button
              type="button"
              className="qfb-post-share__nav-btn qfb-post-share__nav-btn--next"
              onClick={onContinue}
            >
              Got it! →
            </button>
          </div>
        </article>
      </div>
    </PlanBPortalStage>
  );
}
