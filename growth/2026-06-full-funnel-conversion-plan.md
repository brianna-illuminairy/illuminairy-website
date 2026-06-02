# Full-funnel conversion pass — June 2026

**Session:** 2026-06-01 · **Scope:** Customer-facing growth copy (not plan-share, Supabase, layout/CSS).  
**Rules:** [`docs/messaging-guide.md`](../docs/messaging-guide.md) · [`growth/funnel-strategy.md`](./funnel-strategy.md) · stats from [`lib/site.ts`](../lib/site.ts) only.

---

## Locked vocabulary (copy-paste)

| Term | One line |
|------|----------|
| **SAT Improvement Plan** | Parent-facing deliverable from Plan Builder (~2 min); evolves Starter → Confirmed → Activated. Includes free **score projection**. |
| **Score projection** | Illustrative start/target band + timeline on reveal — bonus, not the product name. |
| **SAT Strategy Call** | Free 15 min advisory call for parent — targets, schools, timeline; books Week 1 diagnostic. **Not** a test. |
| **Skill Diagnostic** | Proctored student exam (~2 hr, shown as Part 1 + Part 2 in plan). Only proctored test in journey. |
| **Personalized plan review** | Fri Week 1 — advisor walks diagnostic results; activates weekly skill order. |
| **Activated Improvement Plan** | Same document after diagnostic — exact skills, missed questions, lessons filled in. |
| **Session** | Ambiguous in starter plan (self-study / tutoring / 1:1) until activation — intentional. |

**Primary CTA (funnel end):** Book your free SAT Strategy Call

**Banned on LP / step 1:** bare “assessment,” “Take the assessment,” “quiz,” student “study plan generator” positioning, “if you want to move forward”

---

## Conversion asset map

| Asset | Funnel step | Primary files | Skill |
|-------|-------------|---------------|-------|
| Product context | Foundation | `.agents/product-marketing.md` | product-marketing |
| B3 landing (b3a/b3b/b3c) | Cold → Plan Builder | `lib/landing/content.ts`, `components/landing/b3/` | copywriting, copy-editing, cro |
| LP ↔ ad match QA | Cold | `growth/ad-message-match-qa.md`, `growth/meta-lp-events.md` | ads, analytics |
| Icon UGC / Meta | Cold → `/plan` | `growth/icon-fall-sat-2026.md` (single file) | ads, ad-creative, copy-editing |
| Plan Builder `/plan` | Convert | `lib/quiz-funnel/*-copy.ts`, `app/quiz/screens/*` | cro, copy-editing, signup |
| Klaviyo nurture | Post-lead / post-book | `docs/klaviyo-quiz-funnel-nurture.md` | emails |
| Strategy Call SMS | Show-up | `growth/2026-06-strategy-call-sms.md` | sms |
| Analytics / experiments | Measure | `growth/posthog-funnel-dashboard.md`, `lib/landing/analytics.ts`, `lib/quiz-funnel/analytics.ts` | analytics, ab-testing |

---

## Per-asset status (pre-pass inventory)

| Asset | Status | Notes |
|-------|--------|-------|
| Product vocabulary (customer UI) | ✅ | Heroes, meta, quiz layout aligned |
| Internal strategy docs | ⚠️ | `b3-lp-copy-image-audit.md` stale vs code — P2 sync |
| B3 landing | ⚠️ → ✅ | P0: banned “score jump” in reviews title |
| LP ↔ ad message match | ✅ | Heroes match `ad-message-match-qa.md` |
| Plan Builder `/quiz` | ✅ | P1: s5 next-step line |
| Icon UGC | ⚠️ → ✅ | UTMs, hooks, Script 4/5 term lock |
| Klaviyo nurture | ⚠️ → ✅ | Preview text, doc title, Flow D bodies |
| Show-up | ✅ | `thank-you-copy.ts`, `Finale.tsx` |
| Stats | ✅ | `lib/site.ts` |
| Analytics | ✅ | A/B section added to PostHog doc |

---

## Prioritized backlog

### P0 — shipped this session

| Item | Skill | File |
|------|-------|------|
| Banned “score jump” on LP reviews | copy-editing | `lib/landing/content.ts` |
| Icon script copy-edit + UTMs + term lock | ads, ad-creative, copy-editing | `growth/icon-fall-sat-2026.md` |
| Master plan + asset map | product-marketing | this file |

### P1 — shipped this session

| Item | Skill | File |
|------|-------|------|
| Meta hook variants (**6×3 = 18 lines**) | ad-creative | `growth/icon-fall-sat-2026.md` |
| Klaviyo Flow B/C/D/E + preview text | emails | `docs/klaviyo-quiz-funnel-nurture.md` |
| Strategy Call SMS drafts | sms | `growth/2026-06-strategy-call-sms.md` |
| s5 lead gate next-step line | signup | `lib/quiz-funnel/thank-you-copy.ts` |
| CRO hypotheses + A/B tests | cro, ab-testing | this file § CRO · `posthog-funnel-dashboard.md` |
| Funnel-wide conversion principle | product-marketing | `.agents/product-marketing.md` |

