'use client';
import { useEffect, useState } from 'react';
import { QFScreen, QFButton } from './QFShell';
import { INSIGHT_HIT_EYEBROW } from '@/lib/quiz-funnel/insight-hits';

function InsightLine({ parts }) {
  return (
    <p className="qf-insight-hit__line">
      {parts.map((part, i) =>
        part.em ? (
          <em key={i}>{part.text}</em>
        ) : (
          <span key={i}>{part.text}</span>
        )
      )}
    </p>
  );
}

const DEFAULT_AUTO_MS = 6000;
const AUTO_MS_MIN = 5500;
const AUTO_MS_MAX = 10000;
const AUTO_MS_BASE = 3800;
const AUTO_MS_PER_CHAR = 32;

function hitCharacterCount(hit) {
  if (!hit) return 0;
  const parts = [...(hit.parts ?? []), ...(hit.followUp ?? [])];
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
      <div className={`qf-insight-hit${hit.image ? ' qf-insight-hit--visual' : ''}`}>
        <span className={`qf-insight-hit__eyebrow qf-insight-hit__eyebrow--${hit.type}`}>
          {INSIGHT_HIT_EYEBROW[hit.type]}
        </span>
        {hit.image ? (
          <div className="qf-insight-hit__visual">
            <img src={hit.image.src} alt={hit.image.alt} />
          </div>
        ) : null}
        <InsightLine parts={hit.parts} />
        {hit.followUp?.length ? (
          <div className="qf-insight-hit__follow-up">
            <InsightLine parts={hit.followUp} />
          </div>
        ) : null}
      </div>
    </QFScreen>
  );
}
