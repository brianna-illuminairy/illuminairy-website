# Spec: YC startup site rebrand

- **PRD:** [PRD.md](./PRD.md)
- **Date:** 2026-05-19

## Summary

Replace the Ivy/West Elm marketing site with a **single-page YC launch**: dual-theme design system, minimal chrome, platform homepage only. Remove SAT, funnel, blog, enroll, admin, and other public routes from the App Router.

## Acceptance criteria

- [x] `docs/research/yc-blog-startup-branding-2026-05.md` + ADR 0008 + `docs/visual-identity.md` v2 section exist
- [x] `next-themes` with system default + toggle in header/footer
- [x] Semantic Tailwind/CSS tokens work in light and dark
- [x] Only `/` in sitemap; no SAT links in header/footer
- [x] Homepage matches research hierarchy; no `PopSection` / credential pills
- [x] `npm run agent:verify` passes

## Files / areas touched

- `app/page.tsx`, `app/layout.tsx`, `app/globals.css`, `app/sitemap.ts`
- `components/header.tsx`, `components/footer.tsx`, `components/layout-chrome.tsx`
- `components/theme-*.tsx`, `components/yc-*.tsx`, `components/waitlist-signup.tsx`
- `tailwind.config.ts`, `lib/site.ts`
- Delete most `app/**` route folders

## Env vars

| Variable | Required | Notes |
|----------|----------|-------|
| `NEXT_PUBLIC_KLAVIYO_PUBLIC_API_KEY` | For waitlist | Client subscribe |
| `NEXT_PUBLIC_KLAVIYO_LIST_ID_PLATFORM_WAITLIST` | Optional | Dedicated list |

## QA checklist

- [ ] `npm run agent:verify`
- [ ] Manual: `/` light + dark + system; waitlist submit; mobile layout

## Ralph / PLAN

[specs/ralph/PLAN-yc-rebrand.md](../ralph/PLAN-yc-rebrand.md)
