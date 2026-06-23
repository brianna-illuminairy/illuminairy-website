'use client';

import { useState } from 'react';
import { QFScreen, QFButton } from '@/app/quiz/components/QFShell';

type Props = {
  kidName: string;
  onAck: () => void;
  onBack: () => void;
};

export function SrPrepCb({ kidName, onAck, onBack }: Props) {
  const [checked, setChecked] = useState(false);
  const displayName = kidName.trim() || 'your student';

  return (
    <QFScreen
      stepIdx={11}
      onBack={onBack}
      showProgress={false}
      actions={
        <QFButton kind="forest" onClick={onAck} disabled={!checked}>
          Continue
        </QFButton>
      }
    >
      <div className="gap-22">
        <div>
          <p className="qf-meta" style={{ color: 'var(--qf-forest)', marginBottom: 8 }}>
            Before the call
          </p>
          <h1 className="qf-h1">Make sure {displayName} is ready to join.</h1>
          <p className="qf-lead" style={{ marginTop: 12 }}>
            The expert will walk through their College Board score report on the call. Your student
            should join with their login ready.
          </p>
        </div>

        <ul className="qf-card gap-10" style={{ padding: 18, listStyle: 'none', margin: 0 }}>
          <li>College Board account login (username and password)</li>
          <li>Most recent SAT score report open, or ready to screen-share</li>
          <li>Laptop or tablet in a quiet spot for the call</li>
        </ul>

        <label className="qfb-claim-check">
          <input type="checkbox" checked={checked} onChange={(e) => setChecked(e.target.checked)} />
          <span>
            I will make sure {displayName} knows their College Board login before the call.
          </span>
        </label>
      </div>
    </QFScreen>
  );
}
