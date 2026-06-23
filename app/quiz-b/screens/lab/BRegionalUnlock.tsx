'use client';

import { useEffect, useMemo, useRef } from 'react';
import { QFScreen, QFButton } from '@/app/quiz/components/QFShell';
import {
  planBRegionalUnlockBody,
  planBRegionalUnlockHeadline,
  planBRegionalUnlockOfferLine,
  planBRegionalUnlockPricingForQ5,
} from '@/lib/quiz-funnel-b/regional-unlock-copy';
import {
  regionalUnlockOffer,
  schoolNamesFromIds,
} from '@/lib/quiz-funnel-b/regional-schools';
import { formatPlanBWeeklyPrice } from '@/lib/plan-b/membership-pricing';

type Props = {
  regionId: string;
  targetSchoolIds: string[];
  q5?: string;
  onContinue: () => void;
  onBack: () => void;
};

export function BRegionalUnlock({
  regionId,
  targetSchoolIds,
  q5,
  onContinue,
  onBack,
}: Props) {
  const offer = useMemo(() => regionalUnlockOffer(regionId), [regionId]);
  const tier = useMemo(() => planBRegionalUnlockPricingForQ5(q5), [q5]);
  const schoolNames = useMemo(
    () =>
      targetSchoolIds.includes('other')
        ? []
        : schoolNamesFromIds(regionId, targetSchoolIds),
    [regionId, targetSchoolIds]
  );
  const firedRef = useRef(false);

  useEffect(() => {
    if (firedRef.current) return;
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    firedRef.current = true;
    void import('canvas-confetti').then(({ default: confetti }) => {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.65 } });
    });
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
        <h1 className="qfb-regional-unlock__title">
          {planBRegionalUnlockHeadline(offer.regionLabel, schoolNames)}
        </h1>
        <p className="qfb-regional-unlock__body">{planBRegionalUnlockBody()}</p>
        <div className="qfb-regional-unlock__offer">
          <p className="qfb-regional-unlock__price">
            <span className="qfb-regional-unlock__list">{formatPlanBWeeklyPrice(tier.listWeeklyPrice)}</span>{' '}
            <strong>{formatPlanBWeeklyPrice(tier.chargeWeeklyPrice)}</strong>
          </p>
          <p className="qfb-regional-unlock__code">
            {planBRegionalUnlockOfferLine(offer.regionLabel, tier, offer.discountCode)}
          </p>
        </div>
      </div>
    </QFScreen>
  );
}
