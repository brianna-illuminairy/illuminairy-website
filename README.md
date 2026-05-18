# Illuminairy

Custom Next.js website for Illuminairy.

## Local development

```bash
npm install
npm run dev
```

## Environment variables

Copy `.env.example` to `.env.local`.

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

## Deployment

Deploy the project on Vercel, then point the Squarespace-managed DNS for
`illuminairy.com` to Vercel.
