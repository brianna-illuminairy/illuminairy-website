#!/usr/bin/env node
/**
 * Booking gate defaults to live; inferred Meta UTMs must not gate s5.
 * Mirrors lib/quiz-funnel/plan-builder-booking-gate.ts — update both if logic changes.
 */

import assert from "node:assert/strict";

function envTruthy(raw) {
  const v = raw?.trim().toLowerCase();
  return v === "1" || v === "true" || v === "yes";
}

function isPlanBuilderBookingPausedPublic() {
  return envTruthy(process.env.NEXT_PUBLIC_PLAN_BUILDER_BOOKING_PAUSED);
}

function isPlanBuilderBookingLivePublic() {
  if (isPlanBuilderBookingPausedPublic()) return false;
  if (envTruthy(process.env.NEXT_PUBLIC_PLAN_BUILDER_BOOKING_LIVE)) return true;
  return true;
}

function isPaidAdAttribution(attr) {
  if (attr.fbclid?.trim()) return true;
  if (attr.gclid?.trim()) return true;
  if (attr.msclkid?.trim()) return true;
  const medium = attr.utm_medium?.trim().toLowerCase() ?? "";
  return (
    medium === "paid_social" ||
    medium === "cpc" ||
    medium === "ppc" ||
    medium === "paid"
  );
}

function shouldGatePlanBuilderBooking(attribution, hasQaBypass, bookingLive) {
  const live = bookingLive ?? isPlanBuilderBookingLivePublic();
  if (live) return false;
  if (hasQaBypass) return false;
  return isPaidAdAttribution(attribution);
}

const savedPaused = process.env.NEXT_PUBLIC_PLAN_BUILDER_BOOKING_PAUSED;
const savedLive = process.env.NEXT_PUBLIC_PLAN_BUILDER_BOOKING_LIVE;
delete process.env.NEXT_PUBLIC_PLAN_BUILDER_BOOKING_PAUSED;
delete process.env.NEXT_PUBLIC_PLAN_BUILDER_BOOKING_LIVE;

assert.equal(isPlanBuilderBookingLivePublic(), true, "booking defaults live");
assert.equal(
  shouldGatePlanBuilderBooking({ utm_source: "meta", utm_medium: "paid_social" }, false),
  false,
  "paid UTMs must not gate when live"
);
assert.equal(shouldGatePlanBuilderBooking({}, false), false, "direct s5 must not gate");

process.env.NEXT_PUBLIC_PLAN_BUILDER_BOOKING_PAUSED = "1";
assert.equal(isPlanBuilderBookingLivePublic(), false, "PAUSED=1 disables live");
assert.equal(
  shouldGatePlanBuilderBooking({ fbclid: "abc" }, false),
  true,
  "paid click gated when PAUSED"
);
assert.equal(
  shouldGatePlanBuilderBooking({}, false),
  false,
  "organic not gated even when PAUSED"
);

if (savedPaused !== undefined) process.env.NEXT_PUBLIC_PLAN_BUILDER_BOOKING_PAUSED = savedPaused;
else delete process.env.NEXT_PUBLIC_PLAN_BUILDER_BOOKING_PAUSED;
if (savedLive !== undefined) process.env.NEXT_PUBLIC_PLAN_BUILDER_BOOKING_LIVE = savedLive;
else delete process.env.NEXT_PUBLIC_PLAN_BUILDER_BOOKING_LIVE;

console.log("verify-booking-gate-default passed");
