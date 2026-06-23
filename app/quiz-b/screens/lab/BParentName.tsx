'use client';

import { useState } from 'react';
import { QFScreen, QFButton } from '@/app/quiz/components/QFShell';

type Props = {
  value: string;
  onChange: (value: string) => void;
  onContinue: () => void;
  onBack: () => void;
};

export function BParentName({ value, onChange, onContinue, onBack }: Props) {
  const [touched, setTouched] = useState(false);
  const valid = value.trim().length >= 2;

  return (
    <QFScreen
      stepIdx={17}
      onBack={onBack}
      actions={
        <QFButton kind="forest" onClick={onContinue} disabled={!valid}>
          Continue
        </QFButton>
      }
    >
      <div className="gap-22">
        <div>
          <h1 className="qf-h1">Your name is…</h1>
        </div>

        <div className="qf-field">
          <span className="qf-label">Parent&apos;s/Guardian&apos;s name</span>
          <input
            className={touched && !valid ? 'qf-input qf-input--invalid' : 'qf-input'}
            autoComplete="name"
            placeholder="First and last"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={() => setTouched(true)}
          />
          {touched && !valid ? (
            <p className="qf-field-error" role="alert">
              Enter parent or guardian name.
            </p>
          ) : null}
        </div>
      </div>
    </QFScreen>
  );
}
