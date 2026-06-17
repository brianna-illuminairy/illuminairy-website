# Spec: Post-call sales pages (Diagnostic only + Diagnostic + $99/week)

- **PRD:** [PRD.md](./PRD.md)
- **Research index:** [RESEARCH.md](./RESEARCH.md)
- **Phase 1 (industry):** [docs/post-call-sales-research.md](../../docs/post-call-sales-research.md)
- **Phase 2 (audience):** [docs/post-call-sales-audience-insights.md](../../docs/post-call-sales-audience-insights.md)
- **Routing context:** [docs/post-call-sales-routing-playbook.md](../../docs/post-call-sales-routing-playbook.md)
- **Date:** 2026-06-13
- **Status:** draft, spec-only

## Summary

Define two separate post-call conversion pages with one-offer focus and open embedded Stripe checkout. This spec merges:

- **Industry baseline** for close pages (payment-first, transparency, trust cues, one CTA).
- **Audience deltas** for this parent segment (proof-before-commit, visibility, tutor-fit reassurance, school-list timing context).

## Acceptance criteria

- [ ] Exactly two pages are defined: `diagnostic_only` and `diagnostic_plus_weekly`.
- [ ] Each page has one dominant CTA path and an open embedded checkout form above the fold.
- [ ] No in-page package chooser appears.
- [ ] No calculator, score guarantee, or unsupported claims appear.
- [ ] Payment copy clearly states what is charged today and what happens next.
- [ ] "What is included" section is concise and specific.
- [ ] Proof section uses approved stats from [lib/site.ts](../../lib/site.ts) and includes "Results vary."
- [ ] Trust cues are present near payment form ("Secure checkout powered by Stripe" and payment reassurance).
- [ ] Mobile-first usability is explicit (payment visible early, no unnecessary scroll traps).
- [ ] Event tracking supports page-level and funnel-step comparison.
- [ ] Every major requirement is traceable to either industry baseline or audience delta.

## Requirement source map

| Requirement | Source |
|---|---|
| One offer per page | Industry baseline |
| Payment-first hierarchy | Industry baseline |
| Transparent charge-now/charge-later lines | Industry baseline |
| Trust cues near payment | Industry baseline |
| Included items + next-step timeline | Industry baseline |
| Strong proof-before-commit language | Audience delta |
| Parent visibility wording (weekly updates/progress) | Audience delta |
| Tutor-fit and schedule-flex reassurance | Audience delta |
| School-list/timeline context relevance | Audience delta |

## Page architecture (both variants, fixed order)

Order is fixed to minimize drop-off:

1. **Continuity header**
   - Purpose: confirm this page is the direct continuation of the Strategy Call.
   - Source: Industry baseline.

2. **Payment-first module (primary conversion block)**
   - Embedded checkout form open on page.
   - Price clarity line directly above form.
   - Fit-clarity sentence for what gets confirmed after diagnostic.
   - Security/reassurance line near form.
   - Source: Industry baseline.

3. **What is included**
   - 4-6 bullets max.
   - Must answer "what happens in the next 7 days" and "what do we get immediately."
   - Source: Industry baseline + audience delta (clarity needs).

4. **Proof + testimonials**
   - One short outcomes proof line from `satProgramOutcomes` or `satFirstMonthOutcomes`.
   - "Results vary." visible.
   - 2-3 short parent quotes mapped to proof skepticism.
   - Source: Audience delta (proof-before-commit).

5. **Micro-FAQ (objection compression)**
   - 3-4 FAQs max.
   - Focus on billing timing, diagnostic purpose, tutor fit/schedule, and next-step clarity.
   - Source: Audience delta.

## Variant-specific content requirements

## A) Diagnostic only page

### Message intent

- Lower-friction first yes.
- Explicitly addresses "I need proof first" objection.
- Source: Audience delta.

### Required content points

- "Today" charge line for diagnostic-only payment.
- Clarify that weekly cadence recommendation is finalized after diagnostic review.
- Include bullets emphasizing diagnostic outputs:
  - ranked weakest skills
  - why misses happen
  - specific weekly plan recommendation

### Objections this page must neutralize

- needs proof of results
- comparing options first
- spouse decision delay
- concern about over-committing too early

## B) Diagnostic + $99/week page

### Message intent

- Immediate start and execution continuity.
- Confidence for ready-to-start parents.

### Required content points

