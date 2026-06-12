# Enroll onboarding — gstack agent context brief

> **Partially stale (2026-06-11).** Owner direction changed: no `/plan` parity, desktop-first 1200px, no "SAT Accelerator" parent-facing, Cormorant+DM Sans from brand guide. **Canonical flow:** [`enroll-ux-design.md`](./enroll-ux-design.md) + [`enroll-gstack-review.md`](./enroll-gstack-review.md). Refresh this brief after owner gate.

Paste-friendly context for gstack skills. Load **with** the UX design + gstack review docs above.

---

## Who Illuminairy is

Illuminairy is **premium SAT mentorship** for parents of ambitious high schoolers. Near-peer mentors from Georgia Tech who scored **1450+** on the SAT. Diagnostic-first: score movement is usually **5–6 skills ranked by mistake patterns**, not re-teaching the whole test. Atlanta-based; legal entity Zytech Development LLC.

The product live on `/enroll` is the **SAT Accelerator** — `lib/site.ts` `satProgram`:

| Fact | Value |
|------|-------|
| Tuition | **$1,200** |
| Length | **12 weeks** |
| Exam day | **August 22, 2026** |
| Cadence | Weekly Reading & Writing + Math live classes (max 10 students), **6 personalized 1:1s**, **week-one Skill Diagnostic**, weekly progress reports |
| Effort | **~5–7 hrs/week** student time |
| First-month outcome | **90%** of students who follow the diagnostic-driven plan achieve **100+ points** their first month at 5–7 hrs/week (Results vary) |

**Always pull tuition/dates/stats from `lib/site.ts`** — never duplicate numbers elsewhere.

## Parent on `/enroll` is the reader

