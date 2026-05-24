# Tech context

## Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router) |
| UI | React 18, Tailwind CSS 3, Lucide React |
| Language | TypeScript 5 |
| Hosting | Vercel |
| Email | Resend |
| Payments | Stripe Checkout + webhooks |
| Scheduling | Calendly (embedded) |
| Analytics | PostHog, Google Analytics |
| CRM / attribution | Supabase (`leads`, `clients`, `enrollments`, `touch_events`) |
| Marketing automation | Klaviyo (newsletter, platform waitlist, server events) |

## Key scripts

```bash
npm run dev          # local dev
npm run build        # production build (webpack)
npm run lint         # ESLint
npm run env:sync     # push .env.local → Vercel
npm run env:pull     # pull Vercel → .env.local
npm run deploy:prod  # Vercel production deploy
npm run release      # env:sync + deploy:prod
```

## Environment variables (see `.env.example`)

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_CALENDLY_URL` | Public SAT consultation embed |
| `NEXT_PUBLIC_MENTOR_TYPEFORM_URL` | Mentor application embed on `/apply/mentor` |
| `TYPEFORM_API_TOKEN` | Local only — `npm run typeform:mentor:create` |
| `TUTOR_CALENDLY_URL` | Invite-only mentor interview (server/email only) |
| `RESEND_API_KEY` | Contact form delivery |
| `CONTACT_INBOX` / `RESEND_FROM_EMAIL` | Inbox and from-address |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Client Stripe |
| `STRIPE_SECRET_KEY` | Server Stripe |
| `STRIPE_WEBHOOK_SECRET` | Webhook verification |
| `STRIPE_PRICE_ID` | Enrollment price |
| `NEXT_PUBLIC_POSTHOG_KEY` | Product analytics |
| `NEXT_PUBLIC_KLAVIYO_PUBLIC_API_KEY` | Newsletter + waitlist (client) |
| `NEXT_PUBLIC_KLAVIYO_LIST_ID` | Default newsletter list |
| `NEXT_PUBLIC_KLAVIYO_LIST_ID_PLATFORM_WAITLIST` | Homepage platform waitlist list |
| `KLAVIYO_PRIVATE_API_KEY` | Server events + profiles |
| `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` | CRM writes (server only) |
| `ADMIN_SECRET` | `/admin` dashboard |
| `CALENDLY_WEBHOOK_SIGNING_KEY` | Calendly → lead `call_booked` |

Stripe bootstrap: `node --env-file=.env.local scripts/setup-stripe.mjs` (with `STRIPE_TUITION_CENTS`).

## Repos & paths

- Workspace folder may be `illuminairy` or `Illuminairy` on disk; git remote is the source of truth.
- `archives/` — competitor research notes + README; **658 MB CC mirror** on branch `archive/curious-cardinals-2026-05-18` only (gitignored on `main`). Intel doc: `docs/competitor-intel-curious-cardinals.md`. Blog re-scrape: `npm run cc:analyze-blog`.

## Integrations map

```
Browser → AttributionProvider (visitor_id) → POST /api/attribution/touch → touch_events
        → POST /api/intake → Supabase leads + touch_events → Klaviyo + Resend
        → POST /api/contact → Resend
        → POST /api/checkout → Stripe (+ touch_events, Klaviyo)
Calendly → POST /api/webhooks/calendly → leads + touch_events + Klaviyo
Stripe  → POST /api/webhooks/stripe → clients / enrollments + Klaviyo + Resend
Admin   → /admin (ADMIN_SECRET) → Supabase read/write
```

## DNS & domain

- Production URL: `https://illuminairy.com`
- `metadataBase` and sitemap use `site.url` from `lib/site.ts`
