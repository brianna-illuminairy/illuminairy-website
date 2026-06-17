# Post-Call Sales Audience Insights (Phase 2)

- **Date:** 2026-06-13
- **Scope:** Audience-specific evidence only (after phase 1 external baseline)
- **Goal:** Identify what Brianna's current parent audience explicitly cares about on post-call decision pages.

## Inputs Used

1. One structured call extraction output:
   - `/tmp/monique-extract.json`
2. CRM tagging taxonomy and extractor schema:
   - `lib/admin/lead-tag-suggestions.ts`
   - `lib/integrations/gemini/extract-call.ts`
3. Existing parent-voice strategy docs:
   - `growth/funnel-strategy.md`
   - `docs/research/parent-voice-social-listening-2026-05.md`
   - `docs/sat-messaging-positioning.md`

## What This Audience Cares About Most (Current Signals)

## 1) Proof-before-commit, not blind subscription

- In the Monique call, the parent explicitly asks for outcomes and baseline-first confidence before deeper commitment.
- CRM taxonomy has "needs_proof_of_results" and "doesnt_believe_score_can_improve" as standard objection targets.
- Strategy docs repeatedly frame parent anxiety as "we did the work, where is the movement?"

**Audience meaning:** post-call pages must reduce risk perception with concrete "what this purchase proves or unlocks."

## 2) Price clarity and affordability control

- The Monique call notes direct cost questioning and counselor-influenced caution on over-investing before baseline.
- CRM objection set includes price sensitivity tags as common picks.

**Audience meaning:** billing terms need to be explicit and short, with no hidden interpretation burden.

## 3) "Show me exact next steps," not abstract promises

- Parent JTBD language in strategy docs asks for a credible, shareable plan and clear weekly visibility.
- Monique extract shows high responsiveness when next-step path is concrete and time-bound.

**Audience meaning:** the destination page needs "what happens next" in plain sequence immediately after payment block.

## 4) Tutor-fit confidence and flexibility

- In the Monique extract, tutor personality fit and schedule flexibility are explicit priorities.
- CRM priorities include one-on-one, fit, evening/weekend/flexible timing as recurrent structured categories.

**Audience meaning:** close pages should include fit/reassignment reassurance and scheduling flexibility cues.

## 5) Parent visibility and accountability

- Monique priorities include weekly progress reporting.
- Strategy docs and messaging docs consistently position parent visibility as central trust lever.

**Audience meaning:** "weekly visibility/reporting" belongs in included-items and proof messaging, not buried in long copy.

## 6) School-list and timeline pressure

- Monique evidence references named target schools and August timeline pressure.
- Strategy docs repeatedly describe list pressure and summer decision windows.

**Audience meaning:** close pages should tie purchase value to immediate timeline and school-list decision confidence.

## Audience Deltas vs Industry Baseline

Relative to generic industry close-page patterns, this audience appears to need stronger emphasis on:

1. Diagnostic evidence as the trust bridge.
2. Parent oversight language (visibility, reports, clear next actions).
3. Tutor-fit safeguards.
4. Explicit schedule flexibility.
5. School-list timeline framing.

## Phase 2 Challenge (Representativeness Stress Test)

### Risk A: Small call sample can overfit one parent profile

- We have detailed extraction for a single named call (`/tmp/monique-extract.json`), not a large observed distribution.
- **Decision:** treat call-level specifics as directional examples, not hard frequency truths.

### Risk B: CRM tags are designed categories, not measured prevalence

- `lead-tag-suggestions.ts` is a curated taxonomy and "common" list, not an empirical leaderboard.
- **Decision:** use as a structured hypothesis set; avoid claiming "top objections by volume" until reporting exists.

### Risk C: Founder-stage operations may distort objections

- Current process is still evolving (user explicitly noted packages, qualification, and lead gen are not end-state).
- Some objections may be process-induced, not durable market traits.
- **Decision:** separate stable parent concerns (proof, clarity, trust, fit) from process-sensitive concerns (current packaging confusion).

### Risk D: Social listening may over-index on vocal forum parents

- Parent-voice research is useful language input but not a random market sample.
- **Decision:** use for message resonance and phrasing, not numeric prioritization.

## What Survives Challenge (High-confidence Audience Truths)

1. Parents need evidence before larger commitment.
2. Parents need explicit and simple billing clarity.
3. Parents want clear next-step sequence they can explain at home.
4. Tutor fit and schedule flexibility reduce close friction.
5. Parent visibility/accountability messaging increases trust.

## Open Measurement Needs Before Stronger Claims

1. Frequency table of objections from `lead_calls` extracted outputs.
2. Conversion by objection cluster and page type.
3. Time-to-pay by routing reason.
4. Win/loss reasons after "comparing options first."
