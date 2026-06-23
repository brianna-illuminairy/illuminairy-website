'use client';

import { QFScreen, QFOption } from '@/app/quiz/components/QFShell';

type Props = {
  value?: string;
  onSelect: (value: string) => void;
  onBack: () => void;
};

export function SrSchoolReferral({ value, onSelect, onBack }: Props) {
  return (
    <QFScreen stepIdx={6} onBack={onBack}>
      <div className="gap-22">
        <div>
          <p className="qf-meta" style={{ color: 'var(--qf-forest)', marginBottom: 8 }}>
            Quick check
          </p>
          <h1 className="qf-h1">Were you referred by your child&apos;s school?</h1>
        </div>
        <div className="gap-10">
          <QFOption selected={value === 'yes'} onClick={() => onSelect('yes')}>
            Yes, a counselor or teacher sent me
          </QFOption>
          <QFOption selected={value === 'no'} onClick={() => onSelect('no')}>
            No, I found Illuminairy another way
          </QFOption>
        </div>
      </div>
    </QFScreen>
  );
}
