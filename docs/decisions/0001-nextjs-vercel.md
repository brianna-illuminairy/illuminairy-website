# ADR-0001: Next.js on Vercel

- **Status:** accepted
- **Date:** 2026-05-18
- **Deciders:** Brianna

## Context

Illuminairy needed a fast, SEO-friendly marketing site with server-side API routes (contact email, Stripe checkout, webhooks) and simple production deploys. The domain `illuminairy.com` already existed with external DNS.

## Decision

Use **Next.js 16 (App Router)** with **TypeScript** and host on **Vercel**. Production traffic for `illuminairy.com` is served from Vercel after DNS is pointed from the prior registrar (Squarespace).

## Consequences

### Positive

- App Router + API routes in one repo
- Preview deployments and env management via Vercel CLI (`npm run env:sync`, `deploy:prod`)
- Good defaults for metadata, sitemap, and static optimization

### Negative / tradeoffs

- Build uses `--webpack` flag (explicit in package.json)—team should verify after Next upgrades
- Vendor coupling to Vercel for hosting and env workflow

## Alternatives considered

1. **Squarespace-only** — insufficient for custom enroll flow, webhooks, and typed program config
2. **Separate API service** — unnecessary complexity for current scale

## References

- [`package.json`](../../package.json)
- [`README.md`](../../README.md) — Deployment section
