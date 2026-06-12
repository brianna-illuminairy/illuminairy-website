import type Stripe from "stripe";
import { satProgram, site } from "@/lib/site";

export type EnrollReceiptOneTime = {
  productName: string;
  amountCents: number;
  currency: string;
  paidAtIso: string;
  receiptSuffix: string;
};

export type EnrollReceiptSubscription = {
  productName: string;
  amountCents: number;
  currency: string;
  interval: string;
  trialEndIso: string | null;
  billingWeekday: string | null;
};

export type EnrollReceipt = {
  entityName: string;
  legalEntityLine: string;
  customerEmail: string;
  oneTime: EnrollReceiptOneTime | null;
  subscription: EnrollReceiptSubscription | null;
  examDayLabel: string;
};

const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
] as const;

export function formatEnrollMoney(amountCents: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase()
  }).format(amountCents / 100);
}

export function formatEnrollReceiptDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  });
}

function weekdayFromUnix(seconds: number | null | undefined): string | null {
  if (!seconds) return null;
  const d = new Date(seconds * 1000);
  if (Number.isNaN(d.getTime())) return null;
  return WEEKDAYS[d.getDay()] ?? null;
}

function lineItemProductName(item: Stripe.LineItem): string {
  const price = item.price;
  if (price && typeof price === "object") {
    const nickname = price.nickname?.trim();
    if (nickname) return nickname;
    const product = price.product;
    if (product && typeof product === "object" && "name" in product) {
      const name = (product as Stripe.Product).name?.trim();
      if (name) return name;
    }
  }
  return item.description?.trim() || "Program";
}

function isOneTimeLineItem(item: Stripe.LineItem): boolean {
  const price = item.price;
  if (!price || typeof price !== "object") return false;
  return price.type === "one_time";
}

function subscriptionProductName(sub: Stripe.Subscription): string {
  const item = sub.items?.data?.[0];
  if (!item?.price || typeof item.price !== "object") return "Weekly Tutoring";
  const nickname = item.price.nickname?.trim();
  if (nickname) return nickname;
  const product = item.price.product;
  if (product && typeof product === "object" && "name" in product) {
    const name = (product as Stripe.Product).name?.trim();
    if (name) return name;
  }
  return "Weekly Tutoring";
}

/**
 * Builds receipt display data from an expanded Stripe Checkout Session.
 * All dollar amounts come from Stripe — never hardcode in components.
 */
export function parseEnrollReceiptFromSession(
  session: Stripe.Checkout.Session
): EnrollReceipt {
  const customerEmail =
    session.customer_details?.email?.trim() ||
    session.customer_email?.trim() ||
    "";

  const legalEntityLine = `Illuminairy SAT Prep is a service of ${site.legalName}, ${site.location}.`;

  let oneTime: EnrollReceiptOneTime | null = null;
  const lineItems = session.line_items;
  if (lineItems && typeof lineItems === "object" && "data" in lineItems) {
    for (const item of lineItems.data) {
      if (!isOneTimeLineItem(item)) continue;
      const paidAt =
        session.created != null
          ? new Date(session.created * 1000).toISOString()
          : new Date().toISOString();
      oneTime = {
        productName: lineItemProductName(item),
        amountCents: item.amount_total ?? item.price?.unit_amount ?? 0,
        currency: (item.currency ?? session.currency ?? "usd").toLowerCase(),
        paidAtIso: paidAt,
        receiptSuffix: session.id.replace(/^cs_/, "").slice(-8).toUpperCase()
      };
      break;
    }
  }

  if (!oneTime && session.amount_total != null && session.amount_total > 0) {
    oneTime = {
      productName: "Skill Diagnostic + Plan",
      amountCents: session.amount_total,
      currency: (session.currency ?? "usd").toLowerCase(),
      paidAtIso:
        session.created != null
          ? new Date(session.created * 1000).toISOString()
          : new Date().toISOString(),
      receiptSuffix: session.id.replace(/^cs_/, "").slice(-8).toUpperCase()
    };
  }

  let subscription: EnrollReceiptSubscription | null = null;
  const sub = session.subscription;
  if (sub && typeof sub === "object") {
    const price = sub.items?.data?.[0]?.price;
    const unitAmount =
      price && typeof price === "object" ? (price.unit_amount ?? 0) : 0;
    const interval =
      price && typeof price === "object" && price.recurring?.interval
        ? price.recurring.interval
        : "week";
    subscription = {
      productName: subscriptionProductName(sub),
      amountCents: unitAmount,
      currency: (sub.currency ?? session.currency ?? "usd").toLowerCase(),
      interval,
      trialEndIso:
        sub.trial_end != null
          ? new Date(sub.trial_end * 1000).toISOString()
          : null,
      billingWeekday: weekdayFromUnix(sub.billing_cycle_anchor ?? sub.trial_end)
    };
  }

  return {
    entityName: "Illuminairy SAT Prep",
    legalEntityLine,
    customerEmail,
    oneTime,
    subscription,
    examDayLabel: satProgram.examDayLabel
  };
}
