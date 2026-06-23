/**
 * Plan Builder B step interaction modes — guards + e2e SSOT.
 * Spec: docs/funnel-mobile-shell.md (same rules as /plan).
 *
 * @typedef {'option-tap' | 'multi-continue' | 'form-continue' | 'explicit-cta' | 'auto-advance' | 'inline-cta'} LabStepInteractionMode
 */

/** @type {Record<string, LabStepInteractionMode>} */
export const LAB_STEP_INTERACTION = {
  "q1-parent-child": "option-tap",
  "q-grade": "option-tap",
  "q-score-lower": "option-tap",
  q1: "option-tap",
  q2: "option-tap",
  q3: "option-tap",
  "hit-q3-none": "auto-advance",
  q4: "option-tap",
  q5: "option-tap",
  "hit-q5-tbd": "auto-advance",
  q6: "multi-continue",
  q8: "option-tap",
  "hit-q8-scores": "auto-advance",
  q9: "option-tap",
  "q-school-referral": "option-tap",
  "b-computing": "auto-advance",
  "b-plan-ready": "explicit-cta",
  "b-email": "form-continue",
  "b-zip": "form-continue",
  "b-target-schools": "multi-continue",
  "b-regional-unlock": "explicit-cta",
  "b-parent-name": "form-continue",
  "b-phone": "form-continue",
  "b-claim": "explicit-cta",
  "b-book": "form-continue",
  "b-post-device": "option-tap",
  "b-post-share": "inline-cta",
  "b-post-join-tip": "inline-cta",
  booked: "auto-advance",
};

export const LAB_OPTION_TAP_STEPS = Object.entries(LAB_STEP_INTERACTION)
  .filter(([, mode]) => mode === "option-tap")
  .map(([id]) => id);

export const LAB_PINNED_CTA_STEPS = Object.entries(LAB_STEP_INTERACTION)
  .filter(([, mode]) =>
    ["multi-continue", "form-continue", "explicit-cta"].includes(mode)
  )
  .map(([id]) => id);

export const LAB_AUTO_ADVANCE_STEPS = Object.entries(LAB_STEP_INTERACTION)
  .filter(([, mode]) => mode === "auto-advance")
  .map(([id]) => id);

export const LAB_INLINE_CTA_STEPS = Object.entries(LAB_STEP_INTERACTION)
  .filter(([, mode]) => mode === "inline-cta")
  .map(([id]) => id);

/** Map routed step id → lab screen module basename (when not shared Questions.jsx). */
export const LAB_STEP_SCREEN_FILE = {
  "q-grade": "BStudentGrade.tsx",
  "q-school-referral": "BSchoolReferral.tsx",
  "b-computing": "BComputing.tsx",
  "b-plan-ready": "BPlanReady.tsx",
  "b-email": "BEmailCapture.tsx",
  "b-zip": "BZipCode.tsx",
  "b-target-schools": "BTargetSchools.tsx",
  "b-regional-unlock": "BRegionalUnlock.tsx",
  "b-parent-name": "BParentName.tsx",
  "b-phone": "BPhoneVerify.tsx",
  "b-claim": "BClaimLesson.tsx",
  "b-book": "BBookLesson.tsx",
  "b-post-device": "BPostDevice.tsx",
  "b-post-share": "BPostShare.tsx",
  "b-post-join-tip": "BPostJoinTip.tsx",
  booked: "BBookedRedirect.tsx",
};
