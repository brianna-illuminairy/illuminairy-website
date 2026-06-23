import zip3ToState from "@/lib/plan-b/data/zip3-to-state.json";
import {
  isUsStateCode,
  stateSlugFromCode,
  type UsStateCode,
} from "@/lib/plan-b/us-states";

const ZIP3_MAP = zip3ToState as Record<string, string>;

export function zipToStateCode(zip: string): UsStateCode | null {
  const digits = zip.replace(/\D/g, "").slice(0, 5);
  if (digits.length < 3) return null;
  const code = ZIP3_MAP[digits.slice(0, 3)];
  if (!code || !isUsStateCode(code)) return null;
  return code;
}

export function regionIdFromZip(zip: string): string {
  const code = zipToStateCode(zip);
  if (!code) return "unknown";
  return stateSlugFromCode(code);
}
