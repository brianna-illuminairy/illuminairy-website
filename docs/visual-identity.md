# illuminairy — Visual Identity

*Updated May 2026 — visual system from positioning workshop*

**Audience:** Designers, developers, and anyone implementing UI, marketing layouts, or brand assets.

**Related docs:** Voice and positioning → [brand-voice-and-positioning.md](brand-voice-and-positioning.md). Doc index → [designer-brief.md](designer-brief.md).

---

## Brand personality (workshop word cloud)

**Use for mood boards, photography, illustration briefs:**

Modern · easy · airy · guided · path · educated · fun · playful · colorful · bold · engaging · aspirational · inspirational · exciting · youthful · academic · data-backed · optimistic · detailed · genuine · transparent · clear · simple

### Tensions to design for

| Tension | Rule |
|---------|------|
| Simple ↔ Detailed | **Simple default**; detail where it builds trust (reports, how-it-works) |
| Playful ↔ Academic | **Playful energy, academic substance**—not clownish on college stakes |
| Bold ↔ Transparent | **Bold confidence**, backed by showable proof |
| Colorful ↔ Premium | **Warm/vivid human brand**—not childish rainbow on every layout |
| Airy ↔ Dense | **Airy layouts**; never cram-sheet prep anxiety |

**Central metaphor:** We **bring light**—visual + intellectual.

---

## Visual direction

**One sentence:** *West Elm warm restraint + selective color pops + the luminosity of a guiding light—light, airy, clear, premium.*

| Principle | Execute |
|-----------|---------|
| **Light** | Ivory, whitespace, gold as **candlelight** |
| **Airy** | Breathing room; no cram-sheet density |
| **Clarity** | Type hierarchy; one idea per block |
| **Guidance** | North Star; path/step when needed—no graduation caps / pencils |

**References:** West Elm 2018 (Trollback); Curious Cardinals for **energy and warmth only**—elevate, don't copy layouts or voice blindly.

**Reject:** Dark-mode-default, indigo/violet AI palette (retired), edtech clipart, marketplace UI, script/rounded/playful fonts, serif display, cramped layouts, "AI SaaS" hero gradients.

---

## Color system

**Base:** Ivory `#FAF6F0` · Ink `#16120A` · Navy `#131C32` (night sky for the star).

**Gold (guiding light):** `#C49A18` — wordmark **AI**, North Star, rare full moments. Light: `#D4AF3A`. Deep text: `#8F6E0C`.

**Pops (one per section, ivory or navy only):** Marigold `#E09318` · Sage `#5F9E82` · Terracotta `#C4623E` · Sky `#5A8EB8`.

---

## Wordmark & mark

`illuminairy` — Plus Jakarta Sans 200 display (400–500 nav), lowercase, tight tracking. **AI** in gold.

**North Star** — 4-point, vertical bias; star + compass. Gold on navy. App icon: gold star, navy gradient ground.

Lockup: mark left, wordmark right, 9–12px gap.

---

## Typography

Plus Jakarta Sans: 200 / 300 / 400–500 / 600–700 / 800. Campaign-only: oversized wordmark, letterspaced `i·l·l·u·m·i·n·AI·r·y`, curved type.

Eyebrows: 10–11px, 700, +13–16% tracking, uppercase.

---

## Visual system v2 (YC launch cut — May 2026)

**Status:** Supersedes ivory/West Elm defaults for the public YC site. Full brief: [yc-blog-startup-branding-2026-05.md](research/yc-blog-startup-branding-2026-05.md).

| Element | v2 rule |
|---------|---------|
| Surfaces | CSS semantic tokens `surface`, `surface-elevated`; light `#FAFAFA`, dark `#0A0A0F` |
| Accent | Indigo `#4F46E5` (product UI); gold only for wordmark **AI** |
| Type | Plus Jakarta **semibold/bold** headlines; no extralight 200 heroes |
| Eyebrow | 11px medium, sentence case — not uppercase annual-report style |
| Layout | Max ~1120px, subtle dot/grid background — no paper grain + gold radial |
| Theme | `next-themes`: system default + manual toggle |

SAT/parent-ed workshop rules below remain in repo for when those routes return from git.

---

## Aurora Product System (Jun 2026)

**Status:** Supersedes Fraunces/cream/Schibsted defaults for **product surfaces**: homepage LP v4, Plan Builder `/plan`, standard enroll/checkout, SOHA student portal.

**SSOT in code:** `app/aurora-brand.css` (tokens) · `app/aurora-components.css` (chrome, buttons, cards) · `lib/funnel-fonts.ts` (Hanken Grotesk + Source Serif 4 + DM Mono).

| Element | Rule |
|---------|------|
| Page bg | Polar white `#F5F8FA` (~85% of viewport) |
| Paper cards | `#FFFFFF` with soft shadow + aurora top-line hover |
| Navy chrome | `#121A2B` header/footer strips only — not hero CTA boxes |
| Palette | Celestial `#0057A8` · Aurora `#77C89A` · Glow `#B8F5D1` · Forest `#2F6E47` |
| Display | **Source Serif 4** 600, no italic on product UI |
| Body | **Hanken Grotesk** 400–600 (never 800 on enroll/LP/portal) |
| Labels | **DM Mono**, sentence case preferred |
| Max width | 1080px content (portal, plan HTML) |
| Dark usage | One optional diagnostic score inset — not full-page dark on enroll/LP |

