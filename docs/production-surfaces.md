# Production surfaces — one repo, one deploy

**illuminairy.com** runs a **single Next.js build** on Vercel. Pushing `main` deploys **every** route below together. There is not a separate Vercel project per funnel.

```
git push main  →  Vercel build (npm run build)  →  illuminairy.com (all paths)
```

If git and Vercel disagree, something used `deploy:cli` (local upload). Fix: commit → push. See [`deploy.md`](deploy.md).

## Surfaces map

| Surface | Live URLs | Code roots | Layout lock |
|---------|-----------|------------|-------------|
| **Plan Builder** (paid ads) | `/plan`, `/quiz`, `/sat-plan-builder` | `app/quiz/`, `lib/quiz-funnel/`, `app/quiz-funnel.css`, `app/funnel-responsive.css` | `app/quiz/LAYOUT.lock.md`, `docs/funnel-mobile-shell.md` |
| **SAT plan funnel** (Meta lagoon) | `/satplan` | `app/satplan/`, `components/sat-plan/`, `lib/sat-plan-funnel/` | `components/sat-plan/LAYOUT.lock.md` |
| **Marketing home** | `/`, `/?lp=b3a` etc. | `app/page.tsx`, `components/landing/`, `app/landing/*.css` | — |
| **Plan share** | `/quiz/share/[id]` | `app/quiz/share/`, `app/api/funnel/plan-share/` | — |
| **Enrollment / site** | `/enroll`, `/contact`, legal, `/sat-accelerator` (if routed) | `app/`, `components/` | — |

**Redirects (same deploy):**

| From | To |
|------|-----|
| `/quiz` | `/plan` (client redirect in `next.config.mjs`) |
| `/plan` | `/quiz` (rewrite — public ads use `/plan`) |
| `/assessment` | `/plan?step=q-who` (permanent) |

## Verify before release (by what you changed)

| You touched | Run (in addition to `npm run agent:verify`) |
|-------------|---------------------------------------------|
| Plan Builder UI/shell | `npm run funnel:e2e` (dev server on :3000 or :3001) |
| SAT plan steps only | `npm run funnel:layout-guard` (already in `agent:verify`) + manual `/satplan` |
| Landing / LP CSS | `growth/b3-lp-viewport-qa.md` checklist; `npm run smoke:prod` |
| APIs / share | `npm run smoke:prod` |
| Env vars only | `npm run env:sync` then push (rebuild bakes `NEXT_PUBLIC_*`) |

`npm run agent:verify` always runs:

- `funnel:layout-guard` — `/satplan` shell lock
- `funnel:cta-guard` — `/plan` mobile shell + step modes
- `funnel:step-registry` — Plan Builder routing
- `lint` + `build` — **whole site** compiles

## After deploy — smoke by surface

`npm run smoke:prod` hits:

- Home + LP variant
- Plan Builder entry + deep links + `/plan` rewrite
- Ad LP `/sat-plan-builder`
- `/satplan` (lagoon funnel)
- Plan share API + page

Optional manual (phone): `/sat-plan-builder` → CTA → `/plan` → i-steps CTA visible.

## Agents

- Do not CLI-deploy (`deploy:cli`) for normal work.
- Changing one funnel still ships all routes — run the verify row for the surface you edited.
- Do not fix Plan Builder CTAs with heights in step files; fix the shell (`docs/funnel-mobile-shell.md`).
