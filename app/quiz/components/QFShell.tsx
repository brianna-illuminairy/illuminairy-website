'use client';

import { FunnelHeaderLogo } from '@/components/funnel-header-logo';
import type { CSSProperties, ReactNode } from 'react';

const TOTAL_STEPS = 21;

type QFScreenProps = {
  stepIdx?: number;
  showProgress?: boolean;
  showBack?: boolean;
  wordmark?: boolean;
  tone?: 'paper' | 'ink' | 'bg-2';
  ornament?: 'glow';
  footer?: ReactNode;
  flushBody?: boolean;
  onBack?: () => void;
  children?: ReactNode;
};

export function QFScreen({
  stepIdx,
  showProgress = true,
  showBack = true,
  wordmark = true,
  tone = 'paper',
  ornament,
  footer,
  flushBody = false,
  onBack,
  children,
}: QFScreenProps) {
  const bodyBg = tone === 'ink' ? 'var(--qf-ink)'
    : tone === 'bg-2' ? 'var(--qf-bg-2)'
    : 'var(--qf-bg)';
  const inkColor = tone === 'ink' ? 'var(--qf-paper)' : 'var(--qf-ink)';
  const fillPct = Math.max(0, Math.min(1, (stepIdx || 0) / TOTAL_STEPS)) * 100;

  return (
    <div className="qf-page" style={{ color: inkColor }}>
      <div className="qf-top">
        <div className="qf-top-row">
          <button
            className={"qf-back" + (showBack ? '' : ' hidden')}
            aria-label="Back"
            onClick={onBack}
          >←</button>
          {wordmark ? (
            <div className="qf-logo-wrap">
              <FunnelHeaderLogo />
            </div>
          ) : (
            <div className="qf-logo-wrap" aria-hidden />
          )}
          <div className="qf-top-row-spacer" aria-hidden />
        </div>
        {showProgress && (
          <div className="qf-progress">
            <div className="fill" style={{ width: `${fillPct}%` }} />
          </div>
        )}
      </div>

      <div
        className={"qf-body" + (flushBody ? ' flush' : '') + (tone === 'ink' ? ' qf-body--ink' : '')}
        style={{ background: bodyBg, position: 'relative' }}
      >
        {ornament === 'glow' && <div className="qf-glow" />}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column' }}>
          {children}
        </div>
      </div>

      {footer && (
        <div
          className="qf-footer"
          style={{ background: bodyBg, borderTopColor: tone === 'ink' ? 'rgba(255,255,255,0.1)' : undefined }}
        >
          {footer}
        </div>
      )}
    </div>
  );
}

type ClickProps = { onClick?: () => void };

export function QFOption({
  children,
  sub,
  selected,
  multi,
  onClick,
}: ClickProps & { children?: ReactNode; sub?: ReactNode; selected?: boolean; multi?: boolean }) {
  const cls = "qf-opt" + (selected ? ' selected' : '') + (multi ? ' multi' : '');
  return (
    <button className={cls} onClick={onClick}>
      <span className="qf-opt-content">
        <span className="lbl">{children}</span>
        {sub && <span className="sub">{sub}</span>}
      </span>
      {multi && (
        <span className="qf-opt-check" aria-hidden="true">
          <svg width="14" height="11" viewBox="0 0 14 11" fill="none">
            <path d="M1 5.5L5 9.5L13 1.5"
              stroke="currentColor" strokeWidth="2.2"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      )}
    </button>
  );
}

export function QFChip({
  title,
  sub,
  selected,
  onClick,
}: ClickProps & { title?: ReactNode; sub?: ReactNode; selected?: boolean }) {
  return (
    <button className={"qf-chip" + (selected ? ' selected' : '')} onClick={onClick}>
      <span>{title}</span>
      {sub && <span className="sub">{sub}</span>}
    </button>
  );
}

export function QFPill({
  children,
  selected,
  onClick,
}: ClickProps & { children?: ReactNode; selected?: boolean }) {
  return (
    <button className={"qf-pill" + (selected ? ' selected' : '')} onClick={onClick}>
      {children}
    </button>
  );
}

export function QFButton({
  children,
  kind = 'ink',
  onClick,
  disabled,
  style,
}: ClickProps & {
  children?: ReactNode;
  kind?: 'ink' | 'forest' | 'ghost';
  disabled?: boolean;
  style?: CSSProperties;
}) {
  const cls = "qf-btn" + (kind === 'forest' ? ' forest' : kind === 'ghost' ? ' ghost' : '');
  return (
    <button className={cls} onClick={onClick} disabled={disabled} style={style}>
      {children} <span className="arrow">→</span>
    </button>
  );
}

export function QFQuestionHead({
  eyebrow,
  title,
  lead,
  multiSelect,
}: {
  eyebrow?: ReactNode;
  title?: string;
  lead?: ReactNode;
  multiSelect?: boolean;
}) {
  return (
    <div className={`qf-question-head${multiSelect ? ' qf-question-head--multi' : ''}`}>
      {eyebrow && <div className="qf-eyebrow">{eyebrow}</div>}
      <h1 className="qf-h1" style={{ marginBottom: 0 }} dangerouslySetInnerHTML={{ __html: title ?? '' }} />
      {multiSelect && <p className="qf-multi-hint">Select all that apply</p>}
      {lead && <p className="qf-lead">{lead}</p>}
    </div>
  );
}

export function QFOptOut({
  children = "None of these (help me figure it out)",
  onClick,
}: ClickProps & { children?: ReactNode }) {
  return (
    <button className="qf-opt-out" onClick={onClick}>{children}</button>
  );
}

export function QFWhyWeAsk({
  children,
  source,
}: { children?: ReactNode; source?: string | boolean }) {
  return (
    <div className="qf-why">
      <div className="qf-why-head">
        <div className="qf-why-label">Why we ask</div>
      </div>
      <div className="qf-why-body">{children}</div>
      {source && (
        <a className="qf-why-source" href={typeof source === 'string' ? source : '#'}>
          Source
        </a>
      )}
    </div>
  );
}

export function QFConstellation() {
  return (
    <div className="qf-constellation">
      <span className="dot" />
      <span className="line" />
      <span className="dot big" />
      <span className="line" />
      <span className="dot" />
    </div>
  );
}
