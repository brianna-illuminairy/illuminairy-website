# Active context

*Last updated: 2026-06-08*

## Danielle student portal (new)

Private route **`/danielle`** — email allowlist auth (`DANIELLE_ACCESS_ALLOWLIST` in Vercel). SAT plan HTML + diagnostic PDFs in `content/danielle/`. PDFs served at `/danielle/files/[slug]` (cookie path `/danielle`). **Deploy:** set env then push to `main`.

## Resume here

**Active spec (mobile cold traffic):** [`specs/2026-06-mobile-cold-traffic-funnel/SPEC.md`](../specs/2026-06-mobile-cold-traffic-funnel/SPEC.md)

**Plan reveal drop analysis (Jun 7–8):** [`growth/plan-reveal-drop-playbook.md`](../growth/plan-reveal-drop-playbook.md) — attributed cohort n=9, all replays tagged. Next: `post-plan-value-bridge`, `name-step-parent-drop`, `v1-below-fold-ux`.

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

## Recently shipped (2026-06-08)

- **LP ad message-match (local, uncommitted)** — `student_story` H1 for ad4/ad5; `mom_story` removed; responsive H1; `lp_variant` on LP/quiz/lead; hydration merge cookie∪localStorage; booking error dedupe + structured lead API errors; s5 TCPA tap target; `quiz_step_back`; PostHog dashboard doc updated. Verify: `FUNNEL_LAYOUT_UNLOCK=1 npm run agent:verify` PASS; `npm run funnel:e2e` PASS (37 checks). **Next:** commit + `npm run release`; Meta ad URLs `hook=student_story`; PostHog success metrics after traffic.
- **Chunk C split (Jun 8)** — keep step-registry refactor (Phase A/B) as a dedicated multi-session track; ship analytics/docs independently now (`step=q1-parent-child` canonical + `q-who` alias, step labels/seq on quiz events, checklist docs updated).
- **Hydration/resume hardening (Jun 8)** — removed timer-based hydration guards in quiz state/runner; hydration now resolves through reducer action (`HYDRATE`) before redirect + lastStep writes. Resume logic now deterministically prefers guarded saved step. Added e2e regression for stale cookie vs newer localStorage (`checkHydrationResumePriority` in `scripts/quiz-funnel-e2e.mjs`).
- **Attribution carry-forward hardening (Jun 8, uncommitted)** — landing analytics now persists one canonical attribution snapshot (`utm_*`, click IDs, `landing_page`, `hero_hook`) and reuses it across PostHog + GA4 + touch events for LP view/CTA. Also added attribution fan-out in shared `captureAnalytics()` so downstream custom captures inherit the same source context, plus `qWho` carry-forward (parent vs self) on late events such as booking confirmation / thank-you. Added attribution value sanitization + length caps before session persistence (sessionStorage only, no attribution cookie mirror) to avoid oversized payload regressions. Server routes now resolve canonical attribution + `qWho` from `visitors.first_touch`/`last_touch`/`quiz_answers` and persist that canonical context on touch/lead/booking events.
- **Mobile funnel architecture docs + spec (Jun 8, uncommitted)** — created:
- **Mobile funnel architecture docs + spec (Jun 8, shipped)** — created:
  - `specs/2026-06-mobile-cold-traffic-funnel/SPEC.md`
  - `docs/funnel-eventing-and-state.md`
  - `docs/funnel-analytics-standards.md`
  - `docs/funnel-hydration-and-resume.md`
  - `docs/funnel-mobile-ux-responsiveness.md`
  - `.agents/funnel-mobile-ops.md`
  Also switched `specs/ACTIVE.md` to the mobile cold-traffic funnel spec.
- **Visitor fast columns migration applied (Jun 8, shipped)** — `visitors_fast_attribution_columns` applied on Supabase via MCP; live columns/indexes: `visitors.first_utm_content`, `visitors.first_hero_hook`, `visitors.quiz_who`.
- **Completeness ops baseline (Jun 8, shipped)** — added `npm run funnel:completeness` monitor script + standing checklist `growth/mobile-funnel-qa-checklist.md`, and wired docs to include threshold policy (warn <98%, critical <95%).
- **Plan reveal drop playbook** — PostHog MCP pass on Jun 7–8 attributed cohort. [`growth/plan-reveal-drop-playbook.md`](../growth/plan-reveal-drop-playbook.md): product-order funnel **name→i2→v1** 9→6→6; 3 never saw plan reveal; not “0% reveal→name”.

## Recently shipped (2026-06-07)

- **UTM attribution fix** (`68ed3fe`) — `readAttributionForAnalytics()` merges session + URL for LP/quiz PostHog events; fixes ad5 `funnel_cta_click` showing 0 when replays showed clicks. Deployed prod.

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
npm run dev                              # http://localhost:3000/quiz?step=achievability
npm run funnel:step-registry && npm run build
```

- Answers: `localStorage` `qf_answers`
- Plan file: `.cursor/plans/funnel_qa_and_analytics_d046016d.plan.md` — **do not edit** unless user asks
