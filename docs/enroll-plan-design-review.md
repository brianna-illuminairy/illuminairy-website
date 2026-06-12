# `/enroll` plan-design-review — Variant D scoring

Pre-build review of the locked direction (`docs/enroll-design-pick.md`). Scores each design dimension 0–10 with a "what would make it a 10" lever, then captures the deltas folded back into the spec before implementation.

---

## Scores

| Dimension | Score | Rationale | What makes it 10 (resolved before build) |
|----------:|:-----:|-----------|------------------------------------------|
| Hierarchy | 9 | One eyebrow + one `.qf-h1` + one lead per step; one primary CTA pinned. Welcome and complete carry weight via dark feature card without competing with form steps. | Use a thinner step counter eyebrow so "Step N of 5" doesn't fight `.qf-h1`. **Locked: eyebrow uses existing `.qf-eyebrow` mono uppercase.** |
| Mobile shell | 10 | Reuses locked `QFScreen` from `app/quiz/components/QFShell.tsx` — `.qf-top` / `.qf-body` / `.qf-step-actions` flex chain (`docs/funnel-mobile-shell.md`). No new shell, no `position: fixed`. Calendly inline embed body is the only step that scrolls long. | — |
| One CTA per screen | 9 | Every input step has a single pinned forest pill. "Add another guardian" rendered as a `qf-link-button` text button so it doesn't compete with primary. | Verify Edit chips on profile are visual-only (chip), never a button — chip disappears when user edits the field. **Locked.** |
| Micro-interactions | 8 | Auto-focus first empty input on profile/updates; checkbox toggle on channel cards; agenda checklist appears on complete; pinned CTA disabled-while-loading. | Add a 200ms cross-fade between steps (mounted state, no layout shift). **Deferred to polish loop** — not required for v1. |
| Accessibility | 8 | All inputs labeled; pinned CTA reachable via keyboard; `aria-invalid` on TCPA when missing; success state has visible heading. | Ensure SMS TCPA reveal animates open without losing focus to revealed checkbox; ensure second-guardian expand keeps focus on the trigger button. **Locked: focus management is part of the build.** |
| Brand parity | 9 | Holds Anchor list (palette, motif, single column, one CTA, logo, step modes). Single in-context borrow (dark feature card) on welcome + complete only. | Cap chip color to forest-soft (`--qf-forest-soft`) — never red/error tone. **Locked.** |
| Copy quality | 9 | All strings move to `lib/enroll/enroll-copy.ts`; no data-source strings; product names exact; no banned phrases. | Welcome lead must not use "post-payment" — feels like internal phrasing. **Locked: "Payment confirmed. Three quick things, then we book your Skill Diagnostic."** |
| Funnel continuity | 10 | Same shell, same type, same chrome, same primary CTA color/shape, same logo lockup. Parent moving from `/plan` → Stripe → `/enroll` reads as the same brand family. | — |

**Overall: 9/10.** Cleared for build.

---

## Deltas folded back into the build spec

1. Step counter eyebrow uses `.qf-eyebrow` mono uppercase — confirms hierarchy stays beneath `.qf-h1`.
2. Edit chip is **visual-only** (`<span>`, no click handler). Tapping the input edits the value; chip disappears once user types.
3. Chip color = `--qf-forest-soft` background with `--qf-forest` border + check glyph. Never error red.
4. SMS TCPA reveal stays in-document flow (no slide animation) so iOS keyboard focus is preserved.
5. "Add another parent or guardian" is a `qf-link-button` (text-only with underline). Expanding moves focus into the first inline input.
6. Welcome lead copy: "Payment confirmed. Three quick things, then we book your Skill Diagnostic."
7. Complete state: no pinned action; agenda card and support email line only.
8. Cross-fade between steps deferred to polish loop — not a blocker.
