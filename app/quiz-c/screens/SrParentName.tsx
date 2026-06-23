'use client';

import { QFScreen, QFButton } from '@/app/quiz/components/QFShell';

type Props = {
  name: string;
  onNameChange: (value: string) => void;
  onContinue: () => void;
  onBack: () => void;
};

export function SrParentName({ name, onNameChange, onContinue, onBack }: Props) {
  return (
    <QFScreen
      stepIdx={8}
      onBack={onBack}
      actions={
        <QFButton kind="forest" onClick={onContinue} disabled={!name.trim()}>
          Continue
        </QFButton>
      }
    >
      <div className="gap-22">
        <div>
          <p className="qf-meta" style={{ color: 'var(--qf-forest)', marginBottom: 8 }}>
            Your name
          </p>
          <h1 className="qf-h1">What should we call you on the call?</h1>
        </div>
        <div className="qf-field">
          <span className="qf-label">First name</span>
          <input
            className="qf-input"
            autoComplete="given-name"
            placeholder="Your first name"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
          />
        </div>
      </div>
    </QFScreen>
  );
}
