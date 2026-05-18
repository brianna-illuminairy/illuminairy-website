"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAttributionPayload } from "@/components/attribution-provider";
import { CalendlyInline } from "@/components/calendly-inline";
import { captureAnalytics } from "@/lib/analytics-capture";
import { AnalyticsEvents } from "@/lib/analytics-events";
import {
  INTAKE_LEAD_ID_KEY,
  INTAKE_SESSION_KEY,
  buildCalendlyPrefillUrl,
  type IntakeSessionSummary
} from "@/lib/sat-qualification";
import { site } from "@/lib/site";

function readPrefilledCalendlyUrl(): string {
  if (typeof window === "undefined") return site.calendlyUrl;
  try {
    const raw = sessionStorage.getItem(INTAKE_SESSION_KEY);
    if (!raw) return site.calendlyUrl;
    const summary = JSON.parse(raw) as IntakeSessionSummary;
    return buildCalendlyPrefillUrl(site.calendlyUrl, summary);
  } catch {
    return site.calendlyUrl;
  }
}

export function GetStartedSchedule() {
  const [bookingUrl, setBookingUrl] = useState(site.calendlyUrl);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    captureAnalytics(AnalyticsEvents.getStartedScheduleViewed);
    const { visitorId, attribution } = getAttributionPayload();
    const leadId = sessionStorage.getItem(INTAKE_LEAD_ID_KEY) ?? undefined;
    void fetch("/api/attribution/touch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        visitorId,
        leadId,
        eventType: "schedule_viewed",
        path: window.location.pathname,
        fullUrl: window.location.href,
        attribution
      }),
      keepalive: true
    });
    queueMicrotask(() => {
      setBookingUrl(readPrefilledCalendlyUrl());
      setReady(true);
    });
  }, []);

  if (!ready) {
    return <p className="py-12 text-center text-ink-soft">Loading scheduler…</p>;
  }

  return (
    <>
      <p className="mb-6 text-[14.5px] leading-relaxed text-ink-soft">
        Pick a time for a free, no-pressure conversation. We will use your intake answers
        to make the call useful.
      </p>
      <CalendlyInline bookingUrl={bookingUrl} />
      <p className="mt-8 text-center text-[13px] text-ink-soft">
        <Link href="/get-started" className="text-gold-deep hover:underline">
          ← Edit application
        </Link>
      </p>
    </>
  );
}
