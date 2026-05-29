# Active context

*Last updated: 2026-05-28*

## Current focus

- **SAT Score Path funnel** — `/quiz` — parent intake → insight hits → plan reveal → Strategy Call booking. Primary copy surface.
- **B3 landing** — `/` — PostHog A/B variants; hands off to Score Path.
- **SAT plan funnel v1** — `/satplan` — layout-locked; separate from Score Path.
- **Assessment funnel** — `/assessment` — Hims-style intake; `noindex` until launch QA.

## Messaging (do not re-debate — locked)

**Single source of truth:** [`docs/messaging-guide.md`](../docs/messaging-guide.md)  
**Enforced by:** `.cursor/rules/messaging-guide.mdc` + `.cursor/rules/banned-copy-phrases.mdc` (both always-on)

Owner corrections already baked in — agents should read the guide, not ask again:

| Topic | Locked decision |
|-------|-----------------|
| Audience | Parents — never call Score Path a "quiz" |
| Product names | Score Path · Strategy Call (15 min) · Skill Diagnostic (2 hr 14 min, after call) |
| Core contrast | Everything on SAT vs **5–6 skills** from diagnostic |
| Effort | `~5–7 hrs/week · mistake-driven SAT tutoring on their weakest skills` |
| First-month stat | **90%** at **20–28 hrs** → **100+** month one — after **i-steps**, not q7 |
| Q2 | Positive stakes — “What would a higher SAT score help them achieve?” |
| Insight hits | Autoprogress ~6s (scales with copy); closed-loop copy |
| Education slides | q3=none, q5=tbd/2027, q8=tbd — see messaging-guide §8 |
| Booking | s5/s9 tie to q2 goal phrase (no extra Yes/No screen) |
| Do NOT use | CB ~115/20hr OSP, "District-wide," "not a Khan stat," gains/cost points/leaking/hiding, point leak(s), generic prep/plan/review, Our read |
| Stats | Import only from `lib/site.ts` — pair with "Results vary" |

## Score Path spine

`q1–q5` → … → `i1` → `q6` → `q7` → `hit-q7` (prep × section) → `i-compare` (proof) → …

Key libs: `lib/quiz-funnel/plan-reveal.ts`, `insight-hits.ts`, `stakes-copy.ts`, `education-slides.ts`, `score-path-copy.ts`, `lib/sat-skills-copy.ts`

## Production spine (satplan — legacy)

landing → meaning → … → reveal chain → book → booked

## Next steps (Score Path)

- [ ] Fog/Illuminate reveal animation (discussed, not built)
- [ ] Klaviyo/Calendly automation verify on prod
- [ ] Remove `noindex` when launch-ready

## Session notes

- Local: `npm run dev` → http://localhost:3000/quiz?step=reveal
- Answers: `localStorage` key `qf_answers`
- Verify: `npm run agent:verify`
