# B3 landing — copy & image audit (b3a / b3b / b3c)

**Purpose:** Section-by-section recommendations for `/` B3 variants. Aligns LP with [`funnel-strategy.md`](./funnel-strategy.md) vocabulary (SAT Improvement Plan, SAT Strategy Call, no bare "assessment").

**Sources:** [`lib/landing/content.ts`](../lib/landing/content.ts), [`components/landing/b3/`](../components/landing/b3/), [`b3-lp-photo-shot-list.md`](./b3-lp-photo-shot-list.md).

**Status:** P0 vocabulary shipped 2026-05-29. **Staged-disclosure copy** shipped 2026-06-01 — see [`b3-lp-staged-disclosure-copy.md`](./b3-lp-staged-disclosure-copy.md). Images: [`b3-lp-image-production-checklist.md`](./b3-lp-image-production-checklist.md).

---

## Cross-variant (shared sections)

| Section | Current (post-P0) | Proposed / notes | Image | Priority |
|---------|-------------------|------------------|-------|----------|
| **Science** | Diagnostic-driven plan; breadth vs focus | Keep — matches quiz i-diag framing | `lp-science.jpg` placeholder | P1 — real tutor+student diagnostic moment |
| **Great news** | Stronger score in future; footnote requires Skill Diagnostic after call | Keep footnote; avoid "explore SAT plans" sounding like checkout | `lp-great-news.jpg` | P2 polish overlay copy |
| **Included** | Skill Diagnostic maps N areas + weekly plan + tutor | Keep; "Skill Diagnostic" not "diagnostic assessment" | `lp-included.jpg` | P1 card-style plan screenshot |
| **Reviews** | 3 parent quotes, verified badge | Keep; quotes already mention diagnostic | before/after slots | P2 — real parent photos if permitted |
| **How it works** | 1 Plan Builder → 2 Strategy Call → 3 Skill Diagnostic → 4 weekly plan | **Shipped.** Image order remapped in `b3-body.tsx` | See step table below | P0 copy ✓ · P1 photos |
| **Final CTA** | Score/plan/pace checklist | Keep Khan-breadth line | — | P2 |
| **Footer** | Newsletter + legal | Keep | — | — |

### How it works — image map (after P0)

| Step | Copy title | Slot file | Proposed shot |
|------|------------|-----------|---------------|
| 01 | Answer a few questions | `lp-step-assessment.jpg` | Parent on phone, quiz q1 visible |
| 02 | SAT Strategy Call | `lp-step-strategy-call.jpg` | Advisor + parent on video / calendar |
| 03 | Skill Diagnostic | `lp-step-diagnostic.jpg` | Student at laptop, proctored exam UI |
| 04 | Personalized weekly plan | `lp-step-weekly-plan.jpg` | Weekly plan / mentor session |

---

## b3a-problem (GPA / SAT gap)

| Section | Current copy | Proposed | Image | Priority |
|---------|--------------|----------|-------|----------|
| **Hero H1** | High GPA. Low SAT. Fixable. | Keep — strong DR hook | `b3a-hero-student` + session grid | P1 real photography |
| **Hero checklist** | Score path, 5 skill gaps, focus first | **Shipped** — still says "score path" in bullet 1; consider "improvement path" for consistency | — | P2 micro-copy |
| **Hero CTA** | Get improvement plan + score projection | **Shipped** | — | P0 ✓ |
| **Hero disclaimer** | n=95 avg gains | Keep with "Individual results vary" | — | P0 ✓ |

---

## b3b-results (social proof)

| Section | Current copy | Proposed | Image | Priority |
|---------|--------------|----------|-------|----------|
| **Hero H1** | +182 points. On a focused path. | Keep — numbers from `lib/site.ts` | Stats hero optional | P0 ✓ |
| **Hero stats row** | PATHS BUILT / AVG PTS / HIT TARGET | Rename label "PATHS BUILT" → **"PLANS BUILT"** for Improvement Plan vocabulary | — | P2 |
| **Hero checklist** | 3.2× CB avg, 78% hit target, free Improvement Plan | **Shipped** | — | P0 ✓ |
| **Disclaimer** | Last 95 completed plans | Keep; matches quiz i-compare removal of inline n=95 on chart foot | — | P0 ✓ |

---

## b3c-authority (College Board data)

| Section | Current copy | Proposed | Image | Priority |
|---------|--------------|----------|-------|----------|
| **Eyebrow** | BUILT ON COLLEGE BOARD DATA | Keep | `b3c-hero.jpg` | P1 |
| **Hero H1** | A score path built on 250k+ student scores | Consider **"An improvement path built on…"** (retire "score path" in H1) | — | P2 |
| **Hero checklist** | CB trends, test date personalization, ~2 min trust line | **Shipped** | — | P0 ✓ |

---

## Rejected / do not ship on LP

- "Take the assessment" / bare "assessment" in hero or meta
- Student-facing "study plan generator" SEO angle
- "If you want to move forward" anywhere
- Customer-facing **SAT Score Path** (internal code names OK)

---

## Next actions

1. **Photo shoot** per [`b3-lp-photo-shot-list.md`](./b3-lp-photo-shot-list.md) — priority: hero grids + how-it-works step 02 Strategy Call asset
2. **P2 copy** — b3a bullet "score path" → "improvement path"; b3c H1; b3b stat label
3. **QA** — message-match ads to winning variant hook; UTMs on LP → quiz → S5 (see [`posthog-funnel-dashboard.md`](./posthog-funnel-dashboard.md))
