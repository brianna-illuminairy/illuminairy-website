# B3 landing — image ↔ content map (Hims-style)

Based on **`/Users/briannazajicek/Downloads/hims.fig`** (Hims quiz row + LPs), **`brianna-illuminairy/himsreplica`** `variant-b3.jsx`, and **`assessment-landing-low.tsx`**. See also [`hims-fig-reference.md`](./hims-fig-reference.md).

**Hims rule:** Almost every block is **headline → full-bleed visual → short copy → CTA**. Visuals carry the story; copy is one beat. **Do not** put the same photo in two sections.

Drop files in **`public/photos/`** with the filenames below; wire in `lib/landing/assets.ts`.

---

## How Hims maps content to images

| Pattern | Meaning |
|---------|---------|
| **Bleed image** | Full-width photo **between** headline and body copy (mobile stack) |
| **Hero grid** | Two tall portraits **after** headline + CTA card (B3a only) |
| **Overlay card** | One tall image with dark label + pill on top (great news) |
| **Product mockup** | Square UI screenshot above checklist (included) |
| **Reviews** | **Lean wireframe:** numbers only. **Real Hims LPs (fig):** dual photos + time labels (Month 0 / Month 6) — optional for Illuminairy |
| **Step thumb** | One small UI/photo per step row — labeled QUIZ / DIAGNOSE / PLAN / TUTOR in the prototype |

Desktop (≥1024px) may show copy + image **side-by-side**; mobile should follow **Hims stack order** below.

---

## 1 · Hero (variant-specific)

### B3a — “High GPA. Low SAT. Fixable.”

| Order | Content | Image |
|-------|---------|--------|
| 1 | Headline + 3 bullets | — |
| 2 | Dark CTA card (“Build your SAT plan…”) | — |
| 3 | Disclaimer line | **Option A (himsreplica):** `lp-b3a-student.jpg` + `lp-b3a-session.jpg` — tall 2-up grid |
| | | **Option B (Hims LP screenshot):** `lp-hero-progress-1..3.jpg` — **three square** before/progress crops in a row under the CTA card (like scalp progress thumbs) |
| | | *Temp 2-up: `male-student.png`, `tutor-student-session.png`* |

Pick **one** hero visual pattern for B3a; don’t use both 2-up and 3-up on the same page.

### B3b — “+182 points. Weekly plan. One tutor.”

| Order | Content | Image |
|-------|---------|--------|
| 1 | Headline + bullets | — |
| 2 | CTA card | — |
| 3 | **Stat row** (plans built / avg pts / hit target) | **No image required** in Hims lean B3b |
| 4 | Disclaimer | Optional: same hero pair as B3a if you want warmth (not in original Hims wireframe) |

### B3c — “Built on 250,000+ student scores”

| Order | Content | Image |
|-------|---------|--------|
| 1 | Eyebrow + headline + bullets | — |
| 2 | CTA card | — |
| 3 | Disclaimer | **One wide visual:** `lp-b3c-data.jpg` — charts / aggregate data / report UI (**not** a tutor face) |

*Hims wireframe: single wide “DIAGNOSTIC VISUAL” under hero — not two portraits.*

---

## 2 · Diagnostic-driven plan

| Order | Content | Image |
|-------|---------|--------|
| 1 | **“Diagnostic-driven plan”** (headline only) | — |
| 2 | *(bleed)* | **`lp-science-diagnostic.jpg`** — skill map or score report showing **the 5 gaps** |
| 3 | “The SAT tests 28 skills…” + “We diagnose them…” | — |
| 4 | CTA | — |

*Hims: `DIAGNOSTIC VISUAL` sits **above** the two paragraphs, not beside them on phone.*

---

## 3 · Good news

| Order | Content | Image |
|-------|---------|--------|
| 1 | **“Good news: a stronger score…”** + lead line | — |
| 2 | *(bleed)* | **`lp-great-news-team.jpg`** — tutor **team** group (branded shirts) |
| 3 | On image: “Explore SAT plans…” + pill CTA | *(text overlay on same image)* |
| 4 | Disclaimer | — |

*Hims placeholder wrongly said “STUDENT PHOTO (SAT IMPROVEMENT)” — for Illuminairy this block is **team / trust**, not another student portrait.*

*Temp: `team-hero.jpg`.*

---

## 4 · What's included

