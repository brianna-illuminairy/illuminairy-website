import { Resend } from "resend";
import { site } from "@/lib/site";
import {
  DANIELLE_PORTAL_UPDATES,
  type DaniellePortalUpdate
} from "@/lib/danielle-portal-updates";
import {
  listDanielleNotifySubscribers,
  recordDanielleUpdateDelivery,
  wasDanielleUpdateDelivered,
  type DanielleNotifySubscription
} from "@/lib/danielle-portal-subscriptions";

export type NotifyDispatchResult = {
  updateId: string;
  email: string;
  channel: "email" | "sms";
  ok: boolean;
  skipped?: string;
  error?: string;
};

function portalUrl(path: string) {
  const base = site.url.replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

function buildEmailBody(update: DaniellePortalUpdate) {
  const url = portalUrl(update.href);
  return [
    `Hi Danielle,`,
    ``,
    `Something new was added to your private Illuminairy portal:`,
    ``,
    update.title,
    update.summary,
    ``,
    `${update.cta}: ${url}`,
    ``,
    `Sign in with the email we shared with you.`,
    ``,
    `Illuminairy`,
    site.supportEmail
  ].join("\n");
}

function buildSmsBody(update: DaniellePortalUpdate) {
  const url = portalUrl(update.href);
  return `Illuminairy: ${update.title}. ${url} Reply STOP to opt out.`;
}

async function sendPortalEmail(to: string, update: DaniellePortalUpdate) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { ok: false as const, skipped: "resend_not_configured" };
  }

  const from =
    process.env.RESEND_FROM_EMAIL || "Illuminairy <onboarding@resend.dev>";
  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from,
    to,
    subject: `Illuminairy portal · ${update.title}`,
    text: buildEmailBody(update)
  });

  if (error) {
    console.error("Danielle portal notify email:", error);
    return { ok: false as const, error: String(error.message ?? error) };
  }

  return { ok: true as const };
}

async function sendPortalSms(to: string, update: DaniellePortalUpdate) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID?.trim();
  const authToken = process.env.TWILIO_AUTH_TOKEN?.trim();
  const from = process.env.TWILIO_FROM_NUMBER?.trim();

  if (!accountSid || !authToken || !from) {
    return { ok: false as const, skipped: "twilio_not_configured" };
  }

  const body = new URLSearchParams({
    To: to,
    From: from,
    Body: buildSmsBody(update)
  });

  const credentials = Buffer.from(`${accountSid}:${authToken}`).toString("base64");
  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body
    }
  );

  if (!response.ok) {
    const text = await response.text();
    console.error("Danielle portal notify SMS:", response.status, text);
    return { ok: false as const, error: text };
  }

  return { ok: true as const };
}

async function deliverUpdateToSubscriber(
  update: DaniellePortalUpdate,
  subscriber: DanielleNotifySubscription
): Promise<NotifyDispatchResult[]> {
  const results: NotifyDispatchResult[] = [];

  if (subscriber.emailOptIn) {
    const already = await wasDanielleUpdateDelivered(update.id, subscriber.email, "email");
    if (already) {
      results.push({
        updateId: update.id,
        email: subscriber.email,
        channel: "email",
        ok: true,
        skipped: "already_sent"
      });
    } else {
      const sent = await sendPortalEmail(subscriber.email, update);
      if (sent.ok) {
        await recordDanielleUpdateDelivery(update.id, subscriber.email, "email");
      }
      results.push({
        updateId: update.id,
        email: subscriber.email,
        channel: "email",
        ok: sent.ok,
        skipped: "skipped" in sent ? sent.skipped : undefined,
        error: "error" in sent ? sent.error : undefined
      });
    }
  }

  if (subscriber.smsOptIn && subscriber.phone) {
    const already = await wasDanielleUpdateDelivered(update.id, subscriber.email, "sms");
    if (already) {
      results.push({
        updateId: update.id,
        email: subscriber.email,
        channel: "sms",
        ok: true,
        skipped: "already_sent"
      });
    } else {
      const sent = await sendPortalSms(subscriber.phone, update);
      if (sent.ok) {
        await recordDanielleUpdateDelivery(update.id, subscriber.email, "sms");
      }
      results.push({
        updateId: update.id,
        email: subscriber.email,
        channel: "sms",
        ok: sent.ok,
        skipped: "skipped" in sent ? sent.skipped : undefined,
        error: "error" in sent ? sent.error : undefined
      });
    }
  }

  return results;
}

export async function dispatchDaniellePortalUpdates(options?: {
  updateIds?: string[];
  email?: string;
}) {
  const subscribers = await listDanielleNotifySubscribers();
  const targetEmail = options?.email?.trim().toLowerCase();
  const filteredSubscribers = targetEmail
    ? subscribers.filter((row) => row.email === targetEmail)
    : subscribers;

  const updates = options?.updateIds?.length
    ? DANIELLE_PORTAL_UPDATES.filter((update) => options.updateIds?.includes(update.id))
    : DANIELLE_PORTAL_UPDATES;

  const results: NotifyDispatchResult[] = [];

  for (const subscriber of filteredSubscribers) {
    for (const update of updates) {
      const batch = await deliverUpdateToSubscriber(update, subscriber);
      results.push(...batch);
    }
  }

  return results;
}
