'use client';

import { QFScreen, QFButton } from '@/app/quiz/components/QFShell';

type Props = {
  email: string;
  onEmailChange: (value: string) => void;
  onContinue: () => void;
  onBack: () => void;
};

export function SrEmailCapture({ email, onEmailChange, onContinue, onBack }: Props) {
  const valid = email.includes('@') && email.includes('.');

  return (
    <QFScreen
      stepIdx={7}
      onBack={onBack}
      actions={
        <QFButton kind="forest" onClick={onContinue} disabled={!valid}>
          Continue
        </QFButton>
      }
    >
      <div className="gap-22">
        <div>
          <p className="qf-meta" style={{ color: 'var(--qf-forest)', marginBottom: 8 }}>
            Almost there
          </p>
          <h1 className="qf-h1">What email should we send the calendar invite to?</h1>
        </div>
        <div className="qf-field">
          <span className="qf-label">Parent email</span>
          <input
            className="qf-input"
            type="email"
            autoComplete="email"
            placeholder="you@email.com"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
          />
        </div>
      </div>
    </QFScreen>
  );
}
