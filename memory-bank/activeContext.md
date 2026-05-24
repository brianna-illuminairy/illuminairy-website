# Active context

*Last updated: 2026-05-24*

## Current focus

- **SAT plan funnel (production)** — https://illuminairy.com/satplan — spine through **INT8** (prep comparison + mentorship beat); `gpa-stub` placeholder next
- **`noindex`** until launch-ready
- Specs/copy tracked in **quizfunnel** repo; code in this repo

## Recent changes (2026-05-24)

- **INT8 trilogy** for `prep_class`: `prep-failed-plateau` → `proof` → `mentors` → `guided` → `gpa-stub`
- **INT8 stub** for self-study / non-trilogy prep paths; `history_none` → stub (skip prep)
- **Contrast images:** `Int8PrepPathTriptych` — scaled 4:3 viewport; girl strip for daughter + **Me** (`prep-paths-triptych-daughter.png`)
- **INT8 proof:** Bloom two-sigma copy under headline; `ContrastBarChart` (3 bars)
- **INT3 retake:** 2-bar contrast chart
- **INT8 mentors:** `Int8MentorshipSplash` tap-through + reveal
- Key paths: `lib/sat-plan-funnel/prep-path-images.ts`, `int8-prep-comparison-copy.ts`, `funnel-routing.ts`, `app/satplan/funnel.css` (layout edits need `FUNNEL_LAYOUT_UNLOCK=1`)

## Next steps

- [ ] Replace default `prep-paths-triptych.png` with son/neutral art
- [ ] Build real **GPA** step → **INT2** GPA paradox
- [ ] Hours, score, wrong questions per quizfunnel master flow
- [ ] **INT12** digital SAT format split (planned)
- [ ] Contact → report → Calendly (Phase A tail)
- [ ] Meta IAB QA: INT8 trilogy on 390×844
- [ ] Remove `noindex` when spine + contact path launch-ready

## Other tracks

- **YC homepage** — `/` waitlist cutdown (ADR [0008](../docs/decisions/0008-yc-site-cutdown.md))
- **Human:** Klaviyo platform waitlist → `NEXT_PUBLIC_KLAVIYO_LIST_ID_PLATFORM_WAITLIST`

## Session notes

- Verify funnel: `FUNNEL_LAYOUT_UNLOCK=1 npm run agent:verify`
- QA URLs: `/satplan?step=prep-failed-plateau`, `prep-failed-proof`, `prep-failed-mentors`, `prep-failed-guided`
- Daughter/Me visual: pick **daughter** or **Me** on who step
