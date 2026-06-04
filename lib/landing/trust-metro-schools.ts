import {
  affluentPublicHighSchoolsByMetro,
  affluentZipClusters
} from "@/lib/landing/trust-affluent-zips";

/**
 * LP trust regions — built from $150k+ median-income ZIP clusters and their public high schools.
 */

export type TrustMetroRegion = {
  id: string;
  label: string;
  featured: readonly string[];
  marquee: readonly string[];
};

const METRO_LABELS: Record<string, string> = {
  atlanta: "Atlanta",
  dallas: "Dallas–Fort Worth",
  houston: "Houston",
  miami: "Miami–Fort Lauderdale",
  charlotte: "Charlotte",
  phoenix: "Phoenix / Scottsdale",
  dc: "DC / Northern Virginia",
  nashville: "Nashville",
  boston: "Boston suburbs",
  nj: "New Jersey / NYC suburbs"
};

const METRO_ORDER = [
  "atlanta",
  "dallas",
  "houston",
  "miami",
  "charlotte",
  "phoenix",
  "dc",
  "nashville",
  "boston",
  "nj"
] as const;

function buildMetroRegion(metroId: (typeof METRO_ORDER)[number]): TrustMetroRegion {
  const schools = affluentPublicHighSchoolsByMetro(metroId);
  const featured = schools.slice(0, 5);
  const marquee = schools.slice(5);
  return {
    id: metroId,
    label: METRO_LABELS[metroId] ?? metroId,
    featured,
    marquee
  };
}

export const landingTrustMetroRegions: TrustMetroRegion[] = METRO_ORDER.map(buildMetroRegion);

export const landingTrustSchoolsBar = {
  titleNational: "Families from public high schools parents recognize nationwide",
  titleGeo: "Families from public high schools in your area",
  title: `Families from public high schools in $150k+ median-income suburbs`,
  scoresTitle: "Recent SAT movement"
} as const;

export function allTrustMetroMarqueeSchools(): string[] {
  const out: string[] = [];
  for (const region of landingTrustMetroRegions) {
    for (const school of region.marquee) {
      out.push(school);
    }
  }
  return out;
}

/** For ads / analytics — count of income-qualified ZIPs in repo. */
export const affluentZipClusterCount = affluentZipClusters.length;
