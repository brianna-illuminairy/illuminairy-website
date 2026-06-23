'use client';

import { useMemo, useState } from 'react';
import { QFScreen, QFButton } from '@/app/quiz/components/QFShell';
import {
  PLAN_B_TARGET_SCHOOLS_HEADLINE,
  PLAN_B_TARGET_SCHOOLS_OTHER,
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
      <div className="qfb-target-schools-screen">
        <h1 className="qfb-target-schools-screen__headline">{PLAN_B_TARGET_SCHOOLS_HEADLINE}</h1>

        <div className="qfb-target-schools" role="group" aria-label="Target schools">
          {market.schools.map((school) => {
            const selected = value.includes(school.id) && !otherSelected;
            return (
              <button
                key={school.id}
                type="button"
                className={`qfb-target-schools__btn${selected ? ' is-selected' : ''}`}
                aria-pressed={selected}
                onClick={() => toggle(school.id)}
              >
                <span className="qfb-target-schools__check" aria-hidden="true">
                  {selected ? '✓' : ''}
                </span>
                <span>{school.name}</span>
              </button>
            );
          })}
          <button
            type="button"
            className={`qfb-target-schools__btn qfb-target-schools__btn--other${otherSelected ? ' is-selected' : ''}`}
            aria-pressed={otherSelected}
            onClick={() => toggle(TARGET_SCHOOL_OTHER_ID)}
          >
            <span className="qfb-target-schools__check" aria-hidden="true">
              {otherSelected ? '✓' : ''}
            </span>
            <span>{PLAN_B_TARGET_SCHOOLS_OTHER}</span>
          </button>
        </div>
      </div>
    </QFScreen>
  );
}
