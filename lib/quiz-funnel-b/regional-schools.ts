import {
  PLAN_B_REGIONAL_DISCOUNT_PCT,
  planBPartnerCouponId,
  planBRecommendedPackage,
} from "@/lib/plan-b/membership-pricing";
import {
  buildRegionalMarket,
  buildRegionalMarketFromRegionId,
} from "@/lib/plan-b/build-regional-market";
import { getCatalogSchool } from "@/lib/plan-b/school-catalog";
import { zipToStateCode } from "@/lib/plan-b/zip-to-state";
import {
  stateSlugFromCode,
  type UsStateCode,
} from "@/lib/plan-b/us-states";

export type RegionalSchoolOption = {
  id: string;
  name: string;
  inState: boolean;
};

export type RegionalMarket = {
  id: string;
  label: string;
  schools: RegionalSchoolOption[];
};

function toRegionalMarket(built: ReturnType<typeof buildRegionalMarket>): RegionalMarket {
  return {
    id: built.id,
    label: built.label,
    schools: built.schools,
  };
}

function fallbackMarket(): RegionalMarket {
  const built = buildRegionalMarket("NY");
  return {
    id: "unknown",
    label: "your area",
    schools: built.schools,
  };
}

export function regionIdFromZip(zip: string): string {
  const code = zipToStateCode(zip);
  if (!code) return "unknown";
  return stateSlugFromCode(code);
}

export function regionalMarketForState(stateCode: UsStateCode): RegionalMarket {
  return toRegionalMarket(buildRegionalMarket(stateCode));
}

export function regionalMarketForZip(zip: string): RegionalMarket {
  const code = zipToStateCode(zip);
  if (!code) return fallbackMarket();
  return regionalMarketForState(code);
}

export function regionalUnlockOffer(regionId: string, q5?: string | null) {
  const slug = normalizeLegacyRegionId(regionId);
  const built = buildRegionalMarketFromRegionId(slug);
  const pkg = planBRecommendedPackage(q5);

  return {
    regionId: built?.id ?? (slug === "unknown" ? "unknown" : slug),
    regionLabel: built?.label ?? (slug === "unknown" ? "your area" : slug),
    discountPct: PLAN_B_REGIONAL_DISCOUNT_PCT,
    discountCode: planBPartnerCouponId(pkg),
  };
}

export function schoolNamesFromIds(_regionId: string, ids: string[]): string[] {
  return ids
    .map((id) => getCatalogSchool(id)?.name)
    .filter((n): n is string => Boolean(n));
}

export function regionLabelFromId(regionId: string): string {
  const built = buildRegionalMarketFromRegionId(normalizeLegacyRegionId(regionId));
  if (built) return built.label;
  if (regionId === "unknown") return "your area";
  return regionId;
}

/** @deprecated Legacy slug — maps old CRM values to state slugs. */
export function normalizeLegacyRegionId(regionId: string): string {
  const legacy: Record<string, string> = {
    "dc-metro": "dc",
    georgia: "georgia",
    texas: "texas",
    florida: "florida",
    "north-carolina": "north-carolina",
    national: "unknown",
  };
  return legacy[regionId] ?? regionId;
}

export const TARGET_SCHOOL_OTHER_ID = "other" as const;
