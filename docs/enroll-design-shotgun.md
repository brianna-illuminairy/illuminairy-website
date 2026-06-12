# `/enroll` design-shotgun — onboarding UX directions

Four onboarding directions inside the Aurora neighborhood, pre-pick. Each variant holds the Anchor list from `docs/enroll-gstack-context.md` (palette family, motif, single-column shell, one CTA, existing logo, step-interaction modes, locked product facts). Each variant locks one type pairing, one button treatment, one italic rule, one hero treatment across all enroll steps in that variant.

The variant choice is captured in **`docs/enroll-design-pick.md`** (next step).

---

## Variant A — `/plan` parity (low-risk continuity)

**Visual cluster:** straight `/plan` baseline. Source Serif 4 500 + Schibsted Grotesk + DM Mono eyebrow. Navy `.qf-top` band only, forest pill `→` CTA, plain panel cards, forest-non-italic `<em>`.

**UX pattern:** 5 steps, each its own screen, all using the locked `QFScreen` shell.

| # | Step ID | Mode | Purpose |
|---|---------|------|---------|
| 1 | `welcome` | `explicit-cta` | "Payment received. Three quick things, then we book your Skill Diagnostic." Agenda checklist of next steps. Continue. |
| 2 | `profile` | `form-continue` | Parent contact (4 fields) + student first name. Prefilled values shown as `.qf-input` with green check chip in label corner; "Add optional details" expands grade / school / student phone / email / `satTakenBefore`. |
| 3 | `updates` | `form-continue` | Two channel cards (email / SMS) with toggles + inline TCPA below SMS. "Add another parent" link expands second-guardian inputs in the same step. |
| 4 | `diagnostic` | `explicit-cta` | Calendly inline embed full-bleed. Sticky context summary above ("Skill Diagnostic · 2 hr 14 min · {studentFirst}"). Continue disabled until slot booked. |
| 5 | `complete` | `auto-advance` | Plain "You're all set" success state, agenda card listing what happens this week, support email line. |

**Welcome treatment:** small navy band header + `.qf-h1` "Welcome aboard" + agenda checklist (3 bullets) + forest pill Continue.

**Summary card pattern:** prefilled `.qf-input`s in the same input style — small green check chip in the field label spot when value came from prefill; user can tap to edit any field directly.

**Weekly updates layout:** two `.qf-opt` channel cards stacked (Email · SMS) with multi-select check; second guardian as inline accordion below.

**Complete / success state:** `.qf-h1` "You're all set" + agenda card with three forest-bullet items for this week + support email.

**Italic rule:** none (forest-color `<em>`, non-italic — matches `/plan`).
**Button:** solid forest pill `qf-btn forest` with `→`.
**Trust elements:** support email in success state only.

**Strengths:** lowest brand-drift risk; absolute funnel-to-enroll continuity; uses every primitive that already exists; no new CSS.
**Weaknesses:** loses the "premium checkout moment" feel — feels like more of the funnel. Welcome and success are quiet.

---

## Variant B — Component-sheet leaning (premium checkout)

