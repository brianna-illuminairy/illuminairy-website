# Illuminairy — visual design prompts

Copy-paste briefs for **platform mock**, **graveyard diagram**, and **motion spec**.  
Brand: [logo-v2.md](../brand/logo-v2.md) · Copy: [docs/brand-source/](../brand-source/) · Site palette: indigo accent + gold illumination only.

---

## Prompt 1 — “Illuminairy OS” platform mock (Figma / v0 / designer)

### Role

You are a senior product designer building a **single high-fidelity marketing frame** for a YC-stage B2B SaaS homepage. The product is **Illuminairy**: AI-orchestrated **human** near-peer mentorship for ambitious professionals and business owners. This is **not** a course marketplace, **not** Upwork, **not** an AI chatbot tutor.

### Output

One desktop frame, **1440×900** (also export **2× PNG** and **SVG** if possible).  
Style reference: **Linear + Ramp + Notion** — calm infrastructure, crisp type, subtle borders, no gradients except soft surface elevation.  
**Dark mode primary** (midnight UI); optional light variant later.

### Brand tokens

| Token | Hex |
|-------|-----|
| Background | `#0A0A0F` |
| Surface / cards | `#12121A` |
| Border | `#27272A` |
| Text primary | `#F4F4F5` |
| Text muted | `#A1A1AA` |
| Accent (product UI) | `#6366F1` / `#818CF8` |
| Success / illumination | `#D4AF3A` (gold — use sparingly) |
| Font | Plus Jakarta Sans (600 headlines, 400–500 body) |

### Layout — one screen, four zones (left sidebar optional)

**Chrome (minimal)**

- Top bar: wordmark `illuminairy` (lowercase; **ai** in gold `#D4AF3A`)
- No clutter: no 12 nav items, no notification bell spam

**Zone A — Outcome intake (top-left or hero column)**

- Label (muted, 11px): `Your outcome`
- Primary field (filled, not empty): **`Ship AI lead-gen for my dental practice`**
- Subcopy (muted): `Not a topic — the result you want shipped in your business.`
- Small chip row (optional): `Professional` · `Business owner` — one selected
- CTA style button (indigo): `Find my path` (secondary ghost: `Browse examples`)

**Zone B — Match card (center-right, hero element)**

Card titled `Your near-peer mentor` with subtle indigo left border.

- Circular avatar (realistic or neutral illustrated headshot — professional woman or man, 30s)
- Name: **Jordan M.**
- Badge (indigo pill): `Shipped this 4 months ago`
- Proof line 1: `Built automated patient lead-gen for 3 dental practices using AI workflows.`
- Proof line 2: `Avg. 34% more qualified inquiries in 90 days.`
- Footer on card: `Matched by Illuminairy` + small path-mark icon (upward indigo curve + gold dot — see logo-v2)

**Zone C — Milestone path (below match or left column)**

Vertical or horizontal stepper, **5 milestones**:

| State | Label |
|-------|--------|
| Done ✓ | `Define ICP & offer` |
| Done ✓ | `Map current lead sources` |
| **Current** (indigo highlight) | `Build AI outreach workflow` |
| Upcoming | `Launch + measure 2 weeks` |
| Upcoming | `Ship: live lead-gen system` |

Visual: completed steps = muted check + dim line; current = indigo ring + soft glow; upcoming = dashed or 30% opacity.  
Final milestone node = small **gold** dot (illumination), not entire UI gold.

**Zone D — Session row (bottom strip or right rail)**

Compact row/card:

- Left: `Session 3` · `Lead-gen workflow built`
- Center: thin progress ring **68%** (indigo stroke, muted track)
- Right: `Next: Review with Jordan · Thu 2:00 PM`
- Tiny avatar stack optional (mentor only)

**Optional fifth element (small)**

- Floating pill: `AI updated your path` with subtle sparkle-free icon (simple line icon)

### Copy rules

- Say **outcome / ship / practice / workflow** — never “enroll,” “cohort,” “course,” “module,” “leverage”
- Human mentor is explicit; AI **orchestrates** (matching, path, tracking) — AI is not the mentor
- Dentist example is canonical ICP; keep concrete

### Anti-patterns (reject)

- Robot mascot, brain clipart, graduation caps, purple-pink AI gradients
- Dashboard with 20 widgets, fake charts, stock “team collaboration” photos
- Udemy/Coursera course grid, Upwork profile search UI, giant ChatGPT chat window as hero
- Ivy League ivory/gold editorial aesthetic; playful edtech illustrations
- Score guarantees, “10× your revenue” hype

