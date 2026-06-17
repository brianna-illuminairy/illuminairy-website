# PRD: Post-call sales pages (Diagnostic only + Diagnostic + $99/week)

- **SPEC:** [SPEC.md](./SPEC.md)
- **Research index:** [RESEARCH.md](./RESEARCH.md)
- **Phase 1 (industry):** [docs/post-call-sales-research.md](../../docs/post-call-sales-research.md)
- **Phase 2 (audience):** [docs/post-call-sales-audience-insights.md](../../docs/post-call-sales-audience-insights.md)
- **Date:** 2026-06-13
- **Status:** draft for owner review

## Problem

After a completed SAT Strategy Call, warm parents still face close-stage friction that causes delay or drop-off:

- uncertainty about exactly what they pay now
- uncertainty about what happens right after paying
- trust hesitation at payment moment
- proof skepticism before broader commitment

The product requirement is two single-offer destination pages with open embedded checkout so Brianna can send one link per lead and close with less ambiguity.

## Goals

1. Increase call-attended -> paid conversion.
2. Reduce page-view -> payment-start drop-off.
3. Reduce time from call end to payment.
4. Preserve trust and compliance with Illuminairy messaging constraints.

## Non-goals

- No in-page package selector between diagnostic-only and diagnostic+weekly.
- No score calculator, score guarantee language, or dynamic projection widget.
- No automation that overrides manual routing decisions.
- No redesign of unrelated site funnels.

## Users and use cases

### Primary user

- Parent who just completed a Strategy Call and was sent one page link.

### Use case A: diagnostic-only route

- Parent needs evidence first before weekly billing.
- Parent has unresolved uncertainty (fit, timeline, spouse decision, or likely cadence adjustment after diagnostic).

### Use case B: diagnostic + weekly route

- Parent is ready to start now with baseline cadence and no major unresolved fit blockers.

## Research synthesis model

The spec is built from two layers:

- **Industry baseline (phase 1):**
  - one-action destination pages
  - payment-first hierarchy
  - transparent pricing and trust cues
  - explicit next-step sequence
- **Audience delta (phase 2):**
  - stronger proof-before-commit need
  - higher need for parent visibility language
  - tutor-fit and schedule flexibility reassurance
  - school-list timeline framing

## Inputs and constraints

- Messaging and claims must follow [docs/messaging-guide.md](../../docs/messaging-guide.md).
- Outcome stats must come from [lib/site.ts](../../lib/site.ts).
- Routing and follow-up operating context lives in [docs/post-call-sales-routing-playbook.md](../../docs/post-call-sales-routing-playbook.md).
- Research basis lives in both phase artifacts linked above.

## Success metrics

- Primary:
  - call attended -> paid conversion rate by page type
- Secondary:
  - page viewed -> checkout started
  - checkout started -> payment completed
  - median hours from call end to payment completion
  - conversion by routing reason

## Requirements summary

1. Two separate post-call pages, one offer per page.
2. Open embedded checkout form visible on-page (no hidden payment redirect as primary path).
3. Payment-first hierarchy with concise "what is included" and trust/proof support.
4. Messaging tailored to post-call state (continuity, clarity, low-friction next step).
5. Event instrumentation to compare both variants and tighten routing over time.

## Risks

- Decision fatigue if both offers are shown together.
- False confidence from small audience sample.
- Tracking blind spots if routing reason and lag data are missing.

## Dependencies

- Final Stripe embedded checkout setup per offer.
- Final event schema confirmation in analytics implementation.
- Owner sign-off on copy and routing rubric.

## Launch readiness

Ship only after [SPEC.md](./SPEC.md) acceptance criteria are approved and research challenge + plan challenge issues are resolved.