**Visual cluster:** Aurora Tokens.html componentry. Source Serif 4 display held (we don't swap fonts mid-product), but borrow:
- **Dark feature card** (navy bg, glow halo top-right) for `welcome` hero and `complete` success
- **Soft / muted card** patterns for inline summaries
- Compact auto-width pill for secondary actions; primary stays forest 56px pill

**UX pattern:** 4 steps — combine welcome agenda *into* the first profile screen as a hero card, push success to a richer "what happens this week" screen.

| # | Step ID | Mode | Purpose |
|---|---------|------|---------|
| 1 | `profile` | `form-continue` | Dark feature card hero: "You're in, {parentFirst}." + 1-line agenda underneath. Below: parent + student inputs as `.qf-input`s with prefilled values shown read-only with an Edit pill (auto-width forest-soft) per row. |
| 2 | `updates` | `form-continue` | Two channel cards (Email / SMS) using the **soft selected wash** when toggled. Second parent collapsed under "Add another parent or guardian" muted card. |
| 3 | `diagnostic` | `explicit-cta` | Calendly with a soft summary card on top showing parent name + student name + program facts, "Picking your Skill Diagnostic time." |
| 4 | `complete` | `auto-advance` | **Dark feature card** success state — "Welcome to SAT Accelerator." Glow halo, agenda card under it ("This week: diagnostic · weekly classes start · mentor intro email"). |

**Welcome treatment:** dark feature card hero on the profile step (no separate welcome screen).

**Summary card pattern:** prefilled rows render as muted card with label-value rows + Edit pill (auto-width compact pill, forest-soft fill) per row. Tapping Edit swaps that row to a `.qf-input`.

**Weekly updates layout:** soft-wash channel cards (email / SMS) with toggles and selected glow. TCPA inline under SMS as a small `.qf-tcpa` block. "Add another parent or guardian" expands an inline muted card with second-parent fields.

**Complete / success state:** dark feature card with `.qf-h1` and glow halo top-right, then agenda card listing three things parent will see this week.

**Italic rule:** forest non-italic (matches `/plan` rule, italic remains banned by CSS).
**Button:** primary forest 56px pill; secondary auto-width compact pill (`qf-btn--pill` style — Edit, Add another guardian).
**Trust elements:** muted facts strip on diagnostic step ("Skill Diagnostic · 2 hr 14 min proctored"); support email on complete.

**Strengths:** feels like a real consumer onboarding (welcome moment, success moment); reuses Aurora Tokens componentry that's already in `quiz-funnel.css` (`.card.dark`, `.card.cream`); matches "premium" promise of $1,200 program.
**Weaknesses:** slightly more visual weight than `/plan` step screens (more cards on profile); needs care to avoid two competing primaries when Edit pills are present.

---

## Variant C — In-context leaning (marketing-site continuity)

**Visual cluster:** illuminairy_context.html mood. Tighter tracking, lowercase pills, subtle radial glow on key surfaces. Italic glow `<em>` is **off-limits** because of the `.qf-page` italic ban — instead use forest-non-italic. DM Sans display would break parity with `/plan`'s Source Serif 4 — keep Source Serif 4 but borrow:
- Centered radial-glow hero for welcome + complete
- Compact lowercase secondary pills
- Aurora gradient line under headline on welcome/complete

**UX pattern:** 5 steps but the first and last get the marketing-site-feel hero treatment.

| # | Step ID | Mode | Purpose |
|---|---------|------|---------|
| 1 | `welcome` | `explicit-cta` | Centered radial-glow hero on navy `.qf-top` extension. Headline + agenda checklist. Forest pill Continue. |
| 2 | `profile` | `form-continue` | Standard `.qf-input` form, prefill chips. |
| 3 | `updates` | `form-continue` | Channel cards + second-guardian inline. |
| 4 | `diagnostic` | `explicit-cta` | Calendly with thin context bar above. |
| 5 | `complete` | `auto-advance` | Centered radial-glow hero "You're all set" + agenda. |

**Welcome treatment:** navy band extends to ~50dvh, centered eyebrow + headline + lead + glow halo + forest pill Continue.

**Summary card pattern:** same as Variant A — `.qf-input`s with prefill check chip.

**Weekly updates layout:** channel cards, no major change from B.

**Complete / success state:** matching centered radial-glow on a navy `.qf-top` extension.

**Italic rule:** forest non-italic (italic glow `<em>` would violate site-wide ban).
**Button:** primary forest 56px pill; "Add another guardian" as compact lowercase pill `qf-btn--pill ghost`.

**Strengths:** bigger emotional moments at start and end; lowercase pills are a recognizable Illuminairy social-mood touch.
**Weaknesses:** more new CSS to author (centered radial hero is new); risk of feeling more "marketing site" than "completing my checkout"; two extra screens vs Variant B.

---

## Variant D — Hybrid (recommended)

**Visual cluster:** `/plan` shell + **one strong dark feature card borrow** from Aurora Tokens for the moments that need weight (welcome + success). Everything else stays plain `/plan`.

**UX pattern:** 5 steps, all on `QFScreen`, but step 1 and step 5 use a dark feature card hero inside the `.qf-body` (not the `.qf-top` band — keeps shell anatomy locked).

| # | Step ID | Mode | Purpose |
|---|---------|------|---------|
| 1 | `welcome` | `explicit-cta` | `QFScreen` with `.qf-top` navy band + a `.card.dark` feature card inside `.qf-body`: "Welcome to SAT Accelerator, {parentFirst}." Agenda checklist (3 items). Forest pill Continue. |
| 2 | `profile` | `form-continue` | Plain `.qf-input` form. Prefilled values shown as `.qf-input` with `.qf-prefill-chip` (small forest-soft check chip) inside the field label area. Optional fields collapsed under "Add school + grade" muted text button. |
| 3 | `updates` | `form-continue` | Two `.qf-opt` channel cards with multi-select check (email / SMS). TCPA inline below SMS. "Add another parent or guardian" link expands second-guardian inputs in the same screen. |
| 4 | `diagnostic` | `explicit-cta` | Calendly inline embed taking most of body. Soft summary card pinned above (`.card.cream`): "Skill Diagnostic · 2 hr 14 min · {studentFirst}". Continue (Complete enrollment) disabled until slot. |
| 5 | `complete` | `auto-advance` | `.card.dark` feature card success: "You're enrolled, {studentFirst}." Below: agenda card with three forest-bullet items for this week + support email. |

**Welcome treatment:** dark feature card inside `.qf-body` — no new shell CSS, uses the existing `.card.dark` primitive in `quiz-funnel.css`. Agenda is a `.checklist` with three forest dots.

**Summary card pattern:** prefilled `.qf-input`s with a small `.qf-prefill-chip` inside each field label saying `From your Plan Builder` (changed to neutral "Saved" — see copy-ssot todo) + invisible-on-edit so the chip disappears when user edits. Forest-soft chip color, not the same as form errors.

**Weekly updates layout:** `.qf-opt` style cards (email + SMS) selectable; second guardian inline expand below ("Add another parent or guardian" link).

**Complete / success state:** dark feature card success + agenda card.

**Italic rule:** forest non-italic. Site-wide italic ban respected.
**Button:** primary forest 56px pill `qf-btn forest`; "Add another parent or guardian" rendered as a text button (`qf-link-button`) — no second primary CTA.
**In-context borrow (single, allowed):** dark feature card on `welcome` and `complete`. That's it.

**Strengths:**
- Reuses every primitive already in `quiz-funnel.css` — no shell CSS, no new tokens
- Welcome and success have weight (dark feature card glow halo) — feels like a real $1,200 product
- All other steps are exactly funnel-shell so message-match continuity is high
- Mobile shell stays locked (`docs/funnel-mobile-shell.md`) — no risk of iOS keyboard bugs
- Single in-context borrow, hold-the-line everywhere else

**Weaknesses:**
- Slightly less editorial than full Variant B; less marketing-mood than Variant C
- Requires one new component (`.qf-prefill-chip`) — small, isolated to enroll

---

## Comparison summary

| | A — /plan parity | B — Component | C — In-context | **D — Hybrid (rec.)** |
|--|--|--|--|--|
| Brand-drift risk | Lowest | Low | Medium | Low |
| New CSS | None | None | New radial hero | One small chip |
| Welcome moment weight | Light | Heavy | Heavy | Heavy |
| Success moment weight | Light | Heavy | Heavy | Heavy |
| Reuses /plan primitives | All | Most | Some | All |
| Mobile shell locked | Yes | Yes | Risk | Yes |
| Steps | 5 | 4 | 5 | 5 |

**Recommended: Variant D.** Borrows exactly one component-sheet element (dark feature card) for the moments that matter, holds the rest at `/plan` parity, costs ~one CSS class and zero new shell work.
