'use client';

import { QFScreen, QFOption, QFButton } from '@/app/quiz/components/QFShell';
export {
  SR_GRADE_OPTIONS,
  SR_SCORE_OPTIONS,
  SR_PREPARED_OPTIONS,
  SR_TEST_DATE_OPTIONS,
  SR_TARGET_OPTIONS,
} from '@/lib/score-review-funnel/intake-options';

type OptionScreenProps = {
  stepIdx: number;
  eyebrow: string;
  title: string;
  hint?: string;
  options: Array<{ id: string; label: string }>;
  value?: string;
  onSelect: (id: string) => void;
  onBack: () => void;
};

export function SrOptionScreen({
  stepIdx,
  eyebrow,
  title,
  hint,
  options,
  value,
  onSelect,
  onBack,
}: OptionScreenProps) {
  return (
    <QFScreen stepIdx={stepIdx} onBack={onBack}>
      <div className="gap-22">
        <div>
          <p className="qf-meta" style={{ color: 'var(--qf-forest)', marginBottom: 8 }}>
            {eyebrow}
          </p>
          <h1 className="qf-h1">{title}</h1>
          {hint ? (
            <p className="qf-lead" style={{ marginTop: 12 }}>
              {hint}
            </p>
          ) : null}
        </div>
        <div className="gap-10">
          {options.map((o) => (
            <QFOption key={o.id} selected={value === o.id} onClick={() => onSelect(o.id)}>
              {o.label}
            </QFOption>
          ))}
        </div>
      </div>
    </QFScreen>
  );
}

type MultiOptionProps = {
  stepIdx: number;
  eyebrow: string;
  title: string;
  options: Array<{ id: string; label: string }>;
  value: string[];
  onToggle: (id: string) => void;
  onContinue: () => void;
  onBack: () => void;
};

export function SrMultiOptionScreen({
  stepIdx,
  eyebrow,
  title,
  options,
  value,
  onToggle,
  onContinue,
  onBack,
}: MultiOptionProps) {
  return (
    <QFScreen
      stepIdx={stepIdx}
      onBack={onBack}
      actions={
        <QFButton kind="forest" onClick={onContinue} disabled={value.length === 0}>
          Continue
        </QFButton>
      }
    >
      <div className="gap-22">
        <div>
          <p className="qf-meta" style={{ color: 'var(--qf-forest)', marginBottom: 8 }}>
            {eyebrow}
          </p>
          <h1 className="qf-h1">{title}</h1>
        </div>
        <div className="gap-10">
          {options.map((o) => (
            <QFOption
              key={o.id}
              multi
              selected={value.includes(o.id)}
              onClick={() => onToggle(o.id)}
            >
              {o.label}
            </QFOption>
          ))}
        </div>
      </div>
    </QFScreen>
  );
}
