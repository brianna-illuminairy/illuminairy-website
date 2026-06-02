# Growth docs — what to use (June 2026)

**Icon / Meta only?** → **[`icon-fall-sat-2026.md`](./icon-fall-sat-2026.md)** (one file: 18 lines, UGC scripts, cold-opens, brief).

**Moved / do not use:** `2026-06-icon-ad-variants.md`, `ugc-icon-spring-sat-revisions.md` (stubs point to the file above).

---

## Do this now

| Task | File |
|------|------|
| Paste Meta + Icon UGC | [`icon-fall-sat-2026.md`](./icon-fall-sat-2026.md) — **angles 1–26** (8–26 fully written) |
| Messaging rules | [`docs/messaging-guide.md`](../docs/messaging-guide.md) |
| Funnel strategy | [`funnel-strategy.md`](./funnel-strategy.md) |

---

## Other (not Icon)

| File | Purpose |
|------|---------|
| [`docs/klaviyo-quiz-funnel-nurture.md`](../docs/klaviyo-quiz-funnel-nurture.md) | Email flows |
| [`2026-06-strategy-call-sms.md`](./2026-06-strategy-call-sms.md) | SMS drafts |
| [`posthog-funnel-dashboard.md`](./posthog-funnel-dashboard.md) | Analytics |
| [`2026-06-full-funnel-conversion-plan.md`](./2026-06-full-funnel-conversion-plan.md) | Session log (not for paste) |
| [`competitor-ads-transcripts-2026-06.md`](./competitor-ads-transcripts-2026-06.md) | Competitor UGC transcripts (reference); synthesis in [`icon-fall-sat-2026.md`](./icon-fall-sat-2026.md) |
| B3 `b3-lp-*` | Landing page only |

---

## Code (deploy separately)

`app/quiz/`, `lib/quiz-funnel/`, `lib/landing/content.ts`, `/plan` routes — run `npm run agent:verify` before ship.
