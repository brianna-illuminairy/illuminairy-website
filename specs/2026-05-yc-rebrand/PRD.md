# PRD: YC startup site rebrand

- **Date:** 2026-05-19
- **Owner:** Brianna

## Problem

The live homepage reads Ivy League / parent-ed (ivory, gold, editorial type, SAT-era chrome). Illuminairy is pitching as an AI mentorship platform for professionals; the site must feel like a **YC-stage startup**, not a tutoring brand.

## User

- Ambitious professionals / business owners (waitlist)
- YC partners / investors skimming the site
- Near-peer mentors (footer apply link)

## Success metrics

- Homepage communicates outcome + waitlist in <10s
- `platform_waitlist_submitted` fires on successful signup
- `npm run agent:verify` passes with YC-only routes

## Non-goals

- Restore SAT/funnel pages on this cut (recoverable from git)
- New logo illustration production
- Full legal policy rewrite
- Admin / Stripe / CRM on public site

## Requirements

1. Dual theme (system + manual toggle)
2. Design tokens v2 (indigo accent, dark-capable)
3. Delete all marketing routes except `/`
4. Rebuild homepage per research doc hierarchy
5. Minimal header/footer chrome

## Research

[docs/research/yc-blog-startup-branding-2026-05.md](../../docs/research/yc-blog-startup-branding-2026-05.md)
