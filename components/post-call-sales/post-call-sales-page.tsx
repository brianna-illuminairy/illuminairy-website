"use client";

import { useEffect } from "react";
import { captureAnalytics } from "@/lib/analytics-capture";
import { AnalyticsEvents } from "@/lib/analytics-events";
import {
  getPostCallSalesPage,
  postCallProofLine,
  type PostCallSalesPageType
} from "@/lib/post-call-sales";

type PostCallSalesPageProps = {
  pageType: PostCallSalesPageType;
};

export function PostCallSalesPage({ pageType }: PostCallSalesPageProps) {
  const page = getPostCallSalesPage(pageType);

  useEffect(() => {
    captureAnalytics(AnalyticsEvents.postCallSalesPageViewed, {
      page_type: page.pageType
    });
  }, [page.pageType]);

  function handlePaymentClick() {
    captureAnalytics(AnalyticsEvents.postCallPaymentClicked, {
      page_type: page.pageType
    });
  }

  return (
    <main className="bg-surface px-5 py-10 sm:px-8 lg:py-14">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <section className="rounded-3xl border border-border bg-surface-elevated p-6 shadow-card sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-muted">
            Post-call next step
          </p>
          <h1 className="mt-3 text-balance text-2xl font-semibold tracking-tight text-primary sm:text-3xl">
            {page.headline}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-primary-muted sm:text-base">
            {page.subcopy}
          </p>

          <div className="mt-6 space-y-2 rounded-2xl border border-border bg-surface p-4">
            {page.paymentLines.map((line) => (
              <p key={line} className="text-sm font-medium text-primary sm:text-base">
                {line}
              </p>
            ))}
            <p className="pt-1 text-xs leading-relaxed text-primary-muted sm:text-sm">
              {page.fitLine}
            </p>
          </div>

          <a
            href={page.stripeLink}
            target="_blank"
            rel="noreferrer"
            onClick={handlePaymentClick}
            className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-accent bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground transition hover:opacity-90 sm:text-base"
          >
            {page.ctaLabel}
          </a>
          <p className="mt-2 text-center text-xs text-primary-muted">
            Secure checkout powered by Stripe.
          </p>
        </section>

        <section className="space-y-5">
          <div className="rounded-3xl border border-border bg-surface-elevated p-6 shadow-card sm:p-8">
            <h2 className="text-lg font-semibold text-primary sm:text-xl">
              What&apos;s included
            </h2>
            <ul className="mt-4 space-y-3">
              {page.included.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-primary sm:text-base">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-border bg-surface-elevated p-6 shadow-card sm:p-8">
            <h2 className="text-lg font-semibold text-primary sm:text-xl">
              Parent confidence
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-primary-muted sm:text-base">
              {postCallProofLine}
            </p>
            <div className="mt-5 grid gap-4">
              {page.testimonials.map((testimonial) => (
                <figure
                  key={`${testimonial.byline}-${testimonial.quote}`}
                  className="rounded-2xl border border-border bg-surface p-4"
                >
                  <blockquote className="text-sm leading-relaxed text-primary sm:text-base">
                    “{testimonial.quote}”
                  </blockquote>
                  <figcaption className="mt-2 text-xs font-medium uppercase tracking-[0.12em] text-primary-muted">
                    {testimonial.byline}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