### CTA stack (locked Jun 2026 — mock `design/mockups/06-cta-options.html`)

| Context | Primary | Secondary | Motion / wrapper |
|---------|---------|-----------|------------------|
| **Dark** (header, hero strip, footer band) | Mint glow fill `#B8F5D1`, navy label · `.aurora-btn-primary-on-dark` | Mint outline ghost · `.aurora-btn-ghost-mint` | Glow lift + arrow on hover; **pulse ring** on one hero CTA per page · `.aurora-btn-pulse` |
| **Light** (enroll body, LP card) | TBD — forest or celestial fill (not mint at rest) | Forest or navy outline | Same glow-lift + arrow; button inside **CTA card** · `.aurora-hover-card` (top-line sweep on card hover) |

**Mint glow fill on light pages:** avoid as primary (low contrast vs `#F5F8FA`). Mint stays dark-surface primary + accents.

**Code:** `app/aurora-components.css` — `aurora-btn-primary-on-dark`, `aurora-btn-ghost-mint`, `aurora-btn-pulse`, `aurora-hover-card`.

### Logo lockups (explore Jun 2026 — mock `design/mockups/07-logo-lockups.html`)

| Surface | Direction |
|---------|-----------|
| **Header (dark chrome)** | **v8 soft stars + arc** (explore) or raster PNG — not v7 line stars |
| **Header (light)** | `logo-v8-soft-stars-on-light.svg` |
| **Hero** | Source Serif at display scale; optional stars left |
| **Icon / OG** | `logo-square.png` — never shrink full lockup below ~24px wordmark height |
| **Avoid on product** | Split-color wordmark, gold “ai”, v2 path mark, mechanical line-cross stars, Cormorant chrome |

**Production files:** `logo-v8-soft-stars-on-dark.svg`, `logo-horizontal.png`, `components/brand/illuminairy-logo-v7.tsx`.

**Deprecated on product UI:** cream `#F5ECD9`, `--danielle-cream`, `--sr-cream`, Fraunces, Cormorant, Space Grotesk, dark navy plan/CTA cards above the fold.

**Enforced:** `npm run aurora:brand-guard` (in `agent:verify`). Rule: `.cursor/rules/aurora-brand.mdc`.

**Data viz (exploratory Jun 2026):** New chart/infographic system — not an extension of current funnel or diagnostic charts. Spec: [data-visualization.md](data-visualization.md) · mock: `design/mockups/09-data-viz-directions.html`.

**Legacy (unchanged until migrated):** `/danielle/*`, `content/danielle/*`, Sohail locked enroll stack, ivory/gold v2 tokens below (archived reference).

---

## Aurora SAT funnel (May 2026 — superseded for fonts/tokens)

**Note:** Step layout and mobile shell unchanged. Colors/fonts now alias `aurora-brand.css` via `app/quiz-funnel.css`.

| Element | Aurora rule |
|---------|-------------|
| Surfaces | `#F5F8FA` bg, `#121A2B` ink, forest `#2F6E47`, celestial `#0057A8` |
| Type | **Source Serif 4** display · **Hanken Grotesk** body · **DM Mono** labels |
| Logo | `public/brand/logo-horizontal.png` (header) · `logo-square.png` (OG/social) |
| Clear space | Height of the star cluster above the wordmark on all sides |
| Layout | Mobile-first 420px column; `100dvh` with `100vh` fallback for Safari |

Retired on the live site: ivory/gold/Jakarta brand board, `/assessment`, `/satplan`, `/go/*`.

---

## What "YC-investible" means here

- Restraint = confidence; every element serves **illuminate** or **guide**.
- Launch creative reads **premium mentorship**, not AI gimmick.
- Typography carries the design; **light** layouts.
- Nothing looks like default edtech.
- AI supports the story; **does not headline it**.

---

## Designer checklist

- [ ] Feels **light** and **airy** (illumin**airy**)?
- [ ] Gold = light, not decoration dump?
- [ ] Parent sees **clarity** not sales pressure?
- [ ] **Mentors as people** before process diagrams?
- [ ] Room to breathe—not cram sheet?
- [ ] Copy: plain, direct, warm, honest? (see [brand-voice-and-positioning.md](brand-voice-and-positioning.md))
- [ ] Comparison work shows **in-person failure modes** we solve (anonymous group, passive Zoom, paper prep)?
- [ ] **No** guaranteed-score visual language?

---

## Files delivered

* `illuminairy-brand-v3.html` — Brand book (primary)
* `illuminairy-brand-v2.html` — Warmer / CC energy reference
* `illuminairy-brand.html` — v1 dark/indigo (retired)

Self-contained HTML; Google Fonts only. These may live outside this repo.

---

## Workshop note for creatives

We intentionally **did not** use competitor-style personality sliders with negative right-hand poles (e.g. "detached"). Personality = **vibe words** above + **NN/g four dimensions** (in brand voice doc). Differentiation = narrative sections in brand and SAT docs, not slider charts.

---

*Original design direction: May 2025 + May 2026 brand workshop. Contact: brianna@illuminairy.com*
