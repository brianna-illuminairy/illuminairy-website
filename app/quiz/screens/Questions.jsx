'use client'; // @ts-nocheck
import { QFScreen, QFOption, QFButton, QFQuestionHead, QFOptOut, QFWhyWeAsk } from '../components/QFShell';
import { Q2_STAKES_OPTIONS } from '@/lib/quiz-funnel/stakes-copy';
import { DOUBTS_OPTIONS } from '@/lib/quiz-funnel/doubts-copy';

export function QFQ1Trigger({ value, onSelect, onBack }) {
  const opts = [
    { id: 'score-low', label: "SAT score too low" },
    { id: 'test-soon', label: "SAT test date coming up" },
    { id: 'app-soon',  label: "Upcoming app deadlines (EA, ED, RD)" },
    { id: 'get-ahead', label: "Starting prep early" },
  ];
  return (
    <QFScreen stepIdx={1} onBack={onBack}>
      <QFQuestionHead title="Which sounds <em>most like you</em>?" />
      <div className="qf-options">
        {opts.map(o => (
          <QFOption key={o.id} selected={value === o.id} onClick={() => onSelect(o.id)}>{o.label}</QFOption>
        ))}
      </div>
      <QFOptOut />
    </QFScreen>
  );
}

export function QFQ2Stakes({ value, onSelect, onBack }) {
  return (
    <QFScreen stepIdx={2} onBack={onBack}>
      <QFQuestionHead title="What would a higher SAT score help them <em>achieve</em>?" />
      <div className="qf-options">
        {Q2_STAKES_OPTIONS.map(o => (
          <QFOption key={o.id} selected={value === o.id} onClick={() => onSelect(o.id)}>{o.label}</QFOption>
        ))}
      </div>
    </QFScreen>
  );
}

export function QFQ3TimesTaken({ value, onSelect, onBack }) {
  const opts = [
    { id: 'sat-1',     label: 'SAT once' },
    { id: 'sat-2',     label: 'SAT twice' },
    { id: 'sat-3+',    label: 'SAT three+ times' },
    { id: 'psat-only', label: 'PSAT only' },
    { id: 'none',      label: 'None' },
  ];
  return (
    <QFScreen stepIdx={3} onBack={onBack}>
      <QFQuestionHead title="Have they taken the SAT before?" />
      <div className="qf-options">
        {opts.map(o => (
          <QFOption key={o.id} selected={value === o.id} onClick={() => onSelect(o.id)}>{o.label}</QFOption>
        ))}
      </div>
    </QFScreen>
  );
}

export function QFQ4RecentScore({ value, onSelect, onBack, q3 = 'sat-1' }) {
  const hasSat = ['sat-1', 'sat-2', 'sat-3+'].includes(q3);
  const opts = [
    { id: 'u1000',     label: 'Under 1100' },
    { id: '1100-1200', label: '1100–1200' },
    { id: '1200-1300', label: '1200–1300' },
    { id: '1300-1400', label: '1300–1400' },
    { id: '1400plus',  label: '1400+' },
  ];
  return (
    <QFScreen stepIdx={4} onBack={onBack}>
      <QFQuestionHead
        title={hasSat
          ? "What's the <em>most recent</em> SAT score?"
          : "Best estimate of where they'd score <em>today</em>?"}
      />
      <div className="qf-options">
        {opts.map(o => (
          <QFOption key={o.id} selected={value === o.id} onClick={() => onSelect(o.id)}>{o.label}</QFOption>
        ))}
      </div>
      {!hasSat && (
        <QFOptOut onClick={() => onSelect('na')}>No official SAT yet (skip for now)</QFOptOut>
      )}
      <QFWhyWeAsk>
        {hasSat
          ? 'This helps us estimate a realistic improvement range before test day.'
          : 'Optional. The Skill Diagnostic sets the real starting point. A rough band helps us preview your Improvement Plan.'}
      </QFWhyWeAsk>
    </QFScreen>
  );
}

export function QFQDoubts({ value = [], onToggle, onContinue, onBack }) {
  const opts = DOUBTS_OPTIONS;
  return (
    <QFScreen stepIdx={4} onBack={onBack}
      footer={<QFButton kind="forest" onClick={onContinue}>Continue</QFButton>}
    >
      <QFQuestionHead title="Since their last SAT score, which of these have you <em>heard</em> from your child?" multiSelect />
      <div className="qf-options">
        {opts.map(o => (
          <QFOption key={o.id} multi selected={value.includes(o.id)} onClick={() => onToggle(o.id)}>{o.label}</QFOption>
        ))}
      </div>
    </QFScreen>
  );
}

