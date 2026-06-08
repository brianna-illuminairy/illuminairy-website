'use client';

import { useState } from 'react';
import {
  SHARE_COPY_LINK,
  SHARE_ERROR,
  SHARE_INCLUDE_NAME_LABEL,
  SHARE_LINK_COPIED,
  SHARE_NATIVE,
  SHARE_PANEL_HEADLINE,
  SHARE_PANEL_LEAD,
  shareMessageText,
} from '@/lib/quiz-funnel/share-copy';
import {
  capturePlanShareCreated,
  capturePlanShareLinkCopied,
} from '@/lib/quiz-funnel/analytics';
import { getClientAttributionPayload } from '@/lib/quiz-funnel/client-attribution';

/**
 * @param {{ plan: import('@/lib/quiz-funnel/plan-reveal').PlanRevealModel, kidName?: string }} props
 */
export function PlanSharePanel({ plan, kidName = '' }) {
  const trimmedKid = typeof kidName === 'string' ? kidName.trim() : '';
  const canUseName = trimmedKid.length > 0;
  const [includeName, setIncludeName] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [shareId, setShareId] = useState('');
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const studentLabel = includeName && canUseName ? trimmedKid.split(/\s+/)[0] : null;

  async function ensureShareUrl() {
    if (shareUrl) return shareUrl;
    setBusy(true);
    setError('');
    try {
      const attribution = getClientAttributionPayload();
      const res = await fetch('/api/funnel/plan-share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan,
          studentLabel,
          visitorId: attribution.visitor_id,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setError(SHARE_ERROR);
        return null;
      }
      setShareUrl(data.url);
      setShareId(data.shareId || '');
      capturePlanShareCreated({
        shareId: data.shareId,
        includeName: Boolean(studentLabel),
      });
      return data.url;
    } catch {
      setError(SHARE_ERROR);
      return null;
    } finally {
      setBusy(false);
    }
  }

  async function onCopyLink() {
    const url = await ensureShareUrl();
    if (!url) return;
    try {
      await navigator.clipboard.writeText(
        shareMessageText(url, studentLabel)
      );
      setCopied(true);
      capturePlanShareLinkCopied({ shareId: shareId || url.split('/').pop() });
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      window.prompt('Copy this link:', url);
    }
  }

  async function onNativeShare() {
    const url = await ensureShareUrl();
    if (!url || !navigator.share) {
      await onCopyLink();
      return;
    }
    try {
      await navigator.share({
        title: 'SAT Improvement Plan',
        text: shareMessageText(url, studentLabel),
        url,
      });
      capturePlanShareLinkCopied({ shareId: shareId || url.split('/').pop(), native: true });
    } catch (err) {
      if (err?.name !== 'AbortError') {
        await onCopyLink();
      }
    }
  }

  const showNative = typeof navigator !== 'undefined' && Boolean(navigator.share);

  return (
    <section className="qf-card qf-plan-share" style={{ padding: 18 }}>
      <p className="qf-meta" style={{ color: 'var(--qf-forest)', margin: '0 0 6px' }}>
        {SHARE_PANEL_HEADLINE}
      </p>
      <p className="qf-lead" style={{ fontSize: 15, margin: '0 0 14px' }}>
        {SHARE_PANEL_LEAD}
      </p>

      {canUseName ? (
        <label className="qf-plan-share__check">
          <input
            type="checkbox"
            checked={includeName}
            onChange={(e) => {
              setIncludeName(e.target.checked);
              setShareUrl('');
              setShareId('');
            }}
          />
          <span>{SHARE_INCLUDE_NAME_LABEL}</span>
        </label>
      ) : null}

      <div className="qf-plan-share__actions">
        <button
          type="button"
          className="btn btn-forest"
          disabled={busy}
          onClick={onCopyLink}
        >
          {copied ? SHARE_LINK_COPIED : SHARE_COPY_LINK}
        </button>
        {showNative ? (
          <button
            type="button"
            className="btn btn-ghost"
            disabled={busy}
            onClick={onNativeShare}
          >
            {SHARE_NATIVE}
          </button>
        ) : null}
      </div>

      {error ? (
        <p style={{ color: '#b42318', fontSize: 14, margin: '12px 0 0' }}>{error}</p>
      ) : null}

      <p className="qf-meta" style={{ margin: '12px 0 0', lineHeight: 1.45 }}>
        Shared pages are read-only. No email or phone is included. Results vary.
      </p>
    </section>
  );
}
