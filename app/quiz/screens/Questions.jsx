'use client'; // @ts-nocheck
import { QFScreen, QFOption, QFButton, QFQuestionHead, QFOptOut, QFWhyWeAsk, QFSingleSelectFooter } from '../components/QFShell';
import { Q2_STAKES_OPTIONS } from '@/lib/quiz-funnel/stakes-copy';
import { DOUBTS_OPTIONS } from '@/lib/quiz-funnel/doubts-copy';
import { NAME_CTA } from '@/lib/quiz-funnel/score-path-copy';
import {
  Q_WHO_OPTIONS,
  Q_SCORE_LOWER_OPTIONS,
  Q_URGENCY_OPTIONS,
  scoreLowerQuestion,
} from '@/lib/quiz-funnel/opening-copy';
import {
  stakesQuestionHtml,
  timesTakenQuestion,
  recentScoreQuestionHtml,
  recentScoreWhyWeAsk,
  nextSatQuestionHtml,
  blockerOptionLabel,
  prepQuestionHtml,
  goalScoreQuestionHtml,
  gpaQuestionHtml,
  gpaWhyWeAsk,
  nameQuestionHtml,
  nameWhyWeAsk,
  stakesOptionLabel,
} from '@/lib/quiz-funnel/subject-voice';

export function QFQWho({ value, onSelect, onBack }) {
  return (
    <QFScreen stepIdx={1} onBack={onBack}
      actions={<QFSingleSelectFooter value={value} onSelect={onSelect} />}
    >
      <QFQuestionHead title="Who needs SAT help?" />
      <div className="qf-options">
        {Q_WHO_OPTIONS.map(o => (
          <QFOption key={o.id} selected={value === o.id} onClick={() => onSelect(o.id)}>{o.label}</QFOption>
        ))}
      </div>
    </QFScreen>
  );
}

export function QFQScoreLower({ value, onSelect, onBack, qWho = 'child' }) {
  return (
    <QFScreen stepIdx={2} onBack={onBack}
      actions={<QFSingleSelectFooter value={value} onSelect={onSelect} />}
    >
      <QFQuestionHead title={scoreLowerQuestion(qWho)} />
      <div className="qf-options">
        {Q_SCORE_LOWER_OPTIONS.map(o => (
          <QFOption key={o.id} selected={value === o.id} onClick={() => onSelect(o.id)}>{o.label}</QFOption>
        ))}
      </div>
    </QFScreen>
  );
}

export function QFQ1Trigger({ value, onSelect, onBack }) {
  return (
    <QFScreen stepIdx={3} onBack={onBack}
      actions={<QFSingleSelectFooter value={value} onSelect={onSelect} />}
    >
      <QFQuestionHead title="What feels most <em>urgent</em> right now?" />
      <div className="qf-options">
        {Q_URGENCY_OPTIONS.map(o => (
          <QFOption key={o.id} selected={value === o.id} onClick={() => onSelect(o.id)}>{o.label}</QFOption>
        ))}
      </div>
    </QFScreen>
  );
}

export function QFQ2Stakes({ value, onSelect, onBack, qWho = 'child' }) {
  return (
    <QFScreen stepIdx={4} onBack={onBack}
      actions={<QFSingleSelectFooter value={value} onSelect={onSelect} />}
    >
      <QFQuestionHead title={stakesQuestionHtml(qWho)} />
      <div className="qf-options">
        {Q2_STAKES_OPTIONS.map(o => (
          <QFOption key={o.id} selected={value === o.id} onClick={() => onSelect(o.id)}>
            {stakesOptionLabel(o.id, qWho)}
          </QFOption>
        ))}
      </div>
    </QFScreen>
  );
}

export function QFQ3TimesTaken({ value, onSelect, onBack, qWho = 'child' }) {
  const opts = [
    { id: 'sat-1',     label: 'SAT once' },
    { id: 'sat-2',     label: 'SAT twice' },
    { id: 'sat-3+',    label: 'SAT three+ times' },
    { id: 'psat-only', label: 'PSAT only' },
    { id: 'none',      label: 'None' },
  ];
  return (
    <QFScreen stepIdx={5} onBack={onBack}
      actions={<QFSingleSelectFooter value={value} onSelect={onSelect} />}
    >
      <QFQuestionHead title={timesTakenQuestion(qWho)} />
      <div className="qf-options">
        {opts.map(o => (
          <QFOption key={o.id} selected={value === o.id} onClick={() => onSelect(o.id)}>{o.label}</QFOption>
        ))}
      </div>
    </QFScreen>
  );
}