export function QFQ5Clock({ value, onSelect, onBack }) {
  const opts = [
    { id: 'aug22', label: 'August 22, 2026' },
    { id: 'sept12', label: 'September 12, 2026' },
    { id: 'oct3', label: 'October 3, 2026' },
    { id: 'nov7', label: 'November 7, 2026' },
    { id: 'dec5', label: 'December 5, 2026' },
    { id: 'tbd', label: 'Not sure yet' },
  ];
  return (
    <QFScreen stepIdx={5} onBack={onBack}>
      <QFQuestionHead title="When's their <em>next</em> SAT?" />
      <div className="qf-options">
        {opts.map(o => (
          <QFOption key={o.id} selected={value === o.id} onClick={() => onSelect(o.id)}>{o.label}</QFOption>
        ))}
      </div>
    </QFScreen>
  );
}

export function QFQ6Blocker({ value = [], onToggle, onContinue, onBack }) {
  const opts = [
    { id: 'math',       label: 'Math' },
    { id: 'reading',    label: 'Reading & writing' },
    { id: 'self-study', label: "Self-study isn't working" },
    { id: 'no-plan',    label: 'No clear plan' },
    { id: 'wont',       label: "Won't study on their own" },
    { id: 'too-busy',   label: 'Too busy' },
  ];
  return (
    <QFScreen stepIdx={7} onBack={onBack}
      footer={<QFButton kind="forest" onClick={onContinue}>Continue</QFButton>}
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

export function QFQ7Tried({ value = [], onToggle, onContinue, onBack, q3 = 'sat-1' }) {
  const hasSat = ['sat-1', 'sat-2', 'sat-3+'].includes(q3);
  const title = hasSat
    ? "How did they prep for their <em>last SAT</em>?"
    : "How have they <em>prepared</em> so far?";
  const opts = [
    { id: 'khan',    label: 'Khan / Bluebook / YouTube' },
    { id: 'group',   label: 'In-person group class' },
    { id: 'online',  label: 'Online course or class' },
    { id: 'app',     label: 'SAT App' },
    { id: 'book',    label: 'SAT Prep Book' },
    { id: 'nothing', label: "Didn't prepare much" },
  ];
  return (
    <QFScreen stepIdx={8} onBack={onBack}
      footer={
        <QFButton kind="forest" onClick={onContinue} disabled={value.length === 0}>
          Continue
        </QFButton>
      }
    >
      <QFQuestionHead title={title} multiSelect />
      <div className="qf-options">
        {opts.map(o => (
          <QFOption key={o.id} multi selected={value.includes(o.id)} onClick={() => onToggle(o.id)}>{o.label}</QFOption>
        ))}
      </div>
    </QFScreen>
  );
}

export function QFQ8Goal({ value, onSelect, onBack }) {
  const opts = [
    { id: '1250', label: '1250' },
    { id: '1300', label: '1300' },
    { id: '1350', label: '1350' },
    { id: '1400', label: '1400' },
    { id: '1450', label: '1450+' },
  ];
  return (
    <QFScreen stepIdx={10} onBack={onBack}>
      <QFQuestionHead title="What score are they <em>aiming for</em>?" />
      <div className="qf-options">
        {opts.map(o => (
          <QFOption key={o.id} selected={value === o.id} onClick={() => onSelect(o.id)}>{o.label}</QFOption>
        ))}
      </div>
      <QFOptOut onClick={() => onSelect('tbd')}>Not sure yet</QFOptOut>
    </QFScreen>
  );
}

export function QFQ9GPA({ value, onSelect, onBack }) {
  const opts = [
    { id: 'u3.0',    label: 'Under 3.0' },
    { id: '3.0-3.3', label: '3.0 – 3.3' },
    { id: '3.3-3.5', label: '3.3 – 3.5' },
    { id: '3.5-3.7', label: '3.5 – 3.7' },
    { id: '3.7-3.9', label: '3.7 – 3.9' },
    { id: '4.0+',    label: '4.0+' },
  ];
  return (
    <QFScreen stepIdx={12} onBack={onBack}>
      <QFQuestionHead title="What's their <em>GPA</em>?" />
      <div className="qf-options">
        {opts.map(o => (
          <QFOption key={o.id} selected={value === o.id} onClick={() => onSelect(o.id)}>{o.label}</QFOption>
        ))}
      </div>
      <QFWhyWeAsk>
        Their GPA helps us set a realistic score target and shape their Improvement Plan for their timeline.
      </QFWhyWeAsk>
    </QFScreen>
  );
}

export function QFQName({ value = '', onChange, onContinue, onBack }) {
  return (
    <QFScreen stepIdx={13} onBack={onBack}
      footer={<QFButton kind="forest" onClick={onContinue}>Continue</QFButton>}
    >
      <div className="qf-question-head">
        <div className="qf-eyebrow">One last detail</div>
        <h1 className="qf-h1" style={{ marginBottom: 0 }} dangerouslySetInnerHTML={{ __html: "What's your student's <em>first name</em>?" }} />
      </div>
      <input
        className="qf-text-input"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="First name"
        autoComplete="off"
        autoFocus
        onKeyDown={(e) => { if (e.key === 'Enter') onContinue(); }}
      />
      <QFWhyWeAsk>
        We&apos;ll personalize their plan and score roadmap with their name.
      </QFWhyWeAsk>
    </QFScreen>
  );
}
