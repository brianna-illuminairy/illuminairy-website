/**
 * Plan Builder step interaction modes — single source for guards and e2e.
 * Do not invent CTAs: match the mode the step was designed for.
 * Single-select intake: tap advances — no pinned Continue.
 * Interstitials: keep original step CTAs always visible (phased-cta may disable until ready).
 *
 * @typedef {'option-tap' | 'multi-continue' | 'form-continue' | 'explicit-cta' | 'auto-advance' | 'phased-cta'} StepInteractionMode
 */

/** @type {Record<string, StepInteractionMode>} */
export const STEP_INTERACTION = {
  'q1-parent-child': 'option-tap',
  'q-who': 'option-tap',
  'q-score-lower': 'option-tap',
  q1: 'option-tap',
  q2: 'option-tap',
  q3: 'option-tap',
  'hit-q3-none': 'auto-advance',
  'i-steps': 'explicit-cta',
  q4: 'option-tap',
  'q-doubts': 'multi-continue',
  'doubts-insight': 'explicit-cta',
  q5: 'option-tap',
  'hit-q5-tbd': 'auto-advance',
  'hit-outcome-month-one': 'explicit-cta',
  q6: 'multi-continue',
  q7: 'multi-continue',
  'hit-q7': 'explicit-cta',
  'i-diag': 'explicit-cta',
  'i-compare': 'explicit-cta',
  q9: 'option-tap',
  'hit-q8-scores': 'auto-advance',
  q8: 'option-tap',
  achievability: 'explicit-cta',
  reveal: 'explicit-cta',
  s1: 'explicit-cta',
  'i-gap': 'explicit-cta',
  name: 'form-continue',
  i2: 'phased-cta',
  v1: 'explicit-cta',
  s4: 'explicit-cta',
  s5: 'explicit-cta',
  s7: 'explicit-cta',
  s9: 'explicit-cta',
  booked: 'explicit-cta',
};

export const AUTO_ADVANCE_STEPS = Object.entries(STEP_INTERACTION)
  .filter(([, mode]) => mode === 'auto-advance')
  .map(([id]) => id);

export const OPTION_TAP_STEPS = Object.entries(STEP_INTERACTION)
  .filter(([, mode]) => mode === 'option-tap')
  .map(([id]) => id);

export const EXPLICIT_CTA_STEPS = Object.entries(STEP_INTERACTION)
  .filter(([, mode]) =>
    ['explicit-cta', 'multi-continue', 'form-continue', 'phased-cta'].includes(mode)
  )
  .map(([id]) => id);