export function QFQ4RecentScore({ value, onSelect, onBack, q3 = 'sat-1', qWho = 'child' }) {
  const hasSat = ['sat-1', 'sat-2', 'sat-3+'].includes(q3);
  const opts = [
    { id: 'u1000',     label: 'Under 1100' },
    { id: '1100-1200', label: '1100–1200' },
    { id: '1200-1300', label: '1200–1300' },
    { id: '1300-1400', label: '1300–1400' },
    { id: '1400plus',  label: '1400+' },
  ];
  return (
    <QFScreen stepIdx={6} onBack={onBack}
      actions={<QFSingleSelectFooter value={value} onSelect={onSelect} />}
    >
      <QFQuestionHead title={recentScoreQuestionHtml(qWho, hasSat)} />
      <div className="qf-options">
        {opts.map(o => (
          <QFOption key={o.id} selected={value === o.id} onClick={() => onSelect(o.id)}>{o.label}</QFOption>
        ))}
      </div>
      {!hasSat && (
        <QFOptOut onClick={() => onSelect('na')}>No official SAT yet (skip for now)</QFOptOut>
      )}
      <QFWhyWeAsk>
        {recentScoreWhyWeAsk(qWho, hasSat)}
      </QFWhyWeAsk>
    </QFScreen>
  );
}

export function QFQDoubts({ value = [], onToggle, onContinue, onBack }) {
  const opts = DOUBTS_OPTIONS;
  return (
    <QFScreen stepIdx={7} onBack={onBack}
      actions={<QFButton kind="forest" onClick={onContinue}>Continue</QFButton>}
    >
      <QFQuestionHead title="Which of these have you <em>heard</em> from your child?" multiSelect />
      <div className="qf-options">
        {opts.map(o => (
          <QFOption key={o.id} multi selected={value.includes(o.id)} onClick={() => onToggle(o.id)}>{o.label}</QFOption>
        ))}
      </div>
    </QFScreen>
  );
}

export function QFQ5Clock({ value, onSelect, onBack, qWho = 'child' }) {
  const opts = [
    { id: 'aug22', label: 'August 22, 2026' },
    { id: 'sept12', label: 'September 12, 2026' },
    { id: 'oct3', label: 'October 3, 2026' },
    { id: 'nov7', label: 'November 7, 2026' },
    { id: 'dec5', label: 'December 5, 2026' },
    { id: 'tbd', label: 'Not sure yet' },
  ];
  return (
    <QFScreen stepIdx={8} onBack={onBack}
      actions={<QFSingleSelectFooter value={value} onSelect={onSelect} />}
    >
      <QFQuestionHead title={nextSatQuestionHtml(qWho)} />
      <div className="qf-options">
        {opts.map(o => (
          <QFOption key={o.id} selected={value === o.id} onClick={() => onSelect(o.id)}>{o.label}</QFOption>
        ))}
      </div>
    </QFScreen>
  );
}

export function QFQ6Blocker({ value = [], onToggle, onContinue, onBack, qWho = 'child' }) {
  const opts = [
    { id: 'math',       label: 'Math' },
    { id: 'reading',    label: 'Reading & writing' },
    { id: 'self-study', label: "Self-study isn't working" },
    { id: 'no-plan',    label: 'No clear plan' },
    { id: 'wont',       label: blockerOptionLabel('wont', qWho) },
    { id: 'too-busy',   label: 'Too busy' },
  ];
  return (
    <QFScreen stepIdx={9} onBack={onBack}
      actions={<QFButton kind="forest" onClick={onContinue}>Continue</QFButton>}
    >
      <QFQuestionHead title="What seems to be the <em>problem</em>?" multiSelect />
      <div className="qf-options">
        {opts.map(o => (
          <QFOption key={o.id} multi selected={value.includes(o.id)} onClick={() => onToggle(o.id)}>{o.label}</QFOption>
        ))}
      </div>
    </QFScreen>
  );
}

