# Active context

*Last updated: 2026-05-25*

## Current focus

- **SAT plan funnel (production)** — https://illuminairy.com/satplan — **Phase A UI** through **booked** (Ch.2 name + score-fit, Ch.3 interstitials, report/book/confirm); **Phase B** (lead API, server-side CRM) not wired
- **`noindex`** until Brianna review + launch QA
- Specs/copy tracked in **quizfunnel** repo; code in this repo

## Production spine (tested path)

landing → **meaning** → worries → … → **ch3-path** → contact → **reveal-stakes** → **reveal-diagnosis** → **reveal-bottlenecks** → **reveal-proof** → book → **booked**

**Removed from spine (2026-05):** `plan-ready`, `report` — legacy `?step=` aliases redirect into reveal chain.

**Never-tested:** INT8 → INT12 → GPA → … *(skips prep, score, wrong)*

## Recent changes (2026-05-25)

- **INT8 diagnostic-driven animation** — 12-skill scan sample (28 in copy only); phase timings ~7s total; faster build-plan steps
- **INT8 self-study fail copy** — lead uses `prepMirrorPhrase` + effort stack + 28-skill gap; dropped awkward `profilePatternLine` prefix on `prep-failed-self-study`
- **`meaning` intake step** — positive multiselect before worries (`sat-plan-meaning.tsx`, `meaning-options.ts`); landing → `?step=meaning`; progress labels 1–12 of 12
- **Ch.2 + Ch.3 + tail** — `student-name`, `score-fit` (INT6-prediction), Ch.3 block (`ch3-social` … `ch3-path`), structured **report** (`report-plan.ts`), **book** (Calendly embed), **booked**; layout bodies in `funnel-*-body.tsx` (layout guard clean)
- **Screen 16** — no fake calculating step; `plan-ready` is honest copy, instant continue
- **Diagnosis voice** — `lib/sat-plan-funnel/diagnosis-copy.ts`, `prep-labels.ts`; interstitial + report copy mirrors prep/target/score/wrong; quizfunnel [`files/funnel-diagnosis-voice.md`](../quizfunnel/files/funnel-diagnosis-voice.md)
- **INT2 `gpa-paradox`** — tutor-note layout (headline eyebrow, quote, In school / On the SAT cards, closing copy, Maya signature); **no 200+ stat banner**
- **Q `wrong`** — tile art as dashboard widgets (`ico-wrong-*` in `wrong-reason-icons.tsx` + `funnel.css`)
- **INT12 `sat-changed`** — mockup layout (Digital headline, baseball subhead, two-panel contrast w/ year badges, 3 stat rows, closing line); May 2026 art
- **quizfunnel docs** synced (README, memory-bank, SPEC, FUNNEL-MASTER-FLOW)

## Recent changes (2026-05-24)

- Tail: contact → post-contact reveal (stakes, diagnosis, bottlenecks, proof) → book (Calendly embed)
- INT8: proof → guided → mistake-driven (mentors step in types but not routed)
- Helpers: `score-gap.ts`, `wrong-options.ts`, `report-summary.ts`
- Key paths: `components/sat-plan/sat-plan-funnel.tsx`, `lib/sat-plan-funnel/funnel-routing.ts`, `app/satplan/funnel.css`

## Removed (permanent)

- `hours` study-time Q (2026-05-24)
- INT13 kid-problem (2026-05)

## Next steps

- [ ] **Phase B** — `POST /api/funnel/lead`, Supabase upsert, Klaviyo, Calendly webhook
- [ ] **Contact** — TCPA checkbox shipped in UI; wire to API + legal review in Phase B
- [ ] **Brianna review** — copy/tone on INT6, report layout
- [ ] **Schools step** — optional skip today; remove from routing if product approves
- [ ] Replace default `prep-paths-triptych.png` with son/neutral art
- [ ] Meta IAB QA on 390×844
- [ ] Remove `noindex` when launch-ready

## Session notes

- Local: `npm run dev` → http://localhost:3000/satplan?step=wrong (etc.)
- Verify: `FUNNEL_LAYOUT_UNLOCK=1 npm run agent:verify`
- INT2 video (optional): `NEXT_PUBLIC_SATPLAN_INT2_VIDEO_URL`
