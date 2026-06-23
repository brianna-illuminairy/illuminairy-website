'use client';

import { useState } from 'react';
import { QFScreen, QFButton } from '@/app/quiz/components/QFShell';
import {
  PLAN_B_ZIP_HEADLINE,
  PLAN_B_ZIP_LABEL,
  PLAN_B_ZIP_SUBLINE,
} from '@/lib/quiz-funnel-b/zip-code-copy';

type Props = {
  value: string;
  onChange: (value: string) => void;
  onContinue: () => void;
  onBack: () => void;
};

function isValidZip(raw: string) {
  return /^\d{5}(-\d{4})?$/.test(raw.trim());
}

export function BZipCode({ value, onChange, onContinue, onBack }: Props) {
  const [touched, setTouched] = useState(false);
  const valid = isValidZip(value);

  return (
    <QFScreen
      stepIdx={16}
      onBack={onBack}
      actions={
        <QFButton kind="forest" onClick={onContinue} disabled={!valid}>
          Continue
        </QFButton>
      }
    >
      <div className="gap-22">
        <div>
          <h1 className="qf-h1">{PLAN_B_ZIP_HEADLINE}</h1>
          <p className="qf-lead" style={{ marginTop: 12 }}>
            {PLAN_B_ZIP_SUBLINE}
          </p>
        </div>

        <div className="qf-field">
          <span className="qf-label">{PLAN_B_ZIP_LABEL}</span>
          <input
            className={touched && !valid ? 'qf-input qf-input--invalid' : 'qf-input'}
            inputMode="numeric"
            autoComplete="postal-code"
            placeholder="30309"
            maxLength={10}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={() => setTouched(true)}
          />
          {touched && !valid ? (
            <p className="qf-field-error" role="alert">
              Enter a 5-digit US zip code.
            </p>
          ) : null}
        </div>
      </div>
    </QFScreen>
  );
}
