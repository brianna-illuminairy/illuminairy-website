# Meta LP events — campaign optimization

## Event ladder (funnel → Meta)

| Step | PostHog / touch | Meta pixel | Use for ads |
|------|-----------------|------------|-------------|
| LP load | `funnel_landing_view` | `ViewContent` | Baseline only |
| LP CTA → `/plan` | `funnel_cta_click` | **`FunnelCTA`** | Diagnostic / engagement |
| Plan opens (`q1-parent-child`) | `quiz_started` | — | Funnel quality |
| **“My child” on `q1-parent-child`** | **`parent_confirmed`** | **`ParentConfirmed`** | **Phase 1 cold optimization** |
| S5 contact form | `quiz_lead_submitted` | **`Lead`** (+ CAPI) | **Phase 2 scale** |
| Calendly book | `call_booked` | **`Schedule`** (+ CAPI) | Retarget / late funnel |

**Do not** fire `Lead` or `Schedule` on the LP. **`ParentConfirmed`** fires only when `qWho === child` — not on CTA, not when the student picks **Me**.

## Phase 1 — validate ads + landing pages (cold)

1. **Campaign objective:** **Sales** (not Leads — custom events are blocked on Leads ad sets).
2. **Conversion event:** **`ParentConfirmed`** (register in Events Manager after first fire).
3. **Same ad URLs, UTMs, creatives** as today.
4. **Pick winners** on cost per ParentConfirmed + **parent_confirmed → lead rate** by `utm_content` (PostHog / `/admin/marketing`).
5. **Pause** old Leads-optimized campaign when the Sales campaign is live.

Rough gates: ~100–200 ParentConfirmed before trusting ad/LP rankings; ~40–60 Leads before Phase 2 Lead optimization.

## Phase 2 — scale winners

1. New campaign (Sales or Leads) optimizing **`Lead`**.
2. Only winning ad angles + LPs from Phase 1.
3. Retarget warm audiences with **`Schedule`** where volume allows.

## Events on `/` (pixel only)

| Event | When | Params |
|---|---|---|
| `PageView` | Route load | (existing MetaPixel) |
| `ViewContent` | LP mount, variant known | `content_name: sat_landing`, `content_category: sat_lp_variant` |
| `FunnelCTA` (custom) | Any LP CTA → `/plan?step=q1-parent-child` | `section_id`, `sat_lp_variant`, `sat_lp_layout`, `cta_label` |

## Events on `/plan` (pixel only)

| Event | When | Params |
|---|---|---|
| `ParentConfirmed` (custom) | `q1-parent-child` answer **My child** | `content_name: sat_score_path`, `utm_content`, `sat_lp_layout`, `content_category` (LP variant) |

## Events Manager setup

1. Test Events: LP CTA → see **`FunnelCTA`**; select **My child** → see **`ParentConfirmed`**.
2. **AEM priority (iOS):** `Lead` → `Schedule` → **`ParentConfirmed`** → `FunnelCTA` → `ViewContent` → `PageView`
3. Optional custom conversion wrapping **`ParentConfirmed`** (same event — only if Sales ad set picker needs a named conversion).

## CAPI (Safari-critical)

- **Lead / Schedule:** pixel + server CAPI with shared `event_id`
- S5 submit passes **`_fbp`** and **`_fbc`** from browser cookies to `/api/funnel/lead`
- LP + `q1-parent-child` events stay browser-only; CAPI pairing on Lead/Schedule matters most for optimization

## satprep.illuminairy.com

- **Keep subdomain separate** for now — no 301 in this pass
- **All new Meta/Google ads** → `https://illuminairy.com/sat-plan-builder` with UTMs (see `npm run marketing:ad-urls`)
- **Do not** use `/plan?step=…` as an ad destination — LP first, then CTA into the funnel
- Do not point new campaigns at satprep unless intentionally testing legacy funnel

## UTM convention (Meta primary — national)

- `utm_source=facebook` or `meta`
- `utm_medium=paid_social`
- `utm_campaign=c1_sat_plan_builder_cold_creative_test` (or creative-specific slug)
- **`utm_content=ad3_before_tutoring`** — creative id for reporting
- **`hook=fall`** — optional LP headline override

Full playbook: [`meta-paid-lp-playbook.md`](./meta-paid-lp-playbook.md).
