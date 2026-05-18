"use client";

import Link from "next/link";
import { AnalyticsEvents } from "@/lib/analytics-events";
import type { FunnelContext, FunnelHero } from "@/funnel/lib/campaigns";
import { trackFunnelEvent } from "@/funnel/lib/track";
import { readPersistedUtm } from "@/funnel/lib/utm";
import { Eyebrow } from "@/components/ui";

export function FunnelLandingHero({
  hero,
  context
}: {
  hero: FunnelHero;
  context: FunnelContext;
}) {
  function onCtaClick() {
    trackFunnelEvent(AnalyticsEvents.funnelCtaClick, {
      campaign_id: context.campaignId,
      tone: context.tone,
      variant: context.variant,
      cta: "primary"
    });
  }

  function onSecondaryClick() {
    trackFunnelEvent(AnalyticsEvents.funnelCtaClick, {
      campaign_id: context.campaignId,
      cta: "secondary"
    });
  }

  const applyHref = buildApplyHref(context);

  return (
    <section className="px-5 pb-8 pt-10 sm:px-8 sm:pt-14">
      <div className="mx-auto max-w-lg">
        <Eyebrow tone="gold">{hero.eyebrow}</Eyebrow>
        <h1 className="mt-4 font-serif text-[1.75rem] leading-[1.15] tracking-[-0.02em] text-ink sm:text-[2.125rem]">
          {hero.headline}
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
          {hero.subhead}
        </p>
        <ul className="mt-6 grid gap-2.5 text-[14px] text-ink-soft">
          {hero.bullets.map((b) => (
            <li key={b} className="flex gap-2">
              <span className="text-gold-deep" aria-hidden>
                ·
              </span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href={applyHref}
            onClick={onCtaClick}
            className="inline-flex min-h-12 items-center justify-center rounded-xl border border-ink bg-ink px-6 text-[15px] font-semibold text-ivory"
          >
            {hero.ctaLabel}
          </Link>
          {hero.secondaryCta && (
            <Link
              href={hero.secondaryCta.href}
              onClick={onSecondaryClick}
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-line-strong px-6 text-[15px] font-semibold text-ink"
            >
              {hero.secondaryCta.label}
            </Link>
          )}
        </div>
        </div>
    </section>
  );
}

function buildApplyHref(context: FunnelContext) {
  const params = new URLSearchParams();
  params.set("campaign", context.campaignId);
  params.set("tone", context.tone);
  if (context.fearId) params.set("fear_id", context.fearId);
  if (context.variant) params.set("v", context.variant);
  const utm = readPersistedUtm();
  for (const [k, v] of Object.entries(utm)) {
    if (v) params.set(k, v);
  }
  return `/get-started?${params.toString()}`;
}
