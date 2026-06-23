import { type UsStateCode, US_STATE_CODES } from "@/lib/plan-b/us-states";

/** Bordering states (including water borders where commonly used in college markets). */
const NEIGHBORS: Record<UsStateCode, UsStateCode[]> = {
  AL: ["TN", "GA", "FL", "MS"],
  AK: [],
  AZ: ["CA", "NV", "UT", "NM", "CO"],
  AR: ["MO", "TN", "MS", "LA", "TX", "OK"],
  CA: ["OR", "NV", "AZ"],
  CO: ["WY", "NE", "KS", "OK", "NM", "AZ", "UT"],
  CT: ["NY", "MA", "RI"],
  DE: ["MD", "PA", "NJ"],
  DC: ["MD", "VA"],
  FL: ["GA", "AL"],
  GA: ["FL", "AL", "TN", "NC", "SC"],
  HI: [],
  ID: ["MT", "WY", "UT", "NV", "OR", "WA"],
  IL: ["WI", "IA", "MO", "KY", "IN", "MI"],
  IN: ["MI", "OH", "KY", "IL"],
  IA: ["MN", "WI", "IL", "MO", "NE", "SD"],
  KS: ["NE", "MO", "OK", "CO"],
  KY: ["IL", "IN", "OH", "WV", "VA", "TN", "MO"],
  LA: ["TX", "AR", "MS"],
  ME: ["NH"],
  MD: ["PA", "DE", "VA", "WV", "DC"],
  MA: ["NH", "RI", "CT", "NY", "VT"],
  MI: ["WI", "IN", "OH"],
  MN: ["WI", "IA", "SD", "ND"],
  MS: ["TN", "AL", "LA", "AR"],
  MO: ["IA", "IL", "KY", "TN", "AR", "OK", "KS", "NE"],
  MT: ["ND", "SD", "WY", "ID"],
  NE: ["SD", "IA", "MO", "KS", "CO", "WY"],
  NV: ["OR", "ID", "UT", "AZ", "CA"],
  NH: ["ME", "MA", "VT"],
  NJ: ["NY", "PA", "DE"],
  NM: ["CO", "OK", "TX", "AZ", "UT"],
  NY: ["VT", "MA", "CT", "NJ", "PA"],
  NC: ["VA", "TN", "GA", "SC"],
  ND: ["MN", "SD", "MT"],
  OH: ["MI", "PA", "WV", "KY", "IN"],
  OK: ["KS", "MO", "AR", "TX", "NM", "CO"],
  OR: ["WA", "ID", "NV", "CA"],
  PA: ["NY", "NJ", "DE", "MD", "WV", "OH"],
  RI: ["MA", "CT"],
  SC: ["NC", "GA"],
  SD: ["ND", "MN", "IA", "NE", "WY", "MT"],
  TN: ["KY", "VA", "NC", "GA", "AL", "MS", "AR", "MO"],
  TX: ["OK", "AR", "LA", "NM"],
  UT: ["ID", "WY", "CO", "NM", "AZ", "NV"],
  VT: ["NY", "NH", "MA"],
  VA: ["MD", "WV", "KY", "TN", "NC", "DC"],
  WA: ["ID", "OR"],
  WV: ["OH", "PA", "MD", "VA", "KY"],
  WI: ["MI", "IL", "IA", "MN"],
  WY: ["MT", "SD", "NE", "CO", "UT", "ID"],
};

export function borderingStates(code: UsStateCode): UsStateCode[] {
  return NEIGHBORS[code] ?? [];
}

/** Neighbors of neighbors, excluding origin and direct neighbors. */
export function ring2States(code: UsStateCode): UsStateCode[] {
  const direct = new Set<UsStateCode>([code, ...borderingStates(code)]);
  const ring2 = new Set<UsStateCode>();
  for (const n of borderingStates(code)) {
    for (const r of borderingStates(n)) {
      if (!direct.has(r)) ring2.add(r);
    }
  }
  return Array.from(ring2);
}

export function allStateCodes(): UsStateCode[] {
  return [...US_STATE_CODES];
}
