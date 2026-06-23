'use client';

import { useMemo, useState } from 'react';
import { QFScreen, QFButton } from '@/app/quiz/components/QFShell';
import {
  PLAN_B_TARGET_SCHOOLS_HEADLINE,
  PLAN_B_TARGET_SCHOOLS_OTHER,
  PLAN_B_TARGET_SCHOOLS_SUBLINE,
} from '@/lib/quiz-funnel-b/regional-unlock-copy';
import {
  regionalMarketForZip,
  TARGET_SCHOOL_OTHER_ID,
} from '@/lib/quiz-funnel-b/regional-schools';

type Props = {
  zip: string;
  value: string[];
  onChange: (ids: string[]) => void;
  onContinue: () => void;
  onBack: () => void;
};

export function BTargetSchools({ zip, value, onChange, onContinue, onBack }: Props) {
  const market = useMemo(() => regionalMarketForZip(zip), [zip]);
  const [otherSelected, setOtherSelected] = useState(value.includes(TARGET_SCHOOL_OTHER_ID));

  function toggle(id: string) {
    if (id === TARGET_SCHOOL_OTHER_ID) {
      setOtherSelected(true);
      onChange([TARGET_SCHOOL_OTHER_ID]);
      return;
    }
    setOtherSelected(false);
    const next = value.includes(id)
      ? value.filter((x) => x !== id && x !== TARGET_SCHOOL_OTHER_ID)
      : [...value.filter((x) => x !== TARGET_SCHOOL_OTHER_ID), id];
    onChange(next);
  }

  const canContinue = value.length > 0;

  return (
    <QFScreen
      stepIdx={17}
      onBack={onBack}
      actions={
        <QFButton kind="forest" onClick={onContinue} disabled={!canContinue}>
          Continue
        </QFButton>
      }
    >
      <div className="gap-22">
        <div>
          <h1 className="qf-h1">{PLAN_B_TARGET_SCHOOLS_HEADLINE}</h1>
          <p className="qf-lead" style={{ marginTop: 12 }}>
            {PLAN_B_TARGET_SCHOOLS_SUBLINE}
          </p>
          <p className="qf-hint" style={{ marginTop: 8 }}>
            {market.label} area
          </p>
        </div>

        <div className="qfb-target-schools">
          {market.schools.map((school) => {
            const selected = value.includes(school.id) && !otherSelected;
            return (
              <button
                key={school.id}
                type="button"
                className={`qfb-target-schools__btn${selected ? ' is-selected' : ''}`}
                onClick={() => toggle(school.id)}
              >
                {school.name}
              </button>
            );
          })}
          <button
            type="button"
            className={`qfb-target-schools__btn qfb-target-schools__btn--other${otherSelected ? ' is-selected' : ''}`}
            onClick={() => toggle(TARGET_SCHOOL_OTHER_ID)}
          >
            {PLAN_B_TARGET_SCHOOLS_OTHER}
          </button>
        </div>
      </div>
    </QFScreen>
  );
}
