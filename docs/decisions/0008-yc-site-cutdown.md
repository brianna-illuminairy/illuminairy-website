# ADR-0008: YC site cutdown (single-page launch)

- **Status:** accepted
- **Date:** 2026-05-19
- **Deciders:** Product (Brianna), engineering

## Context

Illuminairy is repositioning for a **platform / YC** narrative (AI mentorship for professionals). The existing site carried SAT Accelerator, parent funnels, guides, blog, enroll, and admin — visually aligned with a May 2026 “premium parent-ed” workshop (ivory, gold, West Elm). That conflicts with the desired **startup** aesthetic and distracts YC reviewers.

## Decision

On `main`, ship a **YC-only public site**:

- Single marketing route: `/` (homepage + waitlist)
- Remove other public App Router pages (SAT, funnels, blog, programs, contact, admin UI, etc.)
- New visual system v2 (dark-capable, indigo accent) documented in `docs/visual-identity.md` and `docs/research/yc-blog-startup-branding-2026-05.md`
- SAT and funnel code remain recoverable from git history / branches; not deleted from repository archives if already branched

## Consequences

### Positive

- One clear story for investors and waitlist signups
- Faster iteration on brand without SAT copy guardrails on homepage
- Smaller build surface and sitemap

### Negative / tradeoffs

- SAT families must use a restored route or separate deploy until SAT pages return
- APIs (Stripe, admin, CRM) may remain in repo but are unreachable from public nav
- SEO for `/sat-accelerator` etc. drops until routes return

## Alternatives considered

1. **Keep all routes, rebrand CSS only** — rejected; too much Ivy/SAT chrome remains
2. **Feature flag hide routes** — rejected; YC cut wants explicit simplicity
3. **Separate domain for YC** — rejected for now; same domain, cut routes

## References

- [specs/2026-05-yc-rebrand/SPEC.md](../../specs/2026-05-yc-rebrand/SPEC.md)
- [docs/research/yc-blog-startup-branding-2026-05.md](../research/yc-blog-startup-branding-2026-05.md)
