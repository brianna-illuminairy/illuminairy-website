# Illuminairy

Custom Next.js website for Illuminairy.

## Local development

```bash
npm install
npm run dev
```

## Environment variables

Copy `.env.example` to `.env.local`.

**Vercel (one command):** after editing `.env.local`, push secrets to production, preview, and development:

```bash
npm run env:sync
npm run deploy:prod
```

Pull from Vercel into `.env.local` on a new machine: `npm run env:pull` (requires `vercel link` once).

**Contact form** (recommended): create a free [Resend](https://resend.com) account, add your API key, and verify `illuminairy.com` so messages send from your domain to `support@illuminairy.com`:

```bash
RESEND_API_KEY=re_...
CONTACT_INBOX=support@illuminairy.com
RESEND_FROM_EMAIL=Illuminairy <notifications@illuminairy.com>
```

Until `RESEND_API_KEY` is set, the form on `/contact` shows an error and visitors can still email `support@illuminairy.com` directly.

**Public SAT consultation** (embedded on `/contact#schedule` and `/sat-accelerator#schedule`):

```bash
NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/brianna-illuminairy/august-sat
```

**Invite-only mentor interview** (never on the public site — email this link after you review an application):

```bash
TUTOR_CALENDLY_URL=https://calendly.com/brianna-illuminairy/tutor-call
```

See `lib/internal-links.ts`. Mentor applicants use `/contact?reason=mentor`; you send `tutor-call` manually when they pass vetting.

If Calendly is not set, consultation CTAs fall back to `mailto:support@illuminairy.com`.

**Stripe enrollment** (post-consultation checkout on `/enroll`):

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID=price_...
```

**Automated setup (recommended):** add `STRIPE_SECRET_KEY` and `STRIPE_TUITION_CENTS` (tuition in USD cents) to `.env.local`, then run:

```bash
node --env-file=.env.local scripts/setup-stripe.mjs
```

The script creates the Product, Price, and production webhook; copy the printed `STRIPE_PRICE_ID` and `STRIPE_WEBHOOK_SECRET` into `.env.local` and Vercel.

Or create Product/Price in Dashboard → Products and register webhook `https://illuminairy.com/api/webhooks/stripe` for `checkout.session.completed`. For local testing, install [Stripe CLI](https://stripe.com/docs/stripe-cli) and run `stripe listen --forward-to localhost:3000/api/webhooks/stripe`.

## Deployment

Deploy the project on Vercel, then point the Squarespace-managed DNS for
`illuminairy.com` to Vercel.
