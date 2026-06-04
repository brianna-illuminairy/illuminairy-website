# Active context

*Last updated: 2026-06-02*

## Resume here

**Full session handoff (start next chat with this):** [`session-handoff-2026-05-29-funnel-qa.md`](./session-handoff-2026-05-29-funnel-qa.md)

## Current focus

- **SAT Improvement Plan funnel** — `/quiz` — parent Plan Builder → reveal → SAT Strategy Call → Week 1 Skill Diagnostic → activated plan.
- **B3 landing** — `/` — PostHog A/B (`b3a` / `b3b` / `b3c`); hands off to `/quiz?step=q1`.
- **Separate funnels (out of scope unless asked):** `/satplan`, `/assessment`.

## Messaging (locked — do not re-debate)

**Strategy:** [`growth/funnel-strategy.md`](../growth/funnel-strategy.md)  
**Tactical copy:** [`docs/messaging-guide.md`](../docs/messaging-guide.md)  
**Rules:** `.cursor/rules/messaging-guide.mdc`, `banned-copy-phrases.mdc`

| Topic | Decision |
|-------|----------|
| Product | **SAT Improvement Plan** (+ score projection). Retire customer-facing **SAT Score Path**. |
| Call | **SAT Strategy Call** (15 min) — before Week 1. |
| Diagnostic | **Skill Diagnostic** — Part 1 Mon + Part 2 Wed; Fri plan review. |
| Audience | Parents — never “quiz” or bare “assessment” on LP/step 1. |
| Banned | “if you want to move forward,” “Take the assessment,” student plan-generator SEO. |
| Stats | `lib/site.ts` only; “Results vary.” |

## Funnel spine

`q1–q5` → `i1` → `q6` → `q7` → `hit-q7` → `i-compare` → … → `reveal` → `v1` → `s2` → `s3` → `s5` → `s7` → `s9` → `booked`

Key libs: `plan-reveal.ts`, `score-path-copy.ts`, `stakes-copy.ts`, `education-slides.ts`, `prep-failure-copy.ts`, `thank-you-copy.ts`

## Recently shipped (2026-05-29)

- `growth/funnel-strategy.md` + LP/quiz P0 vocabulary + analytics enrichment + full slide messaging pass + reveal→booked polish.
- `npm run funnel:step-registry` — step/switch guard.

## Recently shipped (2026-06-03)

- **LP redesign → v4** — `/` now renders the ported "SAT Landing v4" (`components/landing/v4/*`, `app/landing/landing-v4.css`), replacing the compact B3 LP. Funnel logo header (`IlluminairyLogoV7`), navy CTA card, 3-stat trust bar. Hook-aware H1 (script_5 gap etc.). CTA → `/plan?step=q1` with UTMs.
- **No sticky CTA** — compact, minimal-scroll page; hero CTA above fold (short-viewport `@media (max-height:720px)` for FB/IG in-app browsers).
- **Safari/ITP click IDs** — `lib/meta-click-ids.ts` captures/persists `_fbp`/`_fbc` (+ synth from `fbclid`) at LP load; `AttributionSnapshot` gained `fbp`/`fbc`; Finale Lead CAPI now resolves with fallback.
- **Design archive** — `growth/lp-designs/` (v1–v4/AB/compact + decoded v4) for A/B refs; eslint-ignored.
- **Copy flags (verbatim)** — "500+ families", "4.8 rating", "College Board 250,000+" not in `lib/site.ts` (owner call).
- **Verify** — `npm run build` PASS, `/` static; my files lint-clean. `agent:verify` lint blocked by **pre-existing** quiz-file errors (untouched). Session: [`growth/2026-06-03-lp-v4-port-session.md`](../growth/2026-06-03-lp-v4-port-session.md).

## Recently shipped (2026-06-02)

- **B3 LP compact layout** — default `compact` (hero + trust + legal); `?lp_layout=full` for full scroll QA; sticky mobile CTA; `sat_lp_layout` analytics
- **Trust bar (default)** — score + school **marquee ticker**; R&W and Math split (~14/16 R&W-stronger, varied gaps); `lib/landing/trust-scores.ts`
- **Trust bar (preview)** — mom reviews carousel via `?trust_bar=mom_reviews`; `lib/landing/trust-bar-variant.ts`
- **Hero copy** — subhead = score bands only; fine print below CTA; gap hook via `utm_content=script_5`
- **Layout fix** — removed `100dvh` overflow lock that hid mobile CTA / overlapped hero
- **Design assets** — `public/illuminairy-lp-compact-design.html`, `public/lp-review.html`, `scripts/export-lp-compact-design-html.mjs`
- **Session doc** — [`growth/2026-06-02-compact-lp-trust-bar-session.md`](../growth/2026-06-02-compact-lp-trust-bar-session.md)
- LP CTAs → `planBuilderEntryFromLanding()`; P0 interim images in `lib/landing/assets.ts`
- **Not deployed** — local/staging review only unless owner requests prod

## Recently shipped (2026-06-01)

- UGC Icon revisions doc, staged-disclosure LP copy, Klaviyo nurture doc, image production checklist
- Calendly webhook `strategy_call_at` + show-up copy (s7/s9/booked)
- LP slots: `stepStrategyCall`, `stepWeeklyPlan`
- **marketingskills** (11 skills in `.agents/skills/`) + [`.agents/product-marketing.md`](../.agents/product-marketing.md) + [`growth/marketingskills-usage.md`](../growth/marketingskills-usage.md)
- **Plan share virality** — reveal share panel + `/quiz/share/[id]` + API; see [`growth/plan-share-virality.md`](../growth/plan-share-virality.md). **`plan_shares` table applied on prod** (2026-06-01).

## Next (pending)

- [ ] QA share link end-to-end on prod (reveal → copy link → incognito → CTA)
- [ ] Prod Supabase/UTM + Calendly webhook QA (checklist in `growth/quiz-funnel-qa-log.md`)
- [ ] Klaviyo Flows B/C/D in UI per `docs/klaviyo-quiz-funnel-nurture.md`
- [ ] Lighthouse + viewport matrix → `growth/quiz-funnel-qa-log.md`
- [ ] LP photos #1–#6 per `growth/b3-lp-image-production-checklist.md`
- [ ] Icon script re-approval + paste from `growth/icon-fall-sat-2026.md`
- [ ] Parked: late-funnel s3→s9 carrot UI

## Dev quick ref

```bash
npm run dev                              # http://localhost:3000/quiz?step=reveal
npm run funnel:step-registry && npm run build
```

- Answers: `localStorage` `qf_answers`
- Plan file: `.cursor/plans/funnel_qa_and_analytics_d046016d.plan.md` — **do not edit** unless user asks
