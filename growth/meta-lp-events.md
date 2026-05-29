# Meta LP events — campaign optimization

## Events on `/` (pixel only)

| Event | When | Params |
|---|---|---|
| `PageView` | Route load | (existing MetaPixel) |
| `ViewContent` | LP mount, variant known | `content_name: sat_landing`, `content_category: sat_lp_variant` |
| `FunnelCTA` (custom) | Any LP CTA → `/quiz` | `section_id`, `sat_lp_variant`, `cta_label` |

**Do not** fire `Lead` or `Schedule` on the LP — those stay at S5/S9 only.

## Events Manager setup (post-deploy)

1. Register custom event **`FunnelCTA`** from Test Events after first CTA click
2. **AEM priority (iOS):** `Lead` → `Schedule` → `FunnelCTA` → `ViewContent` → `PageView`
3. Optional custom conversions per variant: `FunnelCTA` where `content_category` = `b3b-results`

## Campaign ladder (prospecting)

1. **Launch (weeks 1–2):** Optimize for **`FunnelCTA`**
2. **Do not** optimize prospecting for `ViewContent` — use for retargeting audiences only
3. **Graduate to `Lead`:** ~50+ Lead events/week/ad set (pixel + CAPI deduped)
4. **Retargeting:** Optimize for **`Schedule`** on warm `FunnelCTA` audiences

## CAPI (Safari-critical)

- **Lead / Schedule:** pixel + server CAPI with shared `event_id`
- S5 submit passes **`_fbp`** and **`_fbc`** from browser cookies to `/api/funnel/lead`
- LP events stay browser-only; CAPI pairing on Lead/Schedule matters most for optimization

## satprep.illuminairy.com

- **Keep subdomain separate** for now — no 301 in this pass
- **All new Meta/Google ads** → `https://illuminairy.com/` with UTMs
- Do not point new campaigns at satprep unless intentionally testing legacy funnel

## UTM convention

- `utm_campaign=sat-lp-b3a-problem` | `sat-lp-b3b-results` | `sat-lp-b3c-authority`
- `utm_source=facebook` | `google`
- `utm_content` = creative slug