### Deliverables

1. Figma file with components: `Card`, `Milestone`, `SessionRow`, `IntakeField`
2. Exported `illuminairy-os-mock.png` @2x (transparent PNG optional for web embed)
3. 2–3 sentence designer note: what each zone communicates

### One-line creative direction

> Show the moment after intake when the platform has already matched a near-peer and the learner is **mid-path toward a shipped business outcome** — calm, inevitable, accountable.

---

## Prompt 2 — “Graveyard vs path” alternatives diagram (Figma / illustrator / SVG)

### Role

You are designing a **single explanatory diagram** for a startup marketing homepage. It must communicate in **under 2 seconds**: most “learn AI” options are dead ends; Illuminairy is the one path that reaches a shipped outcome.

### Output

- **Landscape** artboard: **1200×600** (also **800×800** square crop for mobile)
- Formats: Figma + **SVG** (paths only, no raster) preferred for web
- Works on **dark background** `#0A0A0F` with subtle dot grid (opacity ~6%, `#FFFFFF` dots)

### Concept — fork in the road

**Left/bottom cluster — four gray dead-end paths** (equal visual weight, all **terminated**):

Each path is a curved line in `#3F3F46` (zinc-700) ending in a **stop icon** inside a muted circle `#27272A`. No glow. Optional subtle “×” or flat line cap at terminus.

| Path label (small, muted) | Icon metaphor |
|----------------------------|----------------|
| `Static course` | Play button in rectangle (Udemy-style course tile) — **not** a brand logo |
| `Freelancer marketplace` | Grid of 4 avatar circles + search magnifier (Upwork-style **generic**) |
| `ChatGPT alone` | Simple chat bubble with ellipsis |
| `Guru / coach` | Podium or single star on pedestal (generic expert) |

Labels sit near path start: `Course` · `Marketplace` · `ChatGPT` · `Guru`

**Right/center — one living path (hero)**

- Smooth indigo curve `#6366F1` → `#818CF8`, 3–4px stroke, rounded caps
- Two smaller indigo nodes along the path (near-peer steps)
- Terminates at **gold node** `#D4AF3A` with soft radial glow (opacity 20%, not neon)

**Gold node label:** `Shipped`  
**Sub-label (optional):** `Your outcome`

**Illuminairy path label** at start (accent color): `Illuminairy` with small path-mark icon

### Composition rules

- Dead paths should feel **equal and disappointing** — no path looks “recommended”
- Living path is clearly **the only one that continues** — use motion implied by curve direction (upward-right)
- Asymmetric layout: 60% visual weight on the indigo/gold path
- No paragraph text inside the art; max **8 words** total on canvas
- No red “X” comedy icons — sophisticated, Linear-like restraint

### Graveyard mapping (from brand doc)

Do **not** use these words on the diagram (too small to read); icons carry meaning:

1. AI education / upskilling platform → **Course**
2. AI coaching → **Guru**
3. Mentorship marketplace → **Marketplace**
4. (ChatGPT solo is the fourth — not in graveyard titles but in problem copy)

### Anti-patterns

- Side-by-side comparison table with bullets
- Meme cemetery tombstones 🪦
- Logos of Coursera, Upwork, OpenAI (legal/brand risk)
- More than four dead paths (cognitive overload)
- Bright red failure colors

### Deliverables

1. `graveyard-vs-path.svg` (web-ready)
2. `graveyard-vs-path@2x.png` on `#0A0A0F`
3. Alt text: `Four common approaches to learning AI dead-end; Illuminairy path reaches a shipped outcome.`

### One-line creative direction

> A fork where every familiar option fades out, and one indigo path climbs to a single gold “Shipped” — the visitor feels the category difference before reading a word.

---

## Prompt 3 — Light motion & scroll interaction (Framer / CSS / front-end spec)

### Role

You are specifying **purposeful, minimal motion** for the Illuminairy marketing homepage. Motion must communicate **state change** (stall → match → progress → shipped), not decoration. No parallax wallpaper, no autoplay hero video, no bouncing CTAs.

### Brand motion principles

