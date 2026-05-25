# Active context

*Last updated: 2026-05-25*

## Current focus

- **SAT plan funnel (production)** — https://illuminairy.com/satplan — **full spine implemented** (landing → book); no stubs left on main path
- **`noindex`** until Brianna review + launch QA
- Specs/copy tracked in **quizfunnel** repo; code in this repo

## Recent changes (2026-05-25)

- **INT2 `gpa-paradox`** — tutor-note layout (headline eyebrow, quote, In school / On the SAT cards, closing copy, Maya signature); **no 200+ stat banner**
- **Q7 `wrong`** — tile art redone as dashboard widgets (`ico-wrong-*` in `wrong-reason-icons.tsx` + `funnel.css`)
- **INT12 `sat-changed`** — mockup layout (Digital headline, baseball subhead, two-panel contrast w/ year badges, 3 stat rows, closing line); May 2026 art

## Recent changes (2026-05-24)

- **INT2** `gpa-paradox` — v4 tutor copy (not “GPA says one thing” marketer lines); eyebrow “Why smart kids score low”; GPA/SAT split graphic; `satGpaSatResearch` footnote; optional `NEXT_PUBLIC_SATPLAN_INT2_VIDEO_URL`
- **Tail screens shipped:** `wrong` (multiselect + categories), **INT6-timeline**, **INT6** `plan-path` (gap + 182 + chart), `contact`, `plan-ready`, `report`, `book` (Calendly link). **Removed:** `schools` Q (May 2026).
- **Helpers:** `score-gap.ts`, `wrong-options.ts`, timeline math in `sat-test-dates.ts`, `report-summary.ts`
- **INT8 trilogy** (prior session): plateau → proof → mentors → guided; self-study routes through trilogy; mentorship tap-through fix
- Key paths: `components/sat-plan/sat-plan-funnel.tsx`, `lib/sat-plan-funnel/funnel-routing.ts`, `app/satplan/funnel.css` (form + category styles)

## Next steps

- [ ] **Brianna review** — copy/tone on INT6, contact TCPA, report layout (no verify/QA until approved)
- [ ] Wire contact → API / Klaviyo (sessionStorage only today)
- [ ] Replace default `prep-paths-triptych.png` with son/neutral art
- [x] **INT12** format contrast image — `digital-vs-paper-prep.png` (1979 paper · digital Bluebook + Desmos, May 2026) on `sat-changed`
- [ ] Meta IAB QA on 390×844 after review
- [ ] Remove `noindex` when launch-ready

## Session notes

- Local: `npm run dev` → http://localhost:3000/satplan?step=wrong (etc.)
- Layout CSS edits: `FUNNEL_LAYOUT_UNLOCK=1`
