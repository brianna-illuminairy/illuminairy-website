'use client';

import { QFScreen, QFOption, QFButton } from '@/app/quiz/components/QFShell';

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

export const SR_GRADE_OPTIONS = [
  { id: '9', label: '9th grade' },
  { id: '10', label: '10th grade' },
  { id: '11', label: '11th grade' },
  { id: '12', label: '12th grade' },
  { id: 'graduated', label: 'Graduated high school' },
];

export const SR_SCORE_OPTIONS = [
  { id: 'u1000', label: 'Under 1100' },
  { id: '1100-1200', label: '1100–1200' },
  { id: '1200-1300', label: '1200–1300' },
  { id: '1300-1400', label: '1300–1400' },
  { id: '1400plus', label: '1400+' },
  { id: 'na', label: 'No official SAT yet' },
];

export const SR_PREPARED_OPTIONS = [
  { id: 'khan', label: 'Khan / Bluebook / YouTube' },
  { id: 'group', label: 'In-person group class' },
  { id: 'online', label: 'Online course or class' },
  { id: 'tutor', label: 'Private tutor' },
  { id: 'book', label: 'SAT study book' },
  { id: 'nothing', label: 'Did not study much' },
];

export const SR_TEST_DATE_OPTIONS = [
  { id: 'aug22', label: 'August 22, 2026' },
  { id: 'sept12', label: 'September 12, 2026' },
  { id: 'oct3', label: 'October 3, 2026' },
  { id: 'nov7', label: 'November 7, 2026' },
  { id: 'dec5', label: 'December 5, 2026' },
  { id: 'tbd', label: 'Not sure yet' },
];

export const SR_TARGET_OPTIONS = [
  { id: '1250', label: '1250' },
  { id: '1300', label: '1300' },
  { id: '1350', label: '1350' },
  { id: '1400', label: '1400' },
  { id: '1450', label: '1450+' },
  { id: 'tbd', label: 'Not sure yet' },
];