| Order | Content | Image |
|-------|---------|--------|
| 1 | **“What's included”** (headline) | — |
| 2 | *(bleed)* | **`lp-included-product.jpg`** — **program mockup**: dashboard, weekly plan UI, or tutor+student at laptop showing the plan |
| 3 | Six checklist rows + CTA | — |

*Hims: square `PROGRAM MOCKUP` centered above the list — not the team photo again.*

---

## 5 · Reviews — “Parents are seeing the score jump.”

| Order | Content | Image |
|-------|---------|--------|
| 1 | Section headline | — |
| 2 | Per card | See below |

**Two valid modes (pick one for launch):**

| Mode | Hims source | What to shoot |
|------|-------------|----------------|
| **A · Lean** | `himsreplica` B3 wireframe | **1180 → 1410** typography only + quote (current code) |
| **B · Fig** | `hims.fig` “Real guys, real results” cards | **Square pair** per parent: before report + after report, pill labels e.g. **“Test 1” / “Test 2”** or month-style (avoid fixed “12 weeks”) |

| Card | Files (mode B) |
|------|----------------|
| David D. | `lp-review-1-before.jpg`, `lp-review-1-after.jpg` |
| Priya S. | `lp-review-2-before.jpg`, `lp-review-2-after.jpg` |
| Tom B. | `lp-review-3-before.jpg`, `lp-review-3-after.jpg` |

Same asset language as quiz **`QFIMethod`** (small BA pair under hero) — use **once** on LP reviews OR on `i-method`, not both at full bleed size.

---

## 6 · How it works

Each row = **title + one line + time + small thumb** (Hims labels: QUIZ / DIAGNOSE / PLAN / TUTOR).

| Step copy | File | What the thumb should show |
|-----------|------|----------------------------|
| Answer a few questions · Plan Builder · ~2 min | `lp-step-assessment.jpg` | Parent phone — quiz q1 |
| SAT Strategy Call · 15 min · After plan | `lp-step-strategy-call.jpg` | Calendly / video call scheduling |
| Skill Diagnostic · Proctored · After call | `lp-step-diagnostic.jpg` | Proctored exam UI |
| Personalized weekly plan · Ongoing | `lp-step-weekly-plan.jpg` | Weekly plan / mentor session |

Until files exist → **01–04 badges** only.

---

## 7 · Final CTA + footer

| Content | Image |
|---------|--------|
| “Your child's score, their plan, their pace.” + bullets + button | **None** |
| Footer | **None** |

---

## Quiz funnel (Hims screens — for photo consistency)

These are **not** on the B3 LP but use the same asset library:

| Quiz step | Content | Image(s) |
|-----------|---------|----------|
| **i-method** (`QFIMethod`) | One sentence + outcome | **Hero:** `tutor-student-session.png` (large 16:10) |
| | | **Below:** small pair `before-score-report.png` + `score-report.png` + “1180 → 1410 · +230 pts” |
| **i-steps** (`QFISteps`) | Plan UI + “Diagnose / Rank / Plan” labels | **Not a photo** — build or screenshot **Sophia plan mockup** (ranked skills UI). Labels point at diagnose → rank → plan. |

Do **not** reuse the plan mockup on the LP “included” section as the only product shot — LP included should be **parent-facing dashboard**, quiz i-steps is **student plan detail**.

---

## Asset checklist (minimum to match Hims)

| # | File | Pairs with |
|---|------|------------|
| 1–2 | `lp-b3a-student.jpg`, `lp-b3a-session.jpg` | B3a hero |
| 3 | `lp-b3c-data.jpg` | B3c hero |
| 4 | `lp-science-diagnostic.jpg` | Diagnostic-driven plan (bleed) |
| 5 | `lp-great-news-team.jpg` | Good news (bleed + overlay) |
| 6 | `lp-included-product.jpg` | What's included (mockup) |
| 7–10 | `lp-step-*.jpg` (×4) | How it works thumbs |
| 11–16 | `lp-review-*` (×6) | Optional — Hims uses numbers only |

Also keep for quiz: `tutor-student-session.png`, `before-score-report.png`, `score-report.png`, and a **plan UI** asset for i-steps (can be same as `lp-included-product.jpg` if it’s the weekly plan screen).

---

## Specs

- JPG/PNG, sRGB · min **1200px** wide for bleeds · **400px+** for step thumbs
- Mobile: **stack** headline → image → copy (Hims). Desktop may use two-column layout.
- One file per slot — no recycling `team-hero` under science, steps, and reviews.

See [b3-lp-viewport-qa.md](./b3-lp-viewport-qa.md) for device checks.
