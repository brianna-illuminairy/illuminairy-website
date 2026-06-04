# LP geo personalization — infer metro, prefer nearby schools

**Goal:** On `/`, show the visitor’s **nearest trust-metro block and score cards first** (Milton / Plano / Cinco Ranch, etc.) without asking for location.

---

## Signal priority (use in this order)

| Priority | Source | Accuracy | Effort |
|----------|--------|----------|--------|
| 1 | **`?metro=atlanta`** or **`?hook=`** on ad URL | Exact (you control) | Zero — set in Meta/Google ads |
| 2 | **UTM** (`utm_campaign`, `utm_content`) | Exact if you encode metro | Zero — e.g. `fall_sat_atlanta` |
| 3 | **Vercel geo** (IP at edge) | Metro-level ~70–85% | Low — middleware or server `headers()` |
| 4 | **PostHog `$geoip_*`** | Same as IP, after load | Medium — flash of wrong order unless server-first |
| 5 | **Browser Geolocation API** | Precise | High — permission prompt kills cold DR |

**Recommendation:** Ads pass `?metro=` when possible; **Vercel geo fills gaps** on organic/direct.

Do **not** rely on client-only IP APIs for first paint (extra request, wrong order on load).

---

## What to build (4 pieces)

### 1. Metro inference (`lib/landing/infer-visitor-metro.ts`)

Map **country + region (state) + city** → one of:

`atlanta | dallas | houston | miami | charlotte | phoenix | dc | nashville | boston | nj`

- US only for v1; non-US → `null` (national default order).
- Texas: city list splits **Dallas–Fort Worth** vs **Houston** (Plano/Frisco → `dallas`, Katy/Woodlands → `houston`).
- Florida: Miami-Dade / Broward → `miami`; rest of FL optional later.

### 2. Server read on homepage (`app/page.tsx`)

On Vercel, read:

- `x-vercel-ip-country-region` (e.g. `GA`)
- `x-vercel-ip-city` (e.g. `Atlanta`)

Or `@vercel/functions` `geolocation(request)` in **middleware**.

Pass `preferredMetroId` into `<LandingPage />` as a prop (requires splitting server wrapper + client child).

### 3. Persist for session (optional cookie)

`middleware.ts` sets `il_preferred_metro=atlanta` (httpOnly, 7d) when:

- Query `metro` present, or
- Geo inference succeeds

Quiz + LP stay consistent on return visits.

### 4. Reorder trust UI (no new data)

| Surface | Personalization |
|---------|-----------------|
| Metro grid | Preferred metro **first** (full width or highlighted) |
| School pills | That metro’s 5 featured schools unchanged, just order |
| Score ticker | Stories whose `highSchool` maps to that metro **first** |
| Hero `?hook=` | Auto-set hook from metro (`atlanta` → `gpa` / default Atlanta headline) |

**Do not** claim “we found your school” — same copy, different **order** only.

---

## Vercel implementation sketch

```ts
// middleware.ts
import { geolocation } from "@vercel/functions";
import { inferMetroFromGeo } from "@/lib/landing/infer-visitor-metro";

export function middleware(request: NextRequest) {
  const metroParam = request.nextUrl.searchParams.get("metro");
  const geo = geolocation(request);
  const inferred = inferMetroFromGeo({
    country: geo.country,
    region: geo.region,
    city: geo.city
  });
  const preferred = normalizeMetroParam(metroParam) ?? inferred;
  // set header or cookie for page.tsx to read
}
```

```tsx
// app/page.tsx (server component)
const preferredMetro = await getPreferredMetro(); // cookie or header
return <LandingPage preferredMetroId={preferredMetro} />;
```

```tsx
// landing-page.tsx — after PostHog ready, still use server prop for initial sort
<B3Page preferredMetroId={preferredMetroId} ... />
```

---

## School ↔ metro map

Derive from `lib/landing/trust-affluent-zips.ts` (`metroId` per ZIP cluster) + featured HS names.

Helper: `highSchoolToMetroId("Milton High School") → "atlanta"`.

---

## Analytics

On `funnel_landing_view`, send:

- `inferred_metro` (from geo)
- `preferred_metro` (after query override)
- `metro_source`: `query | utm | geo | default`

Compare CTR to `/plan` by `metro_source` in PostHog.

---

## Limits (set expectations)

- **VPN / corporate IP** → wrong state (common).
- **Cellular** → sometimes wrong city.
- **Parents clicking ads while traveling** → prefer **UTM/metro param** from ad set geo.
- **Suburban IP in adjacent city** → still OK if same metro (Alpharetta IP vs Milton school).

---

## Rollout

1. Ship inference lib + sort helpers (no UI).
2. Add `?metro=` to Icon/Meta links (immediate win).
3. Middleware + cookie + server prop.
4. Reorder trust bar + optional “Near you” label on first metro block.
5. A/B: personalized order vs national order (`sat-lp-geo-personalization` flag).

---

## Ads alignment

| Ad set geo | URL param |
|------------|-----------|
| Atlanta suburbs | `?metro=atlanta&hook=gpa` |
| Dallas | `?metro=dallas` |
| Houston | `?metro=houston` |
| Miami | `?metro=miami` |

Geo inference is the **fallback** when the ad platform already narrowed geography but the URL has no param.
