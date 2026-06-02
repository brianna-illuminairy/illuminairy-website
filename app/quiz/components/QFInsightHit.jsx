'use client';
import { useEffect, useState } from 'react';
import { QFScreen, QFButton } from './QFShell';
import { INSIGHT_HIT_EYEBROW } from '@/lib/quiz-funnel/insight-hits';
import { QFScoreReportPair } from './QFPlanVisuals';
import { OUTCOME_SCORE_CAPTION } from '@/lib/quiz-funnel/score-path-copy';

/** Headlines → .qf-h1; body / follow-up → .qf-lead (same as i-steps, questions, reveal). */
function InsightParts({ parts, variant = 'headline' }) {
  const Tag = variant === 'headline' ? 'h1' : 'p';
  const className = variant === 'headline' ? 'qf-h1' : 'qf-lead';
  return (
    <Tag className={className}>
      {parts.map((part, i) =>
        part.em ? (
          <em key={i}>{part.text}</em>
        ) : (
          <span key={i}>{part.text}</span>
        )
      )}
    </Tag>
  );
}

const DEFAULT_AUTO_MS = 6000;
const AUTO_MS_MIN = 5500;
const AUTO_MS_MAX = 10000;
const AUTO_MS_BASE = 3800;
const AUTO_MS_PER_CHAR = 32;

function hitCharacterCount(hit) {
  if (!hit) return 0;
  const blocks = hit.followUpBlocks?.flat() ?? [];
  const parts = [...(hit.parts ?? []), ...(hit.followUp ?? []), ...blocks];
  return parts.reduce((n, part) => n + (part.text?.length ?? 0), 0);
}

/** Scale dwell time with copy length — short hits stay snappy, long education slides get room. */
function resolveAutoAdvanceMs(hit, autoAdvanceMs) {
  if (autoAdvanceMs == null) return null;
  if (hit?.autoAdvanceMs != null) return hit.autoAdvanceMs;
  const chars = hitCharacterCount(hit);
  return Math.min(
    AUTO_MS_MAX,
    Math.max(AUTO_MS_MIN, AUTO_MS_BASE + chars * AUTO_MS_PER_CHAR)
  );
}

/** Insight / education card — auto-advances unless reduced motion or manual Continue. */
export function QFInsightHit({
  hit,
  onContinue,
  onBack,
  stepIdx = 7,
  autoAdvanceMs = DEFAULT_AUTO_MS,
  manual = false,
}) {
  const [progress, setProgress] = useState(0);

  const reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const duration =
    hit && !manual && !reducedMotion ? resolveAutoAdvanceMs(hit, autoAdvanceMs) : null;

  useEffect(() => {
    if (!hit || duration == null) return;

    let start = performance.now();
    let raf = 0;

    const tick = (now) => {
      const pct = Math.min(100, ((now - start) / duration) * 100);
      setProgress(pct);
      if (pct < 100) {
        raf = requestAnimationFrame(tick);
      } else {
        onContinue();
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [hit, duration, onContinue]);

  if (!hit) return null;

  const showAutoFooter = duration != null;

  return (
    <QFScreen
      stepIdx={stepIdx}
      ornament="glow"
      onBack={onBack}
      footer={
        showAutoFooter ? (
          <div className="qf-insight-hit__auto-footer" aria-hidden="true">
            <div
              className="qf-insight-hit__auto-bar"
              style={{ width: `${progress}%` }}
            />
          </div>
        ) : (
          <QFButton kind="forest" onClick={onContinue}>Continue</QFButton>
        )
      }
    >
      <div className={`qf-insight-hit${hit.image ? ' qf-insight-hit--visual' : ''}${hit.showScoreReports ? ' qf-insight-hit--outcome-proof' : ''}${manual ? ' qf-insight-hit--manual' : ''}`}>
        <span className={`qf-insight-hit__eyebrow qf-insight-hit__eyebrow--${hit.type}`}>
          {INSIGHT_HIT_EYEBROW[hit.type]}
        </span>
        <div className={hit.showScoreReports ? 'qf-insight-hit__copy' : undefined}>
          <InsightParts parts={hit.parts} variant="headline" />
        </div>
        {hit.image ? (
          <div className="qf-insight-hit__visual">
            <img src={hit.image.src} alt={hit.image.alt} />
            {hit.imageCaption?.length ? (
              <p className="qf-lead qf-insight-hit__visual-caption">
                {hit.imageCaption.map((part, i) =>
                  part.em ? (
                    <em key={i}>{part.text}</em>
                  ) : (
                    <span key={i}>{part.text}</span>
                  )
                )}
              </p>
            ) : null}
          </div>
        ) : hit.imageCaption?.length ? (
          <p className="qf-lead qf-insight-hit__visual-caption qf-insight-hit__visual-caption--solo">
            {hit.imageCaption.map((part, i) =>
              part.em ? (
                <em key={i}>{part.text}</em>
              ) : (
                <span key={i}>{part.text}</span>
              )
            )}
          </p>
        ) : null}
        {hit.showScoreReports ? (
          <div className="qf-insight-hit__proof">
            <QFScoreReportPair caption={OUTCOME_SCORE_CAPTION} />
          </div>
        ) : null}
        {hit.followUpBlocks?.length ? (
          <div className="qf-insight-hit__follow-up qf-insight-hit__follow-up--blocks">
            {hit.followUpBlocks.map((block, i) => (
              <InsightParts key={i} parts={block} variant="body" />
            ))}
          </div>
        ) : hit.followUp?.length ? (
          <div className="qf-insight-hit__follow-up">
            <InsightParts parts={hit.followUp} variant="body" />
          </div>
        ) : null}
      </div>
    </QFScreen>
  );
}
