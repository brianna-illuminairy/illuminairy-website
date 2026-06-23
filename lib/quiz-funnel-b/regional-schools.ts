import {
  PLAN_B_REGIONAL_DISCOUNT_PCT,
  regionalStripeCouponId,
} from "@/lib/plan-b/membership-pricing";

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

/** Zip3 prefix ranges → region id (approximate; fallback national). */
const ZIP3_TO_REGION: { prefixes: string[]; regionId: string }[] = [
  { prefixes: ["300", "301", "302", "303", "304", "305", "306", "307", "308", "309", "310", "311", "312", "313", "314", "315", "316", "317", "318", "319"], regionId: "georgia" },
  { prefixes: ["750", "751", "752", "753", "754", "755", "756", "757", "758", "759", "760", "761", "762", "763", "764", "765", "766", "767", "768", "769", "770", "771", "772", "773", "774", "775", "776", "777", "778", "779", "780", "781", "782", "783", "784", "785", "786", "787", "788", "789", "790", "791", "792", "793", "794", "795", "796", "797", "798", "799"], regionId: "texas" },
  { prefixes: ["320", "321", "322", "323", "324", "325", "326", "327", "328", "329", "330", "331", "332", "333", "334", "335", "336", "337", "338", "339", "340", "341", "342", "343", "344", "345", "346", "347", "348", "349"], regionId: "florida" },
  { prefixes: ["270", "271", "272", "273", "274", "275", "276", "277", "278", "279", "280", "281", "282", "283", "284", "285", "286", "287", "288", "289"], regionId: "north-carolina" },
  { prefixes: ["200", "201", "202", "203", "204", "205", "206", "207", "208", "209", "210", "211", "212", "213", "214", "215", "216", "217", "218", "219", "220", "221", "222", "223", "224", "225", "226", "227"], regionId: "dc-metro" },
];

export const REGIONAL_MARKETS: Record<string, RegionalMarket> = {
  georgia: {
    id: "georgia",
    label: "Georgia",
    schools: [
      { id: "georgia-tech", name: "Georgia Tech", inState: true },
      { id: "uga", name: "University of Georgia", inState: true },
      { id: "emory", name: "Emory University", inState: true },
      { id: "uf", name: "University of Florida", inState: false },
      { id: "vanderbilt", name: "Vanderbilt University", inState: false },
      { id: "duke", name: "Duke University", inState: false },
    ],
  },
  texas: {
    id: "texas",
    label: "Texas",
    schools: [
      { id: "ut-austin", name: "UT Austin", inState: true },
      { id: "texas-am", name: "Texas A&M", inState: true },
      { id: "rice", name: "Rice University", inState: true },
      { id: "texas-tech", name: "Texas Tech", inState: true },
      { id: "baylor", name: "Baylor University", inState: false },
      { id: "ou", name: "University of Oklahoma", inState: false },
    ],
  },
  florida: {
    id: "florida",
    label: "Florida",
    schools: [
      { id: "uf", name: "University of Florida", inState: true },
      { id: "fsu", name: "Florida State University", inState: true },
      { id: "um", name: "University of Miami", inState: true },
      { id: "ucf", name: "UCF", inState: true },
      { id: "georgia-tech", name: "Georgia Tech", inState: false },
      { id: "duke", name: "Duke University", inState: false },
    ],
  },
  "north-carolina": {
    id: "north-carolina",
    label: "North Carolina",
    schools: [
      { id: "unc", name: "UNC Chapel Hill", inState: true },
      { id: "duke", name: "Duke University", inState: true },
      { id: "nc-state", name: "NC State", inState: true },
      { id: "wake-forest", name: "Wake Forest", inState: true },
      { id: "uva", name: "University of Virginia", inState: false },
      { id: "vanderbilt", name: "Vanderbilt University", inState: false },
    ],
  },
  "dc-metro": {
    id: "dc-metro",
    label: "DC Metro",
    schools: [
      { id: "uva", name: "University of Virginia", inState: true },
      { id: "umd", name: "University of Maryland", inState: true },
      { id: "vt", name: "Virginia Tech", inState: true },
      { id: "gw", name: "George Washington University", inState: true },
      { id: "penn", name: "UPenn", inState: false },
      { id: "duke", name: "Duke University", inState: false },
    ],
  },
  national: {
    id: "national",
    label: "your region",
    schools: [
      { id: "umich", name: "University of Michigan", inState: true },
      { id: "unc", name: "UNC Chapel Hill", inState: true },
      { id: "uva", name: "University of Virginia", inState: true },
      { id: "ut-austin", name: "UT Austin", inState: true },
      { id: "usc", name: "USC", inState: true },
      { id: "nyu", name: "NYU", inState: true },
    ],
  },
};

export function regionIdFromZip(zip: string): string {
  const digits = zip.replace(/\D/g, "").slice(0, 5);
  if (digits.length < 3) return "national";
  const zip3 = digits.slice(0, 3);
  for (const row of ZIP3_TO_REGION) {
    if (row.prefixes.includes(zip3)) return row.regionId;
  }
  return "national";
}

export function regionalMarketForZip(zip: string): RegionalMarket {
  const id = regionIdFromZip(zip);
  return REGIONAL_MARKETS[id] ?? REGIONAL_MARKETS.national;
}

export function regionalUnlockOffer(regionId: string) {
  const market = REGIONAL_MARKETS[regionId] ?? REGIONAL_MARKETS.national;
  return {
    regionId: market.id,
    regionLabel: market.label,
    discountPct: PLAN_B_REGIONAL_DISCOUNT_PCT,
    discountCode: regionalStripeCouponId(market.id),
  };
}

export function schoolNamesFromIds(regionId: string, ids: string[]): string[] {
  const market = REGIONAL_MARKETS[regionId] ?? REGIONAL_MARKETS.national;
  const map = new Map(market.schools.map((s) => [s.id, s.name]));
  return ids.map((id) => map.get(id)).filter((n): n is string => Boolean(n));
}

export const TARGET_SCHOOL_OTHER_ID = "other" as const;
