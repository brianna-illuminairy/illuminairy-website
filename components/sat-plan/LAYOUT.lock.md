# SAT plan quiz layout — LOCKED

**Agents: content only.** Do not change shell, spacing, CTA placement, or CSS unless the owner explicitly unlocks layout.

## What you may change (step screens)

| File pattern | Allowed |
|--------------|---------|
| `sat-plan-worries.tsx`, `sat-plan-who.tsx`, `sat-plan-target.tsx`, future `sat-plan-*.tsx` steps | `headline`, `hint`, `bodyVariant`, options/copy, state, analytics, `onContinue` / `onBack` |
| Body components | `QuizTileGrid`, `QuizOptionList` — **data + handlers only** |

## What is locked

| File | Owns |
|------|------|
| `app/satplan/funnel.css` | Spacing tokens, shell, progress, CTA gap, body variants |
| `funnel-shell.tsx` | Header, progress, step label, center column |
| `quiz-step-template.tsx` | Headline / hint slot / body / Continue structure |
| `funnel-cta.tsx` | Continue button |
| `lib/sat-plan-funnel/quiz-step-layout.ts` | `bodyVariant` enum |

## New screen checklist

1. Add step to `lib/sat-plan-funnel/state.ts` (routing only).
2. Create `sat-plan-{step}.tsx` using **`QuizStepTemplate`** + one body component.
3. Pick **`bodyVariant`**: `tile-grid` | `option-list` | `copy`.
4. Do **not** import `FunnelShell` or `FunnelCta` from step files.
5. Do **not** pass `footer`, `bodyClassName`, or custom `className` on the template.

## Unlock (humans only)

```bash
FUNNEL_LAYOUT_UNLOCK=1 npm run funnel:layout-guard
```

Use only when intentionally changing layout. Re-lock before merge unless the layout change is the PR purpose.

Spec mirror: `quizfunnel/files/quiz-step-template.md`, `quizfunnel/files/funnel-layout-rules.md`.
