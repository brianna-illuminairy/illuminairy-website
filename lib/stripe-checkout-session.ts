import Stripe from "stripe";

function isStripeSessionNotFound(err: unknown): boolean {
  if (!err || typeof err !== "object") return false;
  const e = err as { code?: string; message?: string };
  return e.code === "resource_missing" || (e.message?.includes("No such checkout.session") ?? false);
}

/** Paid checkout or 100% coupon ($0) completion. */
export function isCheckoutSessionComplete(session: Stripe.Checkout.Session): boolean {
  if (session.status !== "complete") return false;
  return session.payment_status === "paid" || session.payment_status === "no_payment_required";
}

/**
 * Stripe checkout session IDs are case-sensitive. Email clients and manual copies
 * sometimes change letter casing, so fall back to a recent-session scan.
 */
const ENROLL_SESSION_EXPAND = [
  "line_items",
  "line_items.data.price",
  "line_items.data.price.product",
  "subscription",
  "subscription.items.data.price",
  "subscription.items.data.price.product"
] as const;

export async function retrieveCheckoutSession(
  stripe: Stripe,
  sessionId: string,
  options?: { expandForReceipt?: boolean }
): Promise<Stripe.Checkout.Session> {
  const trimmed = sessionId.trim();
  if (!trimmed) {
    throw new Error("Checkout session id required.");
  }

  const retrieveOpts = options?.expandForReceipt
    ? { expand: [...ENROLL_SESSION_EXPAND] }
    : undefined;

  try {
    return await stripe.checkout.sessions.retrieve(trimmed, retrieveOpts);
  } catch (err) {
    if (!isStripeSessionNotFound(err)) throw err;
  }

  const target = trimmed.toLowerCase();
  const since = Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 30;
  let startingAfter: string | undefined;

  for (let page = 0; page < 10; page++) {
    const list = await stripe.checkout.sessions.list({
      created: { gte: since },
      limit: 100,
      ...(startingAfter ? { starting_after: startingAfter } : {})
    });

    for (const session of list.data) {
      if (session.id.toLowerCase() === target) {
        if (options?.expandForReceipt) {
          return stripe.checkout.sessions.retrieve(session.id, {
            expand: [...ENROLL_SESSION_EXPAND]
          });
        }
        return session;
      }
    }

    if (!list.has_more || list.data.length === 0) break;
    startingAfter = list.data[list.data.length - 1]?.id;
  }

  throw new Error("Checkout session not found.");
}