export function QFQ7Tried({ value = [], onToggle, onContinue, onBack, q3 = 'sat-1', qWho = 'child' }) {
  const hasSat = ['sat-1', 'sat-2', 'sat-3+'].includes(q3);
  const opts = [
    { id: 'khan',    label: 'Khan / Bluebook / YouTube' },
    { id: 'group',   label: 'In-person group class' },
    { id: 'online',  label: 'Online course or class' },
    { id: 'app',     label: 'SAT App' },
    { id: 'book',    label: 'SAT Prep Book' },
    { id: 'nothing', label: "Didn't prepare much" },
  ];
  return (
    <QFScreen stepIdx={10} onBack={onBack}
      actions={
        <QFButton kind="forest" onClick={onContinue} disabled={value.length === 0}>
          Continue
        </QFButton>
      }
    >
      <QFQuestionHead title={prepQuestionHtml(qWho, hasSat)} multiSelect />
      <div className="qf-options">
        {opts.map(o => (
          <QFOption key={o.id} multi selected={value.includes(o.id)} onClick={() => onToggle(o.id)}>{o.label}</QFOption>
        ))}
      </div>
    </QFScreen>
  );
}

export function QFQ8Goal({ value, onSelect, onBack, qWho = 'child' }) {
  const opts = [
    { id: '1250', label: '1250' },
    { id: '1300', label: '1300' },
    { id: '1350', label: '1350' },
    { id: '1400', label: '1400' },
    { id: '1450', label: '1450+' },
  ];
  return (
    <QFScreen stepIdx={12} onBack={onBack}
      actions={<QFSingleSelectFooter value={value} onSelect={onSelect} />}
    >
      <QFQuestionHead title={goalScoreQuestionHtml(qWho)} />
      <div className="qf-options">
        {opts.map(o => (
          <QFOption key={o.id} selected={value === o.id} onClick={() => onSelect(o.id)}>{o.label}</QFOption>
        ))}
      </div>
      <QFOptOut onClick={() => onSelect('tbd')}>Not sure yet</QFOptOut>
    </QFScreen>
  );
}

export function QFQ9GPA({ value, onSelect, onBack, qWho = 'child' }) {
  const opts = [
    { id: 'u3.0',    label: 'Under 3.0' },
    { id: '3.0-3.3', label: '3.0 – 3.3' },
    { id: '3.3-3.5', label: '3.3 – 3.5' },
    { id: '3.5-3.7', label: '3.5 – 3.7' },
    { id: '3.7-3.9', label: '3.7 – 3.9' },
    { id: '4.0+',    label: '4.0+' },
  ];
  return (
    <QFScreen stepIdx={14} onBack={onBack}
      actions={<QFSingleSelectFooter value={value} onSelect={onSelect} />}
    >
      <QFQuestionHead title={gpaQuestionHtml(qWho)} />
      <div className="qf-options">
        {opts.map(o => (
          <QFOption key={o.id} selected={value === o.id} onClick={() => onSelect(o.id)}>{o.label}</QFOption>
        ))}
      </div>
      <QFWhyWeAsk>
        {gpaWhyWeAsk(qWho)}
      </QFWhyWeAsk>
    </QFScreen>
  );
}

export function QFQName({ value = '', onChange, onContinue, onBack, qWho = 'child' }) {
  const trimmed = value.trim();
  return (
    <QFScreen stepIdx={15} onBack={onBack}
      actions={<QFButton kind="forest" onClick={onContinue} disabled={!trimmed}>{NAME_CTA}</QFButton>}
    >
      <div className="qf-question-head">
        <div className="qf-eyebrow">One last detail</div>
        <h1 className="qf-h1" style={{ marginBottom: 0 }} dangerouslySetInnerHTML={{ __html: nameQuestionHtml(qWho) }} />
      </div>
      <input
        className="qf-text-input"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="First name"
        autoComplete="off"
        autoFocus
        onKeyDown={(e) => { if (e.key === 'Enter' && trimmed) onContinue(); }}
      />
      <QFWhyWeAsk>
        {nameWhyWeAsk(qWho)}
      </QFWhyWeAsk>
    </QFScreen>
  );
}
