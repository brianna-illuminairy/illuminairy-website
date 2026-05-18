"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { GuideFunnelCta } from "@/components/guides/guide-funnel-cta";
import { GuidePrintContent } from "@/components/guide-print-content";
import { MagnetFunnelPage } from "@/components/magnet-funnel-page";
import { captureAnalytics } from "@/lib/analytics-capture";
import { AnalyticsEvents } from "@/lib/analytics-events";
import type { MagnetGrowthHero } from "@/funnel/landing/magnets/resolve-hero";
import type { MagnetFunnelContext } from "@/funnel/lib/magnet-funnel";
import {
  LEAD_MAGNET_ACCESS_KEY,
  getLeadMagnet,
  type LeadMagnet,
  type LeadMagnetSlug
} from "@/lib/lead-magnets";

function isLocalHost() {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname;
  return host === "localhost" || host === "127.0.0.1";
}

function readLocalPreviewAccess(): boolean {
  if (!isLocalHost()) return false;
  return new URLSearchParams(window.location.search).get("preview") === "1";
}

function readMagnetAccess(slug: LeadMagnetSlug): boolean {
  if (typeof window === "undefined") return false;
  if (readLocalPreviewAccess()) return true;
  try {
    const stored = JSON.parse(
      sessionStorage.getItem(LEAD_MAGNET_ACCESS_KEY) ?? "{}"
    ) as Record<string, boolean>;
    return Boolean(stored[slug]);
  } catch {
    return false;
  }
}

export function GuideDownloadClient({
  slug,
  magnet,
  hero,
  context
}: {
  slug: LeadMagnetSlug;
  magnet: LeadMagnet;
  hero: MagnetGrowthHero;
  context: MagnetFunnelContext;
}) {
  const [hasAccess, setHasAccess] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const access = readMagnetAccess(slug);
    queueMicrotask(() => {
      setHasAccess(access);
      setChecked(true);
      if (access) {
        captureAnalytics(AnalyticsEvents.leadMagnetDownloadViewed, {
          lead_magnet_slug: slug
        });
      }
    });
  }, [slug]);

  if (!checked) {
    return (
      <div className="magnet-funnel-inner flex min-h-dvh items-center justify-center">
        <p className="text-[14px] text-ivory/50">Loading guide…</p>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <MagnetFunnelPage magnet={magnet} hero={hero} context={context} mode="gate" />
    );
  }

  return (
    <div className="magnet-funnel-inner flex min-h-dvh flex-col">
      <div className="magnet-funnel-reader-bar print:hidden">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-5 py-3.5 sm:px-8">
          <p className="min-w-0 truncate text-[13px] font-medium text-ivory/90">
            {magnet.title}
          </p>
          <button
            type="button"
            onClick={() => window.print()}
            className="shrink-0 text-[12px] font-medium text-gold-light underline-offset-2 hover:text-ivory hover:underline"
          >
            <span className="inline-flex items-center gap-1.5">
              <Download className="h-3.5 w-3.5" aria-hidden />
              Save PDF
            </span>
          </button>
        </div>
      </div>

      <div className="magnet-funnel-reader flex-1">
        <div className="guide-reader-paper">
          <article className="guide-doc">
            <GuidePrintContent slug={slug} />
          </article>
        </div>
      </div>

      <section className="magnet-funnel-cta-bar px-5 py-10 print:hidden sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[15px] font-medium text-ivory">
            Need help training the SAT way before August?
          </p>
          <p className="mt-2 text-[14px] leading-relaxed text-ivory/65">
            Twelve-week SAT Accelerator — six 1:1s, live classes, weekly reports. Book a
            free 15-minute call if you want to talk through fit.
          </p>
          <div className="mt-6 flex justify-center">
            <GuideFunnelCta variant="onDark" />
          </div>
        </div>
      </section>
    </div>
  );
}
