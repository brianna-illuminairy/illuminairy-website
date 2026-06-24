/** Side-effect CSS imports — loaded client-side after critical inline styles. */
export function loadPlanBDeferredCss() {
  return import("@/app/quiz-b/quiz-b-deferred.css");
}

export function loadAdLpDeferredCss() {
  return import("@/app/sat-plan-builder/landing-deferred.css");
}
