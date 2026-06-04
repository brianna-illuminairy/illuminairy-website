/**
 * Targeting: U.S. ZCTAs with median household income > $150k (ACS 5-year) and
 * major **public** high schools serving those communities.
 *
 * ZIP boundaries ≠ school attendance zones — schools are the parent-recognizable
 * anchor; ZIPs are for paid social geo targeting and LP relevance.
 *
 * Refresh income thresholds from Census ACS / incomebyzipcode.com periodically.
 */

export type AffluentZipCluster = {
  zip: string;
  area: string;
  metroId: string;
  /** Rounded ACS-style median for internal targeting (USD). */
  medianHouseholdIncome: number;
  publicHighSchools: readonly string[];
};

export const AFFLUENT_ZIP_MIN_MEDIAN_INCOME = 150_000 as const;

export const affluentZipClusters: AffluentZipCluster[] = [
  { zip: "30004", area: "Alpharetta", metroId: "atlanta", medianHouseholdIncome: 156_000, publicHighSchools: ["Alpharetta High School", "Cambridge High School"] },
  { zip: "30022", area: "Johns Creek", metroId: "atlanta", medianHouseholdIncome: 168_000, publicHighSchools: ["Johns Creek High School", "Chattahoochee High School"] },
  { zip: "30075", area: "Roswell", metroId: "atlanta", medianHouseholdIncome: 152_000, publicHighSchools: ["Roswell High School", "Lassiter High School"] },
  { zip: "30076", area: "Milton", metroId: "atlanta", medianHouseholdIncome: 198_000, publicHighSchools: ["Milton High School", "Cambridge High School"] },
  { zip: "30024", area: "Suwanee", metroId: "atlanta", medianHouseholdIncome: 162_000, publicHighSchools: ["Lambert High School", "Northview High School"] },
  { zip: "75205", area: "Highland Park", metroId: "dallas", medianHouseholdIncome: 248_000, publicHighSchools: ["Highland Park High School"] },
  { zip: "75093", area: "Plano", metroId: "dallas", medianHouseholdIncome: 165_000, publicHighSchools: ["Plano West Senior High School", "Plano Senior High School"] },
  { zip: "75034", area: "Frisco", metroId: "dallas", medianHouseholdIncome: 158_000, publicHighSchools: ["Frisco Liberty High School", "Wakeland High School"] },
  { zip: "76092", area: "Southlake", metroId: "dallas", medianHouseholdIncome: 212_000, publicHighSchools: ["Carroll High School"] },
  { zip: "75019", area: "Coppell", metroId: "dallas", medianHouseholdIncome: 154_000, publicHighSchools: ["Coppell High School"] },
  { zip: "77494", area: "Katy", metroId: "houston", medianHouseholdIncome: 172_000, publicHighSchools: ["Cinco Ranch High School", "Seven Lakes High School", "Taylor High School"] },
  { zip: "77024", area: "Memorial", metroId: "houston", medianHouseholdIncome: 198_000, publicHighSchools: ["Memorial High School", "Stratford High School"] },
  { zip: "77380", area: "The Woodlands", metroId: "houston", medianHouseholdIncome: 164_000, publicHighSchools: ["The Woodlands High School"] },
  { zip: "33156", area: "Pinecrest", metroId: "miami", medianHouseholdIncome: 186_000, publicHighSchools: ["Palmetto Senior High School"] },
  { zip: "33146", area: "Coral Gables", metroId: "miami", medianHouseholdIncome: 175_000, publicHighSchools: ["Coral Gables Senior High School"] },
  { zip: "33331", area: "Weston", metroId: "miami", medianHouseholdIncome: 162_000, publicHighSchools: ["Cypress Bay High School", "Western High School"] },
  { zip: "28277", area: "Ballantyne", metroId: "charlotte", medianHouseholdIncome: 168_000, publicHighSchools: ["Ardrey Kell High School", "Providence High School"] },
  { zip: "28105", area: "Matthews", metroId: "charlotte", medianHouseholdIncome: 155_000, publicHighSchools: ["Weddington High School", "Myers Park High School"] },
  { zip: "85255", area: "Scottsdale", metroId: "phoenix", medianHouseholdIncome: 178_000, publicHighSchools: ["Chaparral High School", "Desert Mountain High School"] },
  { zip: "85258", area: "Scottsdale", metroId: "phoenix", medianHouseholdIncome: 161_000, publicHighSchools: ["Chaparral High School", "Corona del Sol High School"] },
  { zip: "22101", area: "McLean", metroId: "dc", medianHouseholdIncome: 207_000, publicHighSchools: ["McLean High School", "Langley High School"] },
  { zip: "22066", area: "Great Falls", metroId: "dc", medianHouseholdIncome: 250_000, publicHighSchools: ["Langley High School", "Oakton High School"] },
  { zip: "20817", area: "Bethesda", metroId: "dc", medianHouseholdIncome: 198_000, publicHighSchools: ["Walt Whitman High School", "Churchill High School"] },
  { zip: "37027", area: "Brentwood", metroId: "nashville", medianHouseholdIncome: 192_000, publicHighSchools: ["Brentwood High School", "Ravenwood High School"] },
  { zip: "37064", area: "Franklin", metroId: "nashville", medianHouseholdIncome: 168_000, publicHighSchools: ["Franklin High School", "Centennial High School"] },
  { zip: "02493", area: "Weston", metroId: "boston", medianHouseholdIncome: 220_000, publicHighSchools: ["Weston High School", "Lincoln-Sudbury Regional High School"] },
  { zip: "02420", area: "Lexington", metroId: "boston", medianHouseholdIncome: 186_000, publicHighSchools: ["Lexington High School", "Acton-Boxborough Regional High School"] },
  { zip: "07078", area: "Westfield", metroId: "nj", medianHouseholdIncome: 198_000, publicHighSchools: ["Westfield High School"] },
  { zip: "08540", area: "Princeton", metroId: "nj", medianHouseholdIncome: 192_000, publicHighSchools: ["Princeton High School"] },
  { zip: "10583", area: "Scarsdale", metroId: "nj", medianHouseholdIncome: 250_000, publicHighSchools: ["Scarsdale High School"] }
];

/** Dedupe public HS names per metro for LP pills (income-filtered set). */
export function affluentPublicHighSchoolsByMetro(metroId: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const cluster of affluentZipClusters) {
    if (cluster.metroId !== metroId) continue;
    for (const school of cluster.publicHighSchools) {
      if (seen.has(school)) continue;
      seen.add(school);
      out.push(school);
    }
  }
  return out;
}
