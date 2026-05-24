# YC blog & library — startup branding autoresearch

*2026-05-19 · Inputs for Illuminairy YC site rebrand (v2 visual system)*

## Sources reviewed

| Source | URL | Relevance |
|--------|-----|-----------|
| YC essential startup advice | https://www.ycombinator.com/library/4D-yc-s-essential-startup-advice | Launch now, talk to users, clarity over polish |
| Seed pitch deck (YC Library) | https://www.ycombinator.com/library/6q-how-to-build-your-seed-round-pitch-deck | Narrative structure: problem → solution → why now → team |
| YC blog index | https://www.ycombinator.com/blog | Founder milestones, direct voice |
| Premium funnel teardowns (internal) | [premium-funnel-teardowns.md](./premium-funnel-teardowns.md) | MarketerHire, Maven — B2B trust without edtech tropes |

## YC patterns that apply to our site (not SAT parent-ed)

### 1. Launch beats polish

YC’s default advice: ship a product with a “quantum of utility,” iterate with users — not wait for perfect creative ([YC essential advice](https://www.ycombinator.com/library/4D-yc-s-essential-startup-advice)). **Design implication:** homepage should read in **under 10 seconds**; no brochure sections, no credential pill walls.

### 2. Write code, talk to users — show both on the page

Early-stage focus is building and customer conversation. **Design implication:** primary CTA = **waitlist / contact intent**; secondary = mentor apply. No “book a consultation” for a product that is not live yet.

### 3. Fundraising / YC review pages favor clarity over decoration

Pitch decks emphasize: problem, solution, market, traction, team — one idea per block. **Design implication:**

- One H1 outcome statement
- Founder line = **one row** (role + proof), not four pills
- Proof points as short bullets, not cards with icons
- Avoid “annual report” eyebrows (all-caps, wide tracking)

### 4. Startup sites that convert (adjacent benchmarks)

From our teardown doc and YC Launches ecosystem:

| Pattern | Example vibe | Illuminairy v2 |
|---------|--------------|----------------|
| Dark, high-contrast product UI | Linear, Vercel | Default dark-capable; indigo accent |
| Calm typography | Notion, Stripe Press | Plus Jakarta 500–700 for headlines, not 200 extralight |
| Single accent color | Ramp, OpenAI | Indigo primary; gold only for “illumination” / wordmark AI |
| Grid or dot motif | Linear | Subtle background grid, not paper grain + gold radial |
| Founder-forward | Early YC Launch posts | Photo smaller or beside copy; not yearbook hero |

### 5. What to avoid (reads Ivy / edtech, not YC)

- Warm ivory + gold candlelight as **dominant** palette
- Sage / marigold / terracotta section pops (West Elm rule)
- “Selective university” credential chips
- SAT / parent / consultation CTAs on YC cut
- Sparkles icons and generic “feature grid”

## Brand brief v2 (executable)

### Positioning (unchanged copy axis)

Near-peer AI mentorship for ambitious professionals and business owners — **not** a course marketplace or freelancer directory.

### Visual north star

**“Calm infrastructure company that happens to teach humans.”** Intersection of YC application clarity + Linear product surface.

### Palette

| Token | Light | Dark |
|-------|-------|------|
| Background | `#FAFAFA` | `#0A0A0F` |
| Elevated surface | `#FFFFFF` | `#12121A` |
| Text primary | `#0F0F12` | `#F4F4F5` |
| Text muted | `#52525B` | `#A1A1AA` |
| Border | `#E4E4E7` | `#27272A` |
| Accent (product) | `#4F46E5` (indigo) | `#818CF8` |
| Accent gold (brand) | `#C49A18` | `#D4AF3A` — wordmark AI only |

**Supersedes:** May 2026 visual doc “reject indigo AI palette” for this YC launch cut.

### Typography

- **Plus Jakarta Sans** only (no new font fetch for speed)
- H1: `font-semibold` / `font-bold`, `tracking-tight`, clamp 2.25–3.5rem
- Eyebrow: 11px **medium**, normal case or sentence case — not 14% uppercase
- Body: 15–17px, `leading-relaxed`

### Layout

- Max width **1120px** (`max-w-7xl` → consider `max-w-[1120px]`)
- Section padding `py-16` / `py-20` (tighter than editorial `py-24`)
- No `PopSection` color bands on YC homepage

### Name story (tight block)

Three lines: **Illuminate** · **Luminary** · **AI** at center — one paragraph thesis (from `homePlatform.nameMeaning`).

## Homepage content hierarchy (YC order)

1. Outcome H1 + waitlist
2. Founder one-liner (who + why now)
3. Problem (2–3 sentences)
4. Two outcome examples (dentist / engineer)
5. How it works (4 steps, horizontal)
6. Why Illuminairy (name + thesis, compact)
7. Bloom footnote (cited)
8. Footer: theme toggle, ©, mentor link

## Metrics for growth autoresearch (post-ship)

- Primary: `platform_waitlist_submitted`
- Leading: homepage session length, waitlist form focus

## Ralph / next steps

See `specs/2026-05-yc-rebrand/SPEC.md` and `specs/ralph/PLAN-yc-rebrand.md`.
