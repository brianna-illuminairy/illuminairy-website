"use client";

import { useEffect } from "react";

const BOOKING_STEPS = new Set([
  "b-parent-name",
  "b-phone",
  "b-claim",
  "b-book",
]);

const POST_STEPS = new Set([
  "b-post-device",
  "b-post-share",
  "b-post-join-tip",
  "booked",
]);

/** Prefetch booking styles one step before phone/name capture. */
const BOOKING_PREFETCH_STEPS = new Set([
  "b-email",
  "b-zip",
  "b-target-schools",
  "b-regional-unlock",
]);

const POST_PREFETCH_STEPS = new Set(["b-book"]);

let bookingCssLoaded = false;
let postCssLoaded = false;

function loadBookingCss() {
  if (bookingCssLoaded) return;
  bookingCssLoaded = true;
  void import("@/app/quiz-b/quiz-b-booking.css");
}

function loadPostCss() {
  if (postCssLoaded) return;
  postCssLoaded = true;
  void import("@/app/quiz-b/quiz-b-post.css");
}

/** Load Plan B booking/post CSS chunks when the funnel reaches those stages. */
export function usePlanBDeferredCss(stepId: string) {
  useEffect(() => {
    if (BOOKING_PREFETCH_STEPS.has(stepId)) {
      loadBookingCss();
    }
    if (BOOKING_STEPS.has(stepId)) {
      loadBookingCss();
    }
    if (POST_PREFETCH_STEPS.has(stepId)) {
      loadPostCss();
    }
    if (POST_STEPS.has(stepId)) {
      loadPostCss();
    }
  }, [stepId]);
}