### P2 — deferred

| Item | Skill | File |
|------|-------|------|
| Sync stale b3 audit doc | copy-editing | `growth/b3-lp-copy-image-audit.md` |
| LP photography / section order | cro | `b3-lp-photo-shot-list.md` |
| Insight eyebrow “What we noticed” | copy-editing | `lib/quiz-funnel/insight-hits.ts` |
| Legacy score-path strategy docs | — | `growth/score-path-edge-cases.md` |
| Meta creative refresh if ads ≠ LP | ads | outside repo |

---

## Execution order (this session)

1. Phase 0 — this doc  
2. Phase 1 — `.agents/product-marketing.md`  
3. Phase 2 — Icon UGC + ad variants  
4. Phase 3 — `lib/landing/content.ts`  
5. Phase 4 — quiz `*-copy.ts` / s5  
6. Phase 5 — Klaviyo + SMS  
7. Phase 6 — PostHog doc  
8. Phase 7 — grep, build, changelog  

---

## CRO hypotheses (B3 + funnel)

1. **Hero variant (b3a vs b3b vs b3c):** Primary `funnel_cta_click` / `funnel_landing_view`; secondary `quiz_lead_submitted` / `quiz_booking_confirmed` by `sat_lp_variant`. ~200 views/arm or 14 days.
2. **Hero CTA label:** “Get their improvement plan” vs “Start the Plan Builder →” on winning variant.
3. **Mobile section order:** Reviews before `included` — scroll-depth + CTA on mobile only.
4. **Sticky mobile CTA** after hero scroll — `funnel_cta_click` from `section_id` non-hero.
5. **b3b stat row:** Emphasize HIT TARGET vs AVG PTS accent — message-match to parent anxiety vs proof.

**Funnel (no layout):** s5 subhead clarity + “Step 1 of 2” framing already strong; monitor `quiz_lead_submitted` → `quiz_booking_confirmed` drop.

---

## A/B tests (prioritized)

| # | Test | Primary metric | Sample | Status |
|---|------|----------------|--------|--------|
| 1 | b3a vs b3b vs b3c hero | `funnel_cta_click` rate | ~200 views/arm | 🔲 PostHog flag `sat-lp-variant` |
| 2 | Hero micro-copy on winner | CTA + lead rate | ~200 views/arm | 🔲 After test 1 winner |

See [`posthog-funnel-dashboard.md`](./posthog-funnel-dashboard.md) · [`ad-message-match-qa.md`](./ad-message-match-qa.md).

---

## Execution log

| Phase | Task | Status |
|-------|------|--------|
| 0 | Master plan doc | ✅ |
| 1 | product-marketing principle | ✅ |
| 2 | Icon UGC + ad variants | ✅ |
| 3 | B3 LP reviews title | ✅ |
| 4 | Quiz s5 copy | ✅ |
| 5 | Klaviyo + SMS | ✅ |
| 6 | PostHog A/B section | ✅ |
| 7 | Grep + build | ✅ |

---

## Changelog (2026-06-01)

| File | Change |
|------|--------|
| `growth/2026-06-full-funnel-conversion-plan.md` | Created — inventory, backlog, CRO, A/B, log |
| `.agents/product-marketing.md` | Funnel-wide conversion principle |
| `lib/landing/content.ts` | Reviews title: removed banned “score jump” |
| `growth/icon-fall-sat-2026.md` | Single Icon file: Meta 18 lines, UGC scripts, cold-opens |
| `lib/quiz-funnel/thank-you-copy.ts` | `S5_AFTER_SUBMIT_NEXT_STEP` |
| `docs/klaviyo-quiz-funnel-nurture.md` | Title, preview text, Flow D bodies |
| `growth/2026-06-strategy-call-sms.md` | New — T-24h / T-1h SMS |
| `growth/posthog-funnel-dashboard.md` | Message-match link, A/B tests |
| `lib/plan-builder-routes.ts` | New — canonical `/plan` path helper |
| `next.config.mjs` | `/plan` rewrite + `/quiz` → `/plan` redirect |
| App + growth URLs | `/quiz` → `/plan` in links, router, Klaviyo, Icon |

**Icon re-approval:** **Yes** — re-run checklist after **2026-06-02 truthfulness pass** (no pre-diagnostic “which skills,” no PSAT-primary hooks, no fluff: “real plan,” “one path,” “brilliant at school”).

**2026-06-02 correction:** All Icon/Meta copy in `growth/icon-fall-sat-2026.md` (merged from old variants + UGC files).

**Manual QA URLs:**

- `https://illuminairy.com/?lp=b3a&utm_campaign=sat-lp-b3a-problem&utm_source=facebook`
- `https://illuminairy.com/?lp=b3b&utm_campaign=sat-lp-b3b-results&utm_source=facebook`
- `https://illuminairy.com/?lp=b3c&utm_campaign=sat-lp-b3c-authority&utm_source=facebook`
- `https://illuminairy.com/plan?step=q1`
- `https://illuminairy.com/plan?step=q1&utm_source=icon&utm_campaign=fall_sat_retake&utm_content=script_1`
