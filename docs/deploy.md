# Deploy — Illuminairy production

Production: **https://illuminairy.com** · Vercel project: `illuminairy-website` · GitHub: `brianna-illuminairy/illuminairy-website`

## Canonical path (use this)

Vercel is **connected to GitHub**. Pushing `main` triggers a production build automatically.

```
1. npm run agent:verify          # lint + build + funnel guards
2. git add … && git commit …     # commit on main (or merge PR to main)
3. npm run release               # git push origin main + smoke prod
4. Vercel builds from GitHub     # ~1 min; watch dashboard or wait for smoke
```

**Do not** use `npm run deploy:cli` for normal releases. That uploads your **local folder** (including uncommitted edits) and can put production ahead of git.

## Scripts

| Command | When |
|---------|------|
| `npm run release` | **Default ship** — verify, push `main`, smoke prod |
| `npm run env:sync` | Only when env vars changed (`.env.local` → Vercel) |
| `npm run smoke:prod` | After deploy; hits live illuminairy.com |
| `npm run deploy:cli` | **Emergency only** — local CLI upload (`DEPLOY_CLI_OK=1`) |

## Branches

| Branch | Vercel |
|--------|--------|
| `main` | **Production** (`illuminairy.com`) |
| Other branches | Preview URLs (if pushed to GitHub) |

Feature work: branch → PR → merge to `main` → auto-deploy. No direct CLI prod deploy.

## Environment variables

Client `NEXT_PUBLIC_*` vars are baked at **build** time. After `env:sync`, redeploy (push to `main` or emergency CLI).

Server-only secrets (`STRIPE_SECRET_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, etc.) apply on the next deployment without a rebuild if only runtime vars changed — but when in doubt, push again.

## Agent / Cursor rule

- **Never** `npm run deploy:cli` unless the user explicitly requests an emergency hotfix.
- **Always** commit → `npm run release` (git push) so prod matches GitHub.
- If prod was CLI-deployed, commit the same changes immediately so git catches up.

## Checklist (paid traffic / funnel)

- [ ] `npm run agent:verify`
- [ ] `npm run funnel:e2e` (with dev server) for funnel layout changes
- [ ] `git push origin main`
- [ ] `npm run smoke:prod` after Vercel shows Ready
- [ ] Spot-check `/plan` or `/sat-plan-builder` on a phone

See also: `growth/prod-deploy-checklist.md` (LP/analytics), `AGENTS.md`.
