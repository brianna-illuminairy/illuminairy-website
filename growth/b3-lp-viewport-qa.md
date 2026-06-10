# B3 landing page — viewport & performance QA

Run **before ad spend** and again **after every LP layout/CSS change**. Pair with [ad-message-match-qa.md](./ad-message-match-qa.md) and [prod-deploy-checklist.md](./prod-deploy-checklist.md).

**Local:** `npm run dev` → base URL `http://localhost:3000`  
**Prod smoke:** `https://illuminairy.com/`

---

## 1. Variant URLs (all three heroes)

| Variant | URL |
|---------|-----|
| B3a | `/?lp=b3a` |
| B3b | `/?lp=b3b` |
| B3c | `/?lp=b3c` |

Optional with UTMs (message-match): see [ad-message-match-qa.md](./ad-message-match-qa.md).

### Layout experiment (`sat-lp-layout`)

| Layout | URL |
|--------|-----|
| Full (control) | `/?lp_layout=full` or default |
| Compact | `/?lp_layout=compact` |
| Compact + b3b stats | `/?lp=b3b&lp_layout=compact` |

Compact-specific checks (mobile ≤1023px):

- [ ] Sticky CTA appears after scrolling past hero; **≥48px** tap height; does not cover footer links
- [ ] No great-news / included / reviews carousel sections
- [ ] 2-step how-it-works list (not 4-column grid)
- [ ] b3b compact shows **stat row**; b3a/b3c show **single review** card

---

## 2. Viewport matrix

Our layout breakpoint: **desktop ≥ 1024px** (premium grid). Below that = stacked mobile layout.

### A. Chrome DevTools (required)

1. Open each variant URL.
2. **Hard refresh** (`Cmd+Shift+R`) — bypass cache.
3. Run each width below; full scroll top → footer on every cell.

| Profile | Width | What to verify |
|---------|-------|----------------|
| iPhone SE | 375 × 667 | No horizontal scroll; CTAs full-width, ≥48px tap height; hero stacks (copy → CTA → photos); review carousel swipes |
| iPhone 14 Pro | 390 × 844 | Same + safe-area / notch not clipping header |
| iPad portrait | 768 × 1024 | **Not** a skinny centered “phone column”; content uses full width; still stacked hero (below 1024) |
| iPad landscape | 1024 × 768 | Desktop grid kicks in: hero 2-col, reviews 3-up, steps 4-across |
| Laptop | 1280 × 800 | Content capped ~1120px inside sections; navy hero full-bleed; no floating card-in-gray-box |
| Desktop | 1440 × 900 | Same as laptop; photos not absurdly tall; text readable at arm’s length |

### B. Real device (recommended before prod)

- [ ] **iPhone Safari** — B3a, B3b, B3c (one URL each; PostHog flag may override `?lp=` if key is set — use override or disable flag in dev)
- [ ] **Desktop Chrome** — same three URLs at full window width

### C. Visual regression (per variant)

- [ ] Hero: dual photos (B3a/B3b) or data + session (B3c); **no** repeated score-report on every block
- [ ] Placeholders show **filename label**, not recycled tutor/team images in wrong slots ([b3-lp-photo-shot-list.md](./b3-lp-photo-shot-list.md))
- [ ] “How it works”: **01–04 badges** when step photos missing; desktop = 4 columns
- [ ] Reviews: mobile = horizontal scroll; desktop = **3 cards**, no scroll trap
- [ ] Footer legal links work; College Board disclaimer visible
- [ ] Hero CTA + inline CTAs → `/plan?step=q1` (UTMs preserved)

### D. Copy spot-check (no fixed timeline)

- [ ] No **“12-week”** / **“12 weeks”** in LP body or heroes
- [ ] No **“until test day”** as *program length* (exam-day pacing copy elsewhere is OK)
- [ ] Says **personalized weekly plan** (or equivalent), not fixed duration

---

## 3. Speed & Core Web Vitals

Test **each variant** on **mobile + desktop** profiles (Lighthouse uses simulated throttling).

### A. Lighthouse CLI (local)