- Duration: **0.4–0.8s** for entrances; **0.2–0.3s** for hovers
- Easing: `cubic-bezier(0.22, 1, 0.36, 1)` (ease-out) or `ease-out`
- Respect `prefers-reduced-motion`: instant state, no draw animations
- Colors: indigo `#6366F1` / `#818CF8`, gold pulse `#D4AF3A` at 20% opacity max

---

### Motion A — Hero path draw on load

**Element:** Illuminairy path-mark (upward curve + nodes + gold apex) — large beside hero headline OR watermark behind hero.

**On load (once per session):**

1. **0–600ms:** Stroke-draw path (SVG `stroke-dashoffset` animation) indigo segments in sequence: bottom node → curve → vertical → apex
2. **600–900ms:** Nodes scale in: `scale(0.8 → 1)`, opacity `0 → 1`
3. **900–1200ms:** Gold apex **single pulse**: `scale(1 → 1.08 → 1)` + glow opacity `0.12 → 0.28 → 0.12` (one cycle only, not loop)

**Reduced motion:** Show fully drawn path immediately; no pulse.

**Do not:** loop pulse, particle effects, rotate entire mark

---

### Motion B — Sticky path + scroll-linked “How it works”

**Layout (desktop ≥1024px):**

- **Left column (sticky, `top: 120px`):** Simplified path diagram (same geometry as logo, larger) — 280px wide
- **Right column:** 4 steps (existing copy shortened to titles + one line each)

**Scroll behavior:**

| Step in view (IntersectionObserver, 50% threshold) | Path diagram state |
|--------------------------------------------------|-------------------|
| Step 1: Tell us your outcome | Segment 1 indigo **100%**, rest **25%** opacity |
| Step 2: Get matched | Segments 1–2 active; node 2 bright |
| Step 3: Follow your plan | Segments 1–3 active |
| Step 4: Stay on track | Full path active; gold apex lit |

**Transition:** segment opacity crossfade **300ms** ease-out

**Mobile:** Stack vertically; path becomes **horizontal progress bar** under each step (no sticky)

**Do not:** scroll-jacking, full-page snap sections, pin for >100vh

---

### Motion C — Persona before/after slider (optional)

**Element:** One persona panel (Dentist · AI lead-gen) — 560×360 card

**Left state label:** `Week 0`  
**Left visual:** Empty checklist, gray chat thread “What should I do with AI?”, muted

**Right state label:** `Week 8`  
**Right visual:** Milestone 4/5 complete, session note “Lead-gen workflow live”, small green/indigo positive metric `+34% inquiries` (no guarantee language)

**Interaction:** Draggable vertical divider (compare slider) OR crossfade toggle `Before | After`

**Motion:** divider handle glows indigo on drag; **no** auto-animation loop

**Reduced motion:** Side-by-side static two columns, no slider

---

### Implementation notes (for engineering handoff)

- Prefer **CSS + SVG** or **Framer Motion** in React; avoid Lottie unless designer exports
- Hero draw: `stroke-dasharray` / `stroke-dashoffset` on path elements
- Scroll sync: `IntersectionObserver` on `[data-step="1"]` … `[data-step="4"]`
- Test Lighthouse: no layout shift; animate `transform` and `opacity` only
- Assets: reuse `IlluminairyMark` SVG paths; graveyard diagram separate asset

### Acceptance criteria

- [ ] First paint: user sees path “light up” in <1.2s without feeling gimmicky
- [ ] Scrolling “how it works” clearly links text to diagram segment
- [ ] `prefers-reduced-motion: reduce` disables draw, pulse, and slider inertia
- [ ] No motion runs infinitely except optional waitlist form focus states

### One-line creative direction

> Motion teaches the product model once on entry, then uses scroll to walk the same path again — same story, zero extra copy.

---

## How to use these prompts

| Tool | Prompt 1 | Prompt 2 | Prompt 3 |
|------|----------|----------|----------|
| **Figma AI / FigJam** | Paste Prompt 1 + tokens | Paste Prompt 2 | Use Prompt 3 as annotation layer on prototype |
| **v0 / Galileo / Lovable** | Paste full Prompt 1 | Paste Prompt 2 for separate generation | Paste Motion C only for slider component |
| **Human designer** | Send all three + `docs/brand-source/` | | |
| **Cursor / front-end** | Implement from exported PNG/SVG | SVG inline in React | Implement Motion A–C spec |

After assets land in repo, suggested paths:

- `public/marketing/illuminairy-os-mock.png`
- `public/marketing/graveyard-vs-path.svg`
- `components/marketing/` for animated versions