- "Today" diagnostic payment line.
- Clear baseline weekly billing line at $99/week and when it starts.
- Clarify that cadence can still be adjusted after diagnostic evidence.
- Include bullets emphasizing no-gap start:
  - diagnostic in week one
  - immediate weekly tutoring baseline
  - progress visibility and updates

### Objections this page must neutralize

- fear of losing momentum
- concern about unclear next steps
- skepticism that online weekly support will stay personalized

## Messaging rules

- Parent-facing plain language only.
- Use product naming and tone constraints from [docs/messaging-guide.md](../../docs/messaging-guide.md).
- No banned phrasing from `.cursor/rules/banned-copy-phrases.mdc`.
- No score guarantee language.
- All outcomes tied to approved data in [lib/site.ts](../../lib/site.ts), with "Results vary."

## UI/UX and design rules

- Minimal visual noise:
  - no competing nav/promotional modules in conversion zone
  - no side-by-side plan comparisons
- Payment module visual hierarchy:
  - first visible block on mobile and desktop
  - embedded form has clear visual container
- Readability:
  - short sections, no dense text walls
  - 1 idea per line in high-friction sections
- Mobile-first:
  - avoid long pre-form copy before payment
  - avoid hidden CTA state that requires multiple scroll actions

## Checkout behavior requirements

- Use open embedded Stripe checkout as default payment interaction.
- Keep user on page during payment flow.
- Keep fallback behavior explicit (if embed fails, show direct secure fallback link).
- Show plain-language payment expectation:
  - what is charged now
  - what starts later (if applicable)
  - where confirmation appears next

## Routing requirements (owner-controlled)

- Routing remains manual by Brianna.
- Each lead receives exactly one page link per follow-up touch.
- Routing logic is informed by readiness/fit signals from calls, not self-selection on page.

## Analytics requirements

Track by `page_type` (`diagnostic_only` or `diagnostic_plus_weekly`):

- `post_call_sales_page_viewed`
- `post_call_payment_clicked`
- `post_call_payment_completed`
- `post_call_link_sent`

Recommended joins:

- call attended timestamp -> link sent -> page viewed -> payment completed
- lag hours by page type and by objection cluster
- lag hours by routing reason
- routing reason vs conversion outcome

## Files / areas likely touched (implementation phase only)

- `app/post-call/diagnostic-only/page.tsx`
- `app/post-call/diagnostic-plus-weekly/page.tsx`
- `components/post-call-sales/*`
- `lib/post-call-sales.ts`
- `lib/analytics-events.ts`
- `docs/post-call-sales-routing-playbook.md`

## Phase 3 challenge (adversarial synthesis review)

### Challenge 1: Offer confusion

- **Risk:** Parents may still be confused about diagnostic vs weekly commitment.
- **Mitigation:** one-offer-per-page rule and explicit "charged now vs starts later" copy requirement.

### Challenge 2: Overweighting checkout UX over message trust

- **Risk:** A clean checkout alone may not convert if proof is weak.
- **Mitigation:** mandatory proof block + testimonial block above long FAQ content.

### Challenge 3: Audience sample is not fully representative yet

- **Risk:** Current audience insights may overfit early-stage calls.
- **Mitigation:** keep audience deltas limited to patterns that recur across call evidence, taxonomy, and parent-voice docs; refresh quarterly.

### Challenge 4: Manual routing inconsistency

- **Risk:** Conversion differences might reflect send quality, not page quality.
- **Mitigation:** require `routing_reason` capture on link sent and analyze conversion by reason cluster.

### Challenge 5: Measurement blind spots

- **Risk:** team cannot tell whether improvements come from copy, routing, or speed-to-follow-up.
- **Mitigation:** track and report all three dimensions weekly.

## QA checklist (for implementation phase)

- [ ] Embedded checkout loads on both pages without redirect as primary path.
- [ ] Payment block appears first on mobile and desktop.
- [ ] Copy passes messaging and banned-phrase checks.
- [ ] Stats match [lib/site.ts](../../lib/site.ts).
- [ ] Event payload includes `page_type`.
- [ ] Event payload includes `routing_reason`.
- [ ] Call-end-to-paid lag report can be generated weekly.
- [ ] `npm run agent:verify` passes after implementation.

## Out of scope

- Automated route selection logic.
- New pricing experiments beyond the two defined offers.
- Large brand redesign work outside post-call surface.
