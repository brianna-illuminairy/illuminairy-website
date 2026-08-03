# PostHog data warehouse sources (ads measurement)

Credentials for warehouse syncs live in **PostHog → Data pipelines → Sources** (not in `.env.local` / Vercel).

Project: **Default project** `428901`.

## Status (2026-08-03)

| Source | Status | Action needed |
|--------|--------|---------------|
| **Meta Ads** | Token invalid / expired (last success ~Jun 12) | Re-authorize Meta OAuth in PostHog; account `1020098850691864`; enable `campaign_stats`, `adset_stats`, `ad_stats`; sync |
| **Stripe** | Misconfigured (Connect platform error) | Delete/recreate Stripe source with **Illuminairy Stripe account** OAuth or restricted API key for *this* account (not Connect platform credentials) |
| **Google Ads** | Not linked | Link source → client customer ID (not MCC-only) → OAuth with Ads admin Google account |
| **Google Analytics** | Not linked | Link GA4 property for `G-B1XC1ND9GT` (Admin → Property settings → numeric Property ID) |

## Owner steps (UI)

1. Open [PostHog Data pipelines → Sources](https://us.posthog.com/project/428901/data-warehouse/sources).
2. **Meta Ads:** Edit → Re-authorize → pick active ad account → save → Reload.
3. **Stripe:** Remove broken source → New → Stripe → connect Illuminairy Stripe (prefer webhook sync) → enable charge/customer tables → sync.
4. **Google Ads:** New → Google Ads → OAuth → enter **client** customer ID → sync campaign/ad stats.
5. **Google Analytics:** New → Google Analytics → OAuth → paste GA4 **Property ID** for the property that owns `G-B1XC1ND9GT`.
6. Confirm each row shows a recent **Last successful run** and non-zero rows where expected.

## Not needed in Next.js env

- Google Ads API developer token
- GA Data API client
- GTM / “Google Tags” API

Site already sends browser GA4 via gtag (`G-B1XC1ND9GT`). Ads conversions use GA4 import (`schedule`, `lab_lesson_booked`).