```bash
cd /path/to/Illuminairy
npm run build && npm run start
# In another terminal — mobile
npx lighthouse "http://localhost:3000/?lp=b3a" \
  --only-categories=performance,accessibility,best-practices,seo \
  --preset=perf --form-factor=mobile --output=html --output-path=./tmp/lh-b3a-mobile.html

# Desktop
npx lighthouse "http://localhost:3000/?lp=b3a" \
  --only-categories=performance,accessibility,best-practices,seo \
  --preset=perf --form-factor=desktop --screenEmulation.disabled \
  --output=html --output-path=./tmp/lh-b3a-desktop.html
```

Repeat for `b3b` and `b3c`. Open HTML reports in browser.

**Targets (guidance, not CI gates yet):**

| Metric | Mobile target | Desktop target |
|--------|---------------|----------------|
| Performance score | ≥ 85 | ≥ 90 |
| LCP | ≤ 2.5s | ≤ 2.0s |
| CLS | ≤ 0.1 | ≤ 0.1 |
| TBT | ≤ 300ms | ≤ 150ms |

### B. PageSpeed Insights (prod or preview)

After deploy, run [PageSpeed Insights](https://pagespeed.web.dev/) on:

- `https://illuminairy.com/?lp=b3a`
- `https://illuminairy.com/?lp=b3b`
- `https://illuminairy.com/?lp=b3c`

Record mobile + desktop scores in PR or experiment log.

### C. Quick network sanity (local)

```bash
# TTFB + download (repeat 3x, eyeball consistency)
curl -o /dev/null -s -w "TTFB: %{time_starttransfer}s  Total: %{time_total}s\n" \
  "http://localhost:3000/?lp=b3a"
```

- [ ] No single asset > 500KB on initial load (check Network tab: hero images use `priority`, rest lazy)
- [ ] Fonts: only Schibsted + DM Mono loaded for LP (no duplicate font families)

### D. PostHog / third-party impact

With ad blockers **off**:

- [ ] LP still interactive if PostHog key missing (defaults to B3a, no infinite skeleton)
- [ ] Flag timeout ≤ 2s — page does not hang on skeleton

---

## 4. Accessibility (quick pass)

- [ ] Tab through: header → hero CTA → section CTAs → footer links — visible focus
- [ ] Review carousel: `role="region"` + `aria-label` present
- [ ] `prefers-reduced-motion: reduce` — no carousel scroll-snap jank (CSS should disable smooth scroll)
- [ ] Lighthouse accessibility ≥ 90 on one variant (mobile)

---

## 5. Analytics smoke (one variant enough)

On `/?lp=b3b&utm_campaign=sat-lp-b3b-results&utm_source=facebook`:

- [ ] PostHog: `funnel_landing_view` + `experiment_exposure` with `sat_lp_variant`
- [ ] GA4 / Meta: `ViewContent` on load (see [meta-lp-events.md](./meta-lp-events.md))
- [ ] Click hero CTA → `funnel_cta_click` → lands on `/plan?step=q1-parent-child`
- [ ] `sat_lp_variant` in localStorage after first view

---

## 6. Sign-off checklist

Copy this block into PR / deploy notes:

```
LP viewport QA — date: ______  env: local / preview / prod

Variants scrolled (all sections):
[ ] b3a  [ ] b3b  [ ] b3c

Viewports:
[ ] 375 mobile   [ ] 768 tablet   [ ] 1280+ desktop

Speed (b3a minimum):
[ ] Lighthouse mobile perf ≥ 85   LCP: ___
[ ] Lighthouse desktop perf ≥ 90  LCP: ___
[ ] PSI prod (if deployed): mobile ___ / desktop ___

Visual:
[ ] No duplicate photos / huge recycled assets
[ ] No 12-week / fixed-duration program copy
[ ] CTAs → quiz

Analytics:
[ ] ViewContent + CTA click verified
```

---

## 7. When to re-run

- Any change to `app/landing/*.css`, `components/landing/b3/**`, or `public/photos/**`
- New hero images (re-check LCP and CLS)
- PostHog flag rollout or new variant
- Before merging LP work to `main` / production promote
