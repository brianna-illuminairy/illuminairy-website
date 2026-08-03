"use client";

import posthog from "posthog-js";
import { analyticsAttributionProps } from "@/lib/analytics-attribution";
import { AnalyticsEvents } from "@/lib/analytics-events";
import { Ga4Events, MetaEvents } from "@/lib/analytics-registry";
import { enrollPurchaseValueCents } from "@/lib/enroll-meta-purchase";
import { resolveMetaClickIds } from "@/lib/meta-click-ids";
import { getPostHogKey } from "@/lib/posthog";

export type EnrollCheckoutProgram = "standard_enroll" | "personalized_enroll";

export type EnrollCheckoutPricing = {
  diagPrice: number;
  weeklyPrice: number;
};

type EnrollBaseProps = EnrollCheckoutPricing & {
  program: EnrollCheckoutProgram;
  slug: string;
};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

function baseProps(props: EnrollBaseProps) {
  return {
    program: props.program,
    slug: props.slug,
    diag_price: props.diagPrice,
    weekly_price: props.weeklyPrice,
    ...analyticsAttributionProps()
  };
}

function trackGa4(
  eventName: string,
  params: Record<string, string | number | boolean | undefined>
) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", eventName, params);
}

function trackMetaStandard(
  eventName: string,
  params: Record<string, string | number | boolean | undefined>,
  options?: { eventID?: string }
) {
  if (typeof window === "undefined" || !window.fbq) return;
  if (options?.eventID) {
    window.fbq("track", eventName, params, { eventID: options.eventID });
    return;
  }
  window.fbq("track", eventName, params);
}

function trackMetaCustom(
  eventName: string,
  params: Record<string, string | number | boolean | undefined>
) {
  if (typeof window === "undefined" || !window.fbq) return;
  window.fbq("trackCustom", eventName, params);
}

function posthogEventForProgram(
  program: EnrollCheckoutProgram,
  kind: "viewed" | "clicked" | "completed" | "failed"
): string {
  if (program === "standard_enroll") {
    if (kind === "viewed") return AnalyticsEvents.standardEnrollPageViewed;
    if (kind === "clicked") return AnalyticsEvents.standardEnrollPaymentClicked;
    if (kind === "completed")
      return AnalyticsEvents.standardEnrollPaymentCompleted;
    return AnalyticsEvents.standardEnrollPaymentFailed;
  }
  if (kind === "viewed") return AnalyticsEvents.personalizedEnrollPageViewed;
  if (kind === "clicked") return AnalyticsEvents.personalizedEnrollPaymentClicked;
  if (kind === "completed")
    return AnalyticsEvents.personalizedEnrollPaymentCompleted;
  return AnalyticsEvents.personalizedEnrollPaymentFailed;
}

function capturePostHog(
  event: string,
  props: Record<string, string | number | boolean | undefined>
) {
  if (!getPostHogKey()) return;
  try {
    posthog.capture(event, props);
  } catch {
    // Analytics must not block UX
  }
}

export function trackEnrollCheckoutViewed(props: EnrollBaseProps) {
  const payload = baseProps(props);
  capturePostHog(posthogEventForProgram(props.program, "viewed"), payload);
  trackGa4(Ga4Events.enrollCheckoutViewed, {
    ...payload,
    value: props.diagPrice,
    currency: "USD"
  });
  trackMetaStandard(MetaEvents.viewContent, {
    content_name: props.slug,
    content_category: props.program,
    value: props.diagPrice,
    currency: "USD"
  });
}

export function trackEnrollPaymentClicked(
  props: EnrollBaseProps & { source: string }
) {
  const payload = {
    ...baseProps(props),
    source: props.source
  };
  capturePostHog(posthogEventForProgram(props.program, "clicked"), payload);
  trackGa4(Ga4Events.beginCheckout, {
    ...payload,
    value: props.diagPrice,
    currency: "USD"
  });
  trackMetaStandard(MetaEvents.initiateCheckout, {
    content_name: props.slug,
    content_category: props.program,
    value: props.diagPrice,
    currency: "USD"
  });
}

export function trackEnrollPaymentCompleted(
  props: EnrollBaseProps & {
    paymentIntentId: string;
    subscriptionStatus?: string;
    metaPurchaseEventId?: string;
    diagnosticWaived?: boolean;
  }
) {
  const purchaseValue =
    enrollPurchaseValueCents({
      diagnosticCents: Math.round(props.diagPrice * 100),
      weeklyCents: Math.round(props.weeklyPrice * 100),
      diagnosticWaived: Boolean(props.diagnosticWaived)
    }) / 100;

  const payload = {
    ...baseProps(props),
    payment_intent_id: props.paymentIntentId,
    subscription_status: props.subscriptionStatus ?? "unknown",
    purchase_value: purchaseValue
  };
  capturePostHog(posthogEventForProgram(props.program, "completed"), payload);
  trackGa4(Ga4Events.purchase, {
    ...payload,
    transaction_id: props.paymentIntentId,
    value: purchaseValue,
    currency: "USD"
  });
  trackMetaStandard(
    MetaEvents.purchase,
    {
      content_name: props.slug,
      content_category: props.program,
      value: purchaseValue,
      currency: "USD"
    },
    props.metaPurchaseEventId
      ? { eventID: props.metaPurchaseEventId }
      : undefined
  );
}

/** Meta match keys + Stripe reference for post-call enroll finalize API. */
export function enrollFinalizeRequestBody(input: {
  paymentIntentId?: string;
  setupIntentId?: string;
  parentFirst?: string;
  parentLast?: string;
  parentEmail?: string;
  studentFirst?: string;
}) {
  const ids = resolveMetaClickIds();
  return {
    ...input,
    ...(ids.fbp ? { fbp: ids.fbp } : {}),
    ...(ids.fbc ? { fbc: ids.fbc } : {})
  };
}

export function trackEnrollPaymentFailed(
  props: EnrollBaseProps & {
    step: "confirm_card" | "finalize_subscription" | "client";
    errorCode?: string;
  }
) {
  const payload = {
    ...baseProps(props),
    step: props.step,
    error_code: props.errorCode ?? "unknown"
  };
  capturePostHog(posthogEventForProgram(props.program, "failed"), payload);
  trackGa4(Ga4Events.enrollCheckoutError, payload);
  trackMetaCustom(MetaEvents.enrollCheckoutError, payload);
}
