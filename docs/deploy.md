# Deploy — Illuminairy production

Production: **https://illuminairy.com** · Vercel project: `illuminairy-website` · GitHub: `brianna-illuminairy/illuminairy-website`

**Multiple funnels, one build:** Plan Builder (`/plan`), SAT plan (`/satplan`), home LP, share, APIs — all ship in a **single** `npm run build`. See [`production-surfaces.md`](production-surfaces.md) for the map and per-surface verify.

## Canonical path (use this)

Vercel is **connected to GitHub**. Pushing `main` triggers one production build for the whole site.

```
1. npm run agent:verify          # all funnels: layout + CTA guards, lint, full build
2. (if /plan changed) npm run funnel:e2e   # needs local dev server
3. git add … && git commit …     # on main, or merge PR to main
4. npm run release               # git push origin main + smoke prod (all surfaces)
5. Vercel builds from GitHub     # ~1 min
```

**Do not** use `npm run deploy:cli`, `vercel deploy`, or any other Vercel CLI deploy for normal releases. That uploads your **local folder** and can put production ahead of git.

**Agents:** never run Vercel CLI against production (`vercel deploy`, `vercel env add/update`, `env:sync`) unless Brianna explicitly asks. Ship code with **git push only**; Vercel rebuilds from GitHub. Env var changes: **Vercel dashboard** (Production) by the owner, then push `main` to rebuild so `NEXT_PUBLIC_*` bakes in.

## Scripts

| Command | When |
|---------|------|
| `npm run release` | **Default ship** — verify, push `main`, multi-surface smoke |
| `npm run agent:verify` | Pre-commit gate (satplan + plan guards + lint + build) |
| `npm run funnel:e2e` | Plan Builder only — after quiz/shell edits |
| `npm run env:sync` | **Owner only** — pushes `.env.local` → Vercel via CLI; then push `main` to rebuild. Agents: do not run; use dashboard instead. |
| `npm run env:pull` | **Owner only** — pull Vercel env to `.env.local` for local dev |
| `npm run smoke:prod` | After deploy; home, plan, satplan, ad LP, share API |
| `npm run deploy:cli` | **Emergency only** — `DEPLOY_CLI_OK=1` |

## Branches

| Branch | Vercel |
|--------|--------|
| `main` | **Production** (`illuminairy.com`) — all surfaces |
| Other branches | Preview URLs (full site preview) |

Feature work: branch → PR → merge to `main` → auto-deploy.

## Environment variables

Client `NEXT_PUBLIC_*` vars are baked at **build** time. After changing them in the **Vercel dashboard** (Production), push any commit to `main` (or use **Redeploy** on the latest GitHub deployment) so the build picks up new values.

Parity check: `npm run verify:calendly-parity` (git SSOT vs `.env.example` / `.env.local`). Prod check: `npm run smoke:prod` (includes Calendly event path).

## Agent / Cursor rules

- **Never** `deploy:cli`, `vercel deploy`, or Vercel CLI env mutations unless the user explicitly requests it.
- **Always** commit → `git push origin main` (or `npm run release`) so prod matches GitHub.
- Match verify to the surface you changed (`production-surfaces.md`).
- One funnel change still deploys everything — smoke catches cross-route breakage.

## Quick checklist (paid traffic → Plan Builder)

- [ ] `npm run agent:verify`
- [ ] `npm run funnel:e2e` if `app/quiz/` or plan shell CSS changed
- [ ] `git push origin main` (or `npm run release`)
- [ ] `npm run smoke:prod` — includes `/sat-plan-builder`, `/plan`, `/satplan`
- [ ] Phone: ad LP → plan → i-steps CTA pinned

See also: `growth/prod-deploy-checklist.md` (LP/analytics), `AGENTS.md`.
