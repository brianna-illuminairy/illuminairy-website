# Active context

*Last updated: 2026-05-25*

## Current focus

- **SAT plan funnel (production)** — https://illuminairy.com/satplan — **Phase A UI complete** (landing → book); **Phase B** (lead API, TCPA, CRM) not wired
- **`noindex`** until Brianna review + launch QA
- Specs/copy tracked in **quizfunnel** repo; code in this repo

## Production spine (tested path)

landing → worries → who → target → INT1 → history → [INT3] → prep → **INT8 quartet** → score → wrong → **INT12** → GPA → **INT2** → test-date → **INT6-timeline** → schools *(optional skip)* → **plan-path** → contact → plan-ready → report → book

**Never-tested:** INT8 → INT12 → GPA → … *(skips prep, score, wrong)*

## Recent changes (2026-05-25)

- **INT2 `gpa-paradox`** — tutor-note layout (headline eyebrow, quote, In school / On the SAT cards, closing copy, Maya signature); **no 200+ stat banner**
- **Q `wrong`** — tile art as dashboard widgets (`ico-wrong-*` in `wrong-reason-icons.tsx` + `funnel.css`)
- **INT12 `sat-changed`** — mockup layout (Digital headline, baseball subhead, two-panel contrast w/ year badges, 3 stat rows, closing line); May 2026 art
- **quizfunnel docs** synced (README, memory-bank, SPEC, FUNNEL-MASTER-FLOW)

## Recent changes (2026-05-24)

- Tail screens: wrong, INT6 timeline, plan-path, contact, plan-ready, report, book (Calendly)
- INT8: proof → guided → mistake-driven (mentors step in types but not routed)
- Helpers: `score-gap.ts`, `wrong-options.ts`, `report-summary.ts`
- Key paths: `components/sat-plan/sat-plan-funnel.tsx`, `lib/sat-plan-funnel/funnel-routing.ts`, `app/satplan/funnel.css`

## Removed (permanent)

- `hours` study-time Q (2026-05-24)
- INT13 kid-problem (2026-05)

## Next steps

- [ ] **Phase B** — `POST /api/funnel/lead`, Supabase upsert, Klaviyo, Calendly webhook
- [ ] **Contact** — TCPA + privacy consent (form UI shipped; legal copy pending)
- [ ] **Brianna review** — copy/tone on INT6, report layout
- [ ] **Schools step** — optional skip today; remove from routing if product approves
- [ ] Replace default `prep-paths-triptych.png` with son/neutral art
- [ ] Meta IAB QA on 390×844
- [ ] Remove `noindex` when launch-ready

## Session notes

- Local: `npm run dev` → http://localhost:3000/satplan?step=wrong (etc.)
- Verify: `FUNNEL_LAYOUT_UNLOCK=1 npm run agent:verify`
- INT2 video (optional): `NEXT_PUBLIC_SATPLAN_INT2_VIDEO_URL`
