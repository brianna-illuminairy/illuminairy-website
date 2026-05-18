# Spec: Contact form hardening (example only)

**This folder is a format reference, not active work.**

## Summary

Example spec showing acceptance criteria shape for a fictional spam-handling improvement.

## Acceptance criteria

- [ ] Honeypot field rejects bots without affecting humans
- [ ] API returns 400 with safe message on invalid email
- [ ] `npm run agent:verify` passes
- [ ] No change to `RESEND_FROM_EMAIL` behavior when configured

## Files / areas likely touched

- `app/api/contact/route.ts`
- `app/contact/page.tsx`

## QA checklist

- [ ] Submit valid form locally with Resend configured
- [ ] Submit with honeypot filled — expect rejection
