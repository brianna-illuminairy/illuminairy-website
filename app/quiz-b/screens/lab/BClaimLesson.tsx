'use client';

import { QFScreen, QFButton } from '@/app/quiz/components/QFShell';
import {
  PLAN_B_CLAIM_CHECKBOX,
  PLAN_B_CLAIM_CTA,
  PLAN_B_CLAIM_EYEBROW,
  PLAN_B_CLAIM_HEADLINE,
  PLAN_B_CLAIM_SNAPSHOT_ITEMS,
  PLAN_B_CLAIM_SNAPSHOT_LABEL,
} from '@/lib/quiz-funnel-b/claim-lesson-copy';

type Props = {
  checked: boolean;
  onCheckChange: (value: boolean) => void;
  onContinue: () => void;
  onBack: () => void;
};

export function BClaimLesson({ checked, onCheckChange, onContinue, onBack }: Props) {
  return (
    <QFScreen
      stepIdx={19}
      onBack={onBack}
      actions={
        <QFButton kind="forest" onClick={onContinue} disabled={!checked}>
          {PLAN_B_CLAIM_CTA}
        </QFButton>
      }
    >
      <div className="qfb-claim gap-22">
        <div className="qfb-claim__intro">
          <p className="qf-meta qfb-claim__eyebrow">{PLAN_B_CLAIM_EYEBROW}</p>
          <h1 className="qfb-claim__headline">{PLAN_B_CLAIM_HEADLINE}</h1>
        </div>

        <div className="qfb-claim-card qf-card">
          <p className="qfb-claim-card__label">{PLAN_B_CLAIM_SNAPSHOT_LABEL}</p>
          <ul className="qfb-claim-card__list">
            {PLAN_B_CLAIM_SNAPSHOT_ITEMS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <label className="qfb-claim-check">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onCheckChange(e.target.checked)}
          />
          <span>{PLAN_B_CLAIM_CHECKBOX}</span>
        </label>
      </div>
    </QFScreen>
  );
}
