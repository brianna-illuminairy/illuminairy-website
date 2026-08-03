# Analytics key matrix

Where keys live and what must match. **Never** commit secrets or paste full values into chat.

## Places

| Place | Role |
|-------|------|
| PostHog project `428901` | Project API `phc_…`, personal `phx_…`, warehouse OAuth |
| Vercel Production (`illuminairy-website`) | Live build/runtime SSOT |
| `.env.local` | Local `next dev` (may differ for Stripe test vs live) |
| `components/google-analytics.tsx` | Browser GA4 `G-B1XC1ND9GT` (hardcoded) |

## Rules

1. `NEXT_PUBLIC_POSTHOG_KEY` must be the project `phc_…` for **428901**, set in **Vercel as Non-sensitive** (Sensitive breaks client bundle inlining), and in `.env.local`.
2. `NEXT_PUBLIC_META_PIXEL_ID` must match Meta Events Manager.
3. `GA4_MEASUREMENT_ID` must be `G-B1XC1ND9GT` (same as gtag).
4. Do **not** `vercel env pull` into `.env.local` (use `npm run env:pull` only when you intentionally merge).
5. Warehouse OAuth stays in PostHog UI — see [`warehouse-sources-runbook.md`](warehouse-sources-runbook.md).

## Local audit

```bash
npm run analytics:env-audit
npm run posthog:verify
```

## 2026-08-03 restore notes

- Local `NEXT_PUBLIC_POSTHOG_KEY` was empty; restored from PostHog project API token.
- Vercel had `NEXT_PUBLIC_POSTHOG_KEY` marked **Sensitive** (and/or stale) — rebuilt as **Non-sensitive** with correct `phc_…`.
- `POSTHOG_API_KEY` in local had surrounding quotes → unquoted; mirrored to `POSTHOG_PERSONAL_API_KEY` for scripts.
- Session replay + heatmaps opt-in confirmed on project; client `enable_heatmaps: true`.
