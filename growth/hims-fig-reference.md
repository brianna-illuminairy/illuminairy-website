# Hims reference · `hims.fig` + mobile LP screenshot

**Canonical LP (screenshot):** [`reference/hims-lp-mobile-reference.png`](./reference/hims-lp-mobile-reference.png) — full scroll, mobile.

**Source file:** `/Users/briannazajicek/Downloads/hims.fig` (exported May 2026, ~54MB)

**What’s in the file (canvas overview):**

- Long **mobile quiz / assessment** row (~40 iPhone-height frames) — one question or one visual per screen, minimal prose
- **Two full-length mobile LPs** (hair / wellness) — editorial sections, not a single centered column
- **Desktop / tablet** comps above the mobile row
- **Brand / ad** stills (hero lifestyle, product-in-hand, subway split layouts)

Illuminairy’s SAT adaptation lives in **`himsreplica`** (`variant-b3.jsx`, `FUNNEL-PRINCIPLES.md`) and the live app (`assessment-landing-low.tsx`, quiz `QFIMethod` / `QFISteps`). This doc captures patterns from the **actual Hims** fig that should inform LP photography and layout.

---

## Funnel density (quiz row)

From `FUNNEL-PRINCIPLES.md` + fig structure:

| Rule | Hims | Illuminairy |
|------|------|-------------|
| Copy per screen | **1 sentence** (often headline only) | Match on `q1`–`q9`, interstitials, `s1`–`s4` |
| Hero visual | **One** dominant image OR product UI | `QFIMethod`: large session + small BA pair; `QFISteps`: plan UI only |
| Scroll on iPhone 14 frame | Fail → split screen | Same bar for new quiz screens |
| Icons | **Never** | Checkmarks in lists only where already used |
| Personalization | Their answers on screen | Bands, test date, GPA gap, gain line |

**Quiz step map (Illuminairy):** `QuizRunner.tsx` → `q1`…`q9` → `i1`, `i-compare`, `i-diag`, **`i-method`**, **`i-steps`**, `i2`, `i-gap?`, `s1`, `v1`, `s2`–`s4`, `s5`, `s7`, `s9`.

---

## Landing page patterns (from fig LPs)

### Layout rhythm

1. **Headline block** — serif or bold sans; **one accent color** on a key phrase (“real results”, “fuller hair”)
2. **Primary CTA** — black pill, full width or centered; often only one per viewport
3. **Hero visual** — lifestyle **or** product-in-hand; logo may **overlap** the photo (editorial)
4. **Feature rows** — small **square** image left, 2 lines of copy right (“Why men choose Hims”)
5. **Social proof** — **dual before/after** photos with time labels (**Month 0 / Month 6**), not giant score paragraphs
6. **Product formats** — alternating image / copy rows (chew, spray, serum) — each row = **one** new photo
7. **Stats** — **gauges or big numbers** (90%, 4/5), disclaimer below
8. **Assessment nudge** — top bar: “Finish your assessment today →” on retargeting LPs

### Photography style (shot list implications)

| Hims uses | Illuminairy equivalent |
|-----------|-------------------------|
| Warm, textured backgrounds (ochre, cream) | Navy hero band + cream paper (brand) |
| Hands + product / unboxing | Tutor session, laptop with plan UI |
| Doctor / provider trust thumb | Team group (`lp-great-news-team`) |
| Phone showing messaging | Parent dashboard or quiz on phone (`lp-step-assessment`) |
| Before/after **faces or hair** with month pills | Optional: score report pair per review OR numbers-only (lean B3 wireframe) |
| Macro ingredient / UI cards | Skill diagnostic, ranked plan mockup |

### What Hims does **not** do on LP

- Repeat the same hero photo in every section
- Long paragraphs under every image
- Full-width score-report collage in **reviews** (that’s **product-outcome** — one screen in funnel, like `QFIMethod`)
- Fixed “12 weeks” in hero (they use “3–6 months”, “Month 6” — **time labels, not program length**)

---

## Map: Hims mobile LP (screenshot) → B3 LP

Section order is **already the same** as `b3-body.tsx`. Use this table for **what to shoot** per block.

| # | Hims (screenshot) | Illuminairy B3 | Asset / shot |
|---|-------------------|----------------|--------------|
| 1 | **Hero** — headline, 3 checkmarks, **dark CTA card**, then **3 small BA thumbs** in a row | Variant heroes + `VBHeroCTA` | B3a: dual portraits **or** 3-up progress row (`lp-hero-progress-1..3.jpg` — score/report crops). B3b: stats under CTA. B3c: wide data visual |
| 2 | **Science** — headline → **follicle diagram** → 2 lines → black CTA | `science` | `lp-science-diagnostic.jpg` — skill map / gap chart (**illustration or UI**, not lifestyle) |
| 3 | **Good news** — “thicker hair is in your future” → **large portrait** → quote | `great_news` | `lp-great-news-team.jpg` — trust portrait (team or aspirational student). Overlay + pill optional |
| 4 | **What’s included** — **product jar** above accordion checklist | `included` | `lp-included-product.jpg` — plan/dashboard mockup (SAT “product”) |
| 5 | **Reviews** — carousel of **BA pairs** + handles + stars | `reviews` | Mode B: `lp-review-*-before/after.jpg` per card. Mode A: typographic 1180→1410 only |
| 6 | **How it works** — 4 rows, **distinct thumb each** | `how_it_works` | `lp-step-assessment` (phone quiz), `lp-step-diagnostic`, `lp-step-plan`, `lp-step-tutor` |
| 7 | **Final CTA** — **dark band** + bullets + white button; **product still life** below | `final_cta` | Ink section = copy only; optional `lp-final-product.jpg` (session at desk / materials) if you add a bottom visual like Hims bottles |
| 8 | **Footer** — social, legal, LegitScript-style badge | `footer` | No photo; College Board disclaimer |

**Hims patterns in this screenshot (keep):**

- **No fixed program length** in hero (“long-term solution”, not “12 weeks”).
- **CTA in almost every section** — we use `InlineCta` + hero/final; same intent.
- **Background bands** alternate (beige / white / cream / brown) — we use `bg-paper`, navy hero band, `bg-ink` final.
- **One visual type per section** — diagram ≠ portrait ≠ product ≠ BA carousel ≠ step thumbs.

---

## Map: Hims funnel → quiz interstitials

| Hims-style moment | Illuminairy screen | Asset |
|-------------------|-------------------|--------|
| One line + big lifestyle | `QFIMethod` | `tutor-student-session.png` |
| Small before/after under hero | `QFIMethod` | `before-score-report.png`, `score-report.png` |
| Product UI + floating labels | `QFISteps` | Plan mockup (code today; shoot `lp-included-product` / plan UI) |
| Compare / bars animate | `QFIComparePrep`, `QFIDiagnosis` | Charts / bars (mostly UI, not photo) |
| Rows-only summary | `QFS1Summary` | No photo |

---

## Files to use together

1. **`growth/b3-lp-photo-shot-list.md`** — filenames and per-section order
2. **`growth/hims-fig-reference.md`** (this file) — why those slots exist
3. **`himsreplica` / `FUNNEL-PRINCIPLES.md`** — sentence budget and voice
4. **`/Users/briannazajicek/Downloads/hims.fig`** — visual truth for spacing, overlap, and review card layout

When in doubt: open the fig next to `?lp=b3a` on a 390px viewport and match **section order** and **one visual per beat**.
