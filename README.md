# Illuminairy

Custom Next.js website for Illuminairy.

## Local development

```bash
npm install
npm run dev
```

## Optional links

Add these to `.env.local` when the live booking and inquiry tools are ready:

```bash
NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/...
NEXT_PUBLIC_TYPEFORM_URL=https://form.typeform.com/to/...
```

If those values are not set, consultation and inquiry CTAs fall back to
`mailto:brianna@illuminairy.com`.

## Deployment

Deploy the project on Vercel, then point the Squarespace-managed DNS for
`illuminairy.com` to Vercel.
