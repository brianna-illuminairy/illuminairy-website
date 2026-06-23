# Danielle portal — production setup

If `/danielle/*` shows **"Student portal unavailable"**, production is missing `DANIELLE_ACCESS_ALLOWLIST`.

## Required (Production on Vercel)

| Variable | Purpose |
|----------|---------|
| `DANIELLE_ACCESS_ALLOWLIST` | Comma-separated emails that can sign in (Danielle + parent). **Portal is disabled when empty.** |

Copy the value from your local `.env.local` (same key).

## Optional (recommended)

| Variable | Purpose |
|----------|---------|
| `DANIELLE_PORTAL_ROLES` | `email=student`, `email=parent`, `email=owner` for portal UI |
| `DANIELLE_OWNER_QA_SECRET` | Staff preview on `/danielle/login?staff=1` |
| `DANIELLE_NOTIFY_TARGETS` | Portal update emails |
| `ADMIN_SECRET` | `npm run danielle:send-weekly-report` API |
| `RESEND_API_KEY` | Weekly report + notify emails |

## Fix (owner)

1. Vercel dashboard → **illuminairy-website** → **Settings** → **Environment Variables**
2. **Production** scope → add `DANIELLE_ACCESS_ALLOWLIST` (paste from `.env.local`)
3. Add other `DANIELLE_*` vars if notify/roles should match local
4. **Redeploy** latest `main` (or push an empty commit) so the build picks up server env

## Verify

```bash
curl -sL https://illuminairy.com/danielle/week-1/report | rg "Student portal unavailable|Weekly Progress Report"
```

- **Bad:** `Student portal unavailable`
- **Good:** redirects to login or shows report HTML after auth

## Local dev

`.env.local` must include `DANIELLE_ACCESS_ALLOWLIST`. Restart `npm run dev` after changes.
