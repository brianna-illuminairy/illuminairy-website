'use client';

import { QFScreen, QFOption } from '@/app/quiz/components/QFShell';
import {
  PLAN_B_SCHOOL_REFERRAL_HEADLINE,
  PLAN_B_SCHOOL_TRUST_BODY,
  PLAN_B_SCHOOL_TRUST_TITLE,
} from '@/lib/quiz-funnel-b/school-referral-copy';

type Props = {
  value?: string;
  onSelect: (value: string) => void;
  onBack: () => void;
};

export function BSchoolReferral({ value, onSelect, onBack }: Props) {
  return (
    <QFScreen stepIdx={12} onBack={onBack}>
      <div className="gap-22">
        <div>
          <p className="qf-meta" style={{ color: 'var(--qf-forest)', marginBottom: 8 }}>
            Quick check
          </p>
          <h1 className="qf-h1">{PLAN_B_SCHOOL_REFERRAL_HEADLINE}</h1>
        </div>

        <div className="gap-10">
          <QFOption selected={value === 'yes'} onClick={() => onSelect('yes')}>
            Yes, a counselor or teacher sent me
          </QFOption>
          <QFOption selected={value === 'no'} onClick={() => onSelect('no')}>
            No, I found Illuminairy another way
          </QFOption>
        </div>

        <div className="qfb-school-trust qf-card">
          <p className="qfb-school-trust__title">
            <span className="qfb-school-trust__icon" aria-hidden="true">
              💡
            </span>
            {PLAN_B_SCHOOL_TRUST_TITLE}
          </p>
          <p className="qfb-school-trust__body">{PLAN_B_SCHOOL_TRUST_BODY}</p>
          <p className="qfb-school-trust__school">Highland Park High School</p>
        </div>
      </div>
    </QFScreen>
  );
}
