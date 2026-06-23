'use client';

import { BadgeCheck, Clock, FileText, Users } from 'lucide-react';
import { QFScreen, QFButton } from '@/app/quiz/components/QFShell';
import {
  PLAN_B_CLAIM_CHECKBOX_COMMITMENT,
  PLAN_B_CLAIM_CHECKBOX_PREFIX,
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

const SNAPSHOT_ICONS = {
  users: Users,
  clock: Clock,
  file: FileText,
  badge: BadgeCheck,
} as const;

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
        <div className="qfb-claim-hero">
          <div className="qfb-claim-hero__intro">
            <p className="qf-meta qfb-claim__eyebrow">{PLAN_B_CLAIM_EYEBROW}</p>
            <h1 className="qfb-claim__headline">{PLAN_B_CLAIM_HEADLINE}</h1>
          </div>

          <div className="qfb-claim-snapshot">
            <p className="qfb-claim-snapshot__label">{PLAN_B_CLAIM_SNAPSHOT_LABEL}</p>
            <ul className="qfb-claim-snapshot__list">
              {PLAN_B_CLAIM_SNAPSHOT_ITEMS.map((item) => {
                const Icon = SNAPSHOT_ICONS[item.icon];
                return (
                  <li key={item.label} className="qfb-claim-snapshot__item">
                    <span className="qfb-claim-snapshot__icon" aria-hidden="true">
                      <Icon size={18} strokeWidth={2} />
                    </span>
                    <span>{item.label}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <label className="qfb-claim-check">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onCheckChange(e.target.checked)}
          />
          <span>
            {PLAN_B_CLAIM_CHECKBOX_PREFIX}{' '}
            <strong>{PLAN_B_CLAIM_CHECKBOX_COMMITMENT}</strong>
          </span>
        </label>
      </div>
    </QFScreen>
  );
}
