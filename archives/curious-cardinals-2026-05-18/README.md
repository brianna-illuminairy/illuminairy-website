# Curious Cardinals — Full Site Archive

**Archived:** 2026-05-18  
**Purpose:** Private reference copy of curiouscardinals.com before their business model pivot.

## What's included

| Folder | Source | Description |
|--------|--------|-------------|
| `marketing/` | curiouscardinals.com (Webflow) | Main marketing site: homepage, offerings, case studies, mentor profiles, past projects, legal pages |
| `blog/` | blog.curiouscardinals.com (HubSpot) | All published blog posts and their images |
| `app-mentors/` | app.curiouscardinals.com/mentors/* (Next.js) | Public mentor profile pages with embedded JSON data |

## How to browse locally

Static file serving works best (file:// breaks asset paths). Use any static server:

```bash
npx --yes serve marketing -p 4321
npx --yes serve blog -p 4322
npx --yes serve app-mentors -p 4323
```

Then open `index.html` in this folder for quick links.

## Limitations

- **Not captured:** logged-in app pages (/dashboard), dynamic checkout, Calendly widgets, analytics scripts, live search
- **Interactive elements** (forms, modals, JS-driven carousels) may not function offline
- **Third-party embeds** (YouTube, Calendly, GTM) are not mirrored
- Next.js app pages contain full mentor data in `__NEXT_DATA__` JSON even if React hydration doesn't run

## Re-running the mirror

Scripts are in `scripts/`. Run in order:

```bash
bash scripts/extract-sitemap-urls.sh
bash scripts/mirror-marketing.sh
bash scripts/mirror-blog.sh
bash scripts/mirror-app.sh
bash scripts/verify-archive.sh
```

## Legal

This archive is for private reference only. Do not republish or redistribute.
