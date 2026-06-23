'use client';

import { useEffect, useMemo, useRef } from 'react';
import { QFScreen, QFButton } from '@/app/quiz/components/QFShell';
import {
  planBRegionalUnlockBenefits,
  planBRegionalUnlockIntro,
  planBRegionalUnlockPartnerHeadline,
} from '@/lib/quiz-funnel-b/regional-unlock-copy';
import { regionalUnlockOffer } from '@/lib/quiz-funnel-b/regional-schools';

type Props = {
  regionId: string;
  targetSchoolIds: string[];
  q5?: string;
  onContinue: () => void;
  onBack: () => void;
};

const CONFETTI_COLORS = ['#2f6e47', '#77c89a', '#3e8b5a', '#121a2b', '#d4af3a'];

function fireRegionalConfetti() {
  void import('canvas-confetti').then(({ default: confetti }) => {
    const zIndex = 9999;
    const originY = 0.32;

    confetti({
      particleCount: 90,
      spread: 72,
      startVelocity: 38,
      gravity: 0.9,
      ticks: 220,
      origin: { y: originY },
      colors: CONFETTI_COLORS,
      zIndex,
    });

    window.setTimeout(() => {
      confetti({
        particleCount: 48,
        angle: 58,
        spread: 58,
        origin: { x: 0.08, y: originY + 0.08 },
        colors: CONFETTI_COLORS,
        zIndex,
      });
      confetti({
        particleCount: 48,
        angle: 122,
        spread: 58,
        origin: { x: 0.92, y: originY + 0.08 },
        colors: CONFETTI_COLORS,
        zIndex,
      });
    }, 180);

    const end = Date.now() + 2200;
    const tick = () => {
      confetti({
        particleCount: 2,
        startVelocity: 22,
        spread: 360,
        ticks: 80,
        origin: {
          x: Math.random() * 0.4 + 0.3,
          y: Math.random() * 0.15 + 0.2,
        },
        colors: CONFETTI_COLORS,
        zIndex,
      });
      if (Date.now() < end) {
        window.requestAnimationFrame(tick);
      }
    };
    window.requestAnimationFrame(tick);
  });
}

export function BRegionalUnlock({
  regionId,
  onContinue,
  onBack,
}: Props) {
  const offer = useMemo(() => regionalUnlockOffer(regionId), [regionId]);
  const headline = planBRegionalUnlockPartnerHeadline(offer.regionLabel);
  const benefits = useMemo(
    () => planBRegionalUnlockBenefits(offer.regionLabel),
    [offer.regionLabel],
  );
  const firedRef = useRef(false);

  useEffect(() => {
    if (firedRef.current) return;
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    firedRef.current = true;
    const timer = window.setTimeout(() => {
      fireRegionalConfetti();
    }, 280);

    return () => {
      window.clearTimeout(timer);
      firedRef.current = false;
    };
  }, []);

  return (
    <QFScreen
      stepIdx={18}
      onBack={onBack}
      actions={
        <QFButton kind="forest" onClick={onContinue}>
          Continue
        </QFButton>
      }
    >
      <div className="qfb-regional-unlock">
        <div className="qfb-regional-unlock__card">
          <h1 className="qfb-regional-unlock__title">
            {headline}
            <span className="qfb-regional-unlock__title-emoji" aria-hidden="true">
              {' '}
              🎉
            </span>
          </h1>
          <p className="qfb-regional-unlock__intro">{planBRegionalUnlockIntro()}</p>
          <ul className="qfb-regional-unlock__benefits">
            {benefits.map((item) => (
              <li key={item.text}>
                <span className="qfb-regional-unlock__benefit-check" aria-hidden="true">
                  ✓
                </span>
                <span className={item.emphasize ? 'qfb-regional-unlock__benefit--lead' : undefined}>
                  {item.text}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </QFScreen>
  );
}