| | |
|--|--|
| **Buyer** | Parent (often mom, 42–57), college-educated, affluent suburban; researching for 10th–12th grader |
| **Student** | Ambitious; often **GPA–SAT mismatch** (strong grades, SAT doesn't match list) |
| **Mindset** | Skeptical after Khan / group class / scattered tutoring failed; wants **clarity, shareable plan, weekly visibility** |
| **Jobs** | "Is improvement realistic?" · "Give me something concrete for my spouse" · "Don't waste 3 more months on the wrong skills" |
| **Georgia skew** | UGA / Georgia Tech / Emory list pressure (`docs/seo-georgia-parent-icp.md`) |
| **Not ICP** | DIY-only; student searching "study plan generator"; casual retake with no list pressure |

`/enroll` is **post-commitment**, not lead capture. Tone is warmer, professional, consumer-checkout — not sales-y, not internal-CRM-form.

## How they got here (do not contradict)

```
Meta ad (utm_content=script_5, hook=GPA-SAT gap)
  → LP / Plan Builder `/plan` (~2 min, parent-only, no child test)
  → Plan reveal `v1` + Strategy Call booking `s5`
  → Stripe checkout — $1,200 SAT Accelerator
  → /enroll?session_id=…  ← THIS PAGE
```

**Live ad angle:** `script_5` — "good grades, low SAT" / GPA–SAT **gap** hook (`growth/ad-message-match-qa.md`). Hero message match: high GPA + SAT that doesn't fit the transcript. Don't reintroduce funnel insights, don't re-sell.

**What they already saw on the funnel:** insight hits, outcome stats with "Results vary," personalized plan reveal, Strategy Call scheduler. Step `name` collected the **child's first name** (`kidName` → must prefill `studentFirst` on enroll).

**Product promises parent expects on `/enroll`:**
- **Skill Diagnostic** in week one (2 hr 14 min proctored — separate from the 15-min Strategy Call they may have already had)
- **Weekly progress reports** to parent during the program
- Weekly classes + 6 personalized 1:1s

The weekly-reports step on `/enroll` is **fulfilling a promise**, not a new ask.

## Product names (use these exact strings)

- **SAT Score Path** — never "quiz"
- **Plan Builder** — `/plan` (the funnel they came through)
- **Strategy Call** — 15 min advisory (already happened or already booked)
- **Skill Diagnostic** — 2 hr 14 min proctored (booked on `/enroll`); never "diagnostic on the call"
- **Personalized weekly plan** — never "blueprint," "cohort," or "structured program"
- **SAT Accelerator** — the program they paid for

## Voice + banned phrases

Full rules: [`docs/messaging-guide.md`](messaging-guide.md) and [`.cursor/rules/banned-copy-phrases.mdc`](../.cursor/rules/banned-copy-phrases.mdc).

**Hard bans on `/enroll`:**

- No em dashes (`—`) anywhere in copy. Use periods, commas, colons, or parentheses.
- No score guarantees ("close the gap," "+150 points," "boost," "score jump")
- No tutor-ad jargon: `prep` (noun/modifier), `gains`, `points leaking`, `point leaks`, `costing points`
- No empty marketer words: `engine`, `blueprint`, `rhythm`, `cadence`, `unlock`, `journey`, `transform`, `seamless`, `robust`
- No data-source language: never tell the parent "from your SAT Score Path / Strategy Call / payment receipt"
- No fake italics in body copy — `<em>` is the same display font in **forest green**, not italic (italic ban on `.qf-page` per CSS lines 10–12 of `app/quiz-funnel.css`)
- No academic / coursework "student code" tone — this is a commercial site

**Tone goal:** welcoming, professional, parent-as-buyer post-checkout. Like an Apple confirmation email or Stripe receipt page — calm, confident, useful.

## Visual SSOT — Aurora V3b system (live)

`/enroll` is the only other branded surface parents see after Plan Builder. Hard rule: **enroll = Aurora neighborhood, sibling to `/plan`** — palette, motif, single-column shell stay; specific type / hero / card treatment can pull from sibling Aurora variants in the offline brand assets (see below) but must hold one variant across all enroll steps.

### Anchor (must hold across every enroll step)

- **Aurora palette family** — navy ink (`#121A2B`), forest accent (`#2F6E47`), glow (`#77C89A`), polar white (`#F5F8FA`), celestial blue (`#0057A8`) used sparingly. Forest stays primary CTA.
- **At least one Aurora motif per screen, large** — navy band with green-to-blue glow bleed, gradient arc, star/sparkle, or dark feature card with glow halo. Used sparingly, never as decorative chrome.
- **Single-column on mobile.** Flex-pinned bottom CTA on mobile (`docs/funnel-mobile-shell.md`).
- **One primary CTA per screen.** Forest pill or paper pill, never both competing.
- **Existing logo lockup.** SVG in [`components/funnel-header-logo.tsx`](../components/funnel-header-logo.tsx) — recolor only.
- **Step interaction modes** from [`lib/quiz-funnel/step-interaction.mjs`](../lib/quiz-funnel/step-interaction.mjs) — do not invent CTAs (`option-tap`, `multi-continue`, `form-continue`, `explicit-cta`, `auto-advance`, `phased-cta`).

### V3b tokens (`app/quiz-funnel.css` — do not redefine)

| Token | Value | Use |
|-------|-------|-----|
| `--qf-bg` | `#F5F8FA` polar white | Page background |
| `--qf-ink` | `#121A2B` navy | Body text + dark chrome band |
| `--qf-forest` | `#2F6E47` aurora green | Primary CTA + selected accent |
| `--qf-glow` | `#77C89A` | Logo dot, progress fill, selected halo |
| `--qf-paper` | `#FFFFFF` | Cards |
| `--qf-line` | `rgba(18, 26, 43, 0.08)` | Borders / dividers |
| `--qf-forest-soft` | `#E5EFE8` | Selected option wash |
| `--qf-celestial` | `#0057A8` | Secondary accent — sparingly, never as primary CTA |

### Type (live `/plan`, baseline pairing for enroll)

- Headlines: **Source Serif 4 500** (`--qf-display`), 26px, `.qf-h1` — `<em>` renders **forest green, no italic**
- Body: **Schibsted Grotesk** (`--qf-body`), 15px, `.qf-lead`
- Eyebrows: **DM Mono** uppercase 0.22em with glow dot, `.qf-eyebrow`

### Shell anatomy

```
┌─────────────────────────────┐
│  ◀  ●ILLUMINAIRY            │  .qf-top — dark navy band, glow halo top-right
│  ━━━━━━━━━━━━━━━━━━━━━━━━━  │  .qf-progress (5px, glow fill)
├─────────────────────────────┤
│  EYEBROW · DOT              │  .qf-eyebrow
│  Headline in serif          │  .qf-h1
│  Lead in grotesk subcopy.   │  .qf-lead
│                             │
│  [ option / input / card ]  │  .qf-body — scrolls
├─────────────────────────────┤
│  [   Continue   →          ]│  .qf-step-actions — pinned via FLEX (not fixed)
├─────────────────────────────┤
│  Privacy · Terms            │  .qf-funnel-legal
└─────────────────────────────┘
```

### Forbidden in any enroll suggestion

- Light/white top bar instead of navy `.qf-top`
- `position: fixed` step CTAs (iOS keyboard breaks them — `docs/funnel-mobile-shell.md`)
- Tailwind `rounded-2xl` / shadcn-style cards / SaaS gradient
- Italic text, em dashes
- Any new font, hue, or button shape outside the references below
- Sidebar layouts or multi-column desktop forms (single-column on every breakpoint)
- A different logo / wordmark variant
- "luminary" public-marketing copy (that's brand-marketing, not post-pay onboarding)

### Step interaction modes (do not invent CTAs)

| Step type | Mode | Continue? |
|-----------|------|-----------|
| Single-select option list | `option-tap` | None — tap advances |
| Multi-select | `multi-continue` | Pinned `QFButton` |
| Form field (e.g. profile) | `form-continue` | Pinned `QFButton` |
| Insight / interstitial | `auto-advance` | Progress only |
| Calendly / scheduler / explicit step | `explicit-cta` | Pinned `QFButton` |

## Sibling Aurora variants — `/enroll` may pick one

Brianna explicitly likes the **component sheet** and **in-context** variants, not just `/plan`'s exact treatment. `/enroll` is allowed to be a sibling Aurora variant — any of the four below is acceptable as long as the Anchor list above holds and the chosen treatment is held across every enroll step.

| Element | `/plan` (live) | `Aurora Tokens.html` ("component") | `illuminairy_context.html` ("in-context") |
|--------|---------------|-----------------------------------|------------------------------------------|
| Display type | Source Serif 4 500 | Fraunces 500 (opsz 72) | DM Sans 200 italic accent |
| Body type | Schibsted Grotesk | Schibsted Grotesk | DM Sans 300 |
| Eyebrow | DM Mono uppercase | DM Mono 0.22em | DM Mono 0.4em |
| Hero | Navy `.qf-top` band only | Full-bleed dark hero with glow + paper-pill CTA | Centered nav + radial glow + ghost CTA |
| Card pattern | Plain panel | Default · Soft · Muted · Dark feature card | Aurora glow on dark card |
| Italic emphasis | Forest, non-italic | Forest, non-italic | **Italic glow** (`em` italic + glow color) |
| Button | Solid forest pill 56px | Pill + auto-width compact pill | Lowercase pill, 14px tracking |

**Rule:** mix at most one in-context surface borrow per variant (e.g., business-card-style mentor preview, neon-style success state). Never mix two display fonts inside `/enroll`. Forest stays primary CTA — celestial blue is secondary at most.

## Offline brand asset paths (Brianna's references)

These are the four aesthetic SSOTs Brianna provided. Open them as inspiration for shotgun + design-review:

- `~/Downloads/illuminairy_brand_guide (1).html` — full brand guide (aurora arc, star marks, hero motion, photography mood)
- `~/Downloads/diagnostic interface/uploads/illuminairy_brand_guide.html` — same brand guide (diagnostic interface variant)
- `~/Downloads/diagnostic interface/uploads/illuminairy_context.html` — Aurora applied across web hero, IG, LinkedIn, business cards, neon
- `~/Downloads/diagnostic interface/uploads/Aurora Tokens.html` — palette swatches, hero band, type specimen, button cluster, card grid
- `~/Downloads/diagnostic interface/uploads/*.png` — source screenshots and ChatGPT brand mood images

**Same neighborhood, not identical to `/plan`.** A parent moving from `/plan` → Stripe → `/enroll` should recognize the brand family. They do not need pixel-match.

## Reference screenshots to capture before any design suggestion

Use `browse` to capture these before running `design-shotgun` or `design-review`:

- `/plan` — `q1-parent-child` (single-select option list)
- `/plan` — `name` step (form-continue, single input, pinned Continue)
- `/plan` — `q7` step (multi-select)
- `/plan` — `v1` plan reveal (full-bleed scrollable body)
- `/plan` — `s5` Strategy Call scheduler (`QFPlanScheduler`)
- `/plan` — any insight hit (`auto-advance`, progress-only chrome)

If a `design-review` or `design-html` suggestion deviates from this system, reject it — even if it's "nicer." Brand parity > polish.

## What `/enroll` actually collects (locked, regardless of layout)

| Bucket | Fields | Notes |
|--------|--------|-------|
| Parent contact | first, last, email, phone | required for diagnostic; prefilled from Stripe + lead + Calendly |
| Student | first name (required), last (optional), grade (optional), school (optional), phone (optional), email (optional) | first name from quiz `kidName` |
| Past testing | `satTakenBefore` boolean | optional; informs mentor prep |
| Weekly reports | email opt-in, SMS opt-in, SMS TCPA timestamp | persists on `clients.weekly_report_*` |
| Second parent/guardian | first, last, email, phone (optional), separate SMS TCPA | optional; persists in `enrollments.intake_details.second_parent` |
| Skill Diagnostic | Calendly URI + scheduled time | required to submit |

Layout (one screen vs many, summary card vs prefilled inputs, channel cards vs checkboxes) is a **design-shotgun question**.

## Linked docs (read before design or QA)

- [`AGENTS.md`](../AGENTS.md) — golden rules
- [`.agents/product-marketing.md`](../.agents/product-marketing.md) — personas, JTBD, objections
- [`growth/funnel-strategy.md`](../growth/funnel-strategy.md) — ICP, conversion ladder, DR principles, vocabulary
- [`docs/messaging-guide.md`](messaging-guide.md) — product names, banned phrases, parent audience
- [`.cursor/rules/banned-copy-phrases.mdc`](../.cursor/rules/banned-copy-phrases.mdc) — banned tutor-ad jargon
- [`docs/seo-georgia-parent-icp.md`](seo-georgia-parent-icp.md) — Georgia buyer demo, school-list anxiety
- [`growth/funnel-analysis-playbook.md`](../growth/funnel-analysis-playbook.md) — quiz step IDs, ad `utm_content` aliases
- [`growth/meta-paid-lp-playbook.md`](../growth/meta-paid-lp-playbook.md) — live Meta creatives
- [`app/quiz-funnel.css`](../app/quiz-funnel.css) — V3b tokens + type (do not redefine)
- [`app/quiz/LAYOUT.lock.md`](../app/quiz/LAYOUT.lock.md) + [`docs/funnel-mobile-shell.md`](funnel-mobile-shell.md) — locked shell anatomy
- [`lib/quiz-funnel/step-interaction.mjs`](../lib/quiz-funnel/step-interaction.mjs) — step interaction modes
- [`lib/site.ts`](../lib/site.ts) — tuition, schedule, stats, Calendly URLs
