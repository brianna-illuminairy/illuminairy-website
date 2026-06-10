/**
 * utm_content alias matrix — keep in sync with lib/marketing/utm-content-aliases.ts
 */
import {
  canonicalizeUtmContent,
  hogqlUtmContentCanonical,
  isUtmContentAlias,
  utmContentIdsForCounting,
  UTM_CONTENT_ALIAS_GROUPS
} from "@/lib/marketing/utm-content-aliases";

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`FAIL: ${message}`);
    process.exit(1);
  }
}

assert(
  canonicalizeUtmContent("concerned_mom_good_grades_low_sat") === "script_5",
  "concerned_mom_good_grades_low_sat → script_5"
);
assert(canonicalizeUtmContent("script_5") === "script_5", "script_5 stays canonical");
assert(canonicalizeUtmContent("  SCRIPT_5  ") === "script_5", "trim + lowercase");
assert(
  canonicalizeUtmContent("concerned_mom") === "script_5",
  "concerned_mom → script_5"
);
assert(
  canonicalizeUtmContent("ad3_before_tutoring") === "ad3_before_tutoring",
  "unrelated slugs unchanged"
);
assert(isUtmContentAlias("concerned_mom_good_grades_low_sat"), "alias detected");
assert(!isUtmContentAlias("script_5"), "canonical not alias");

const counting = utmContentIdsForCounting("concerned_mom_good_grades_low_sat");
assert(
  counting.includes("script_5") && counting.includes("concerned_mom_good_grades_low_sat"),
  "counting ids include canonical + alias"
);

const hogql = hogqlUtmContentCanonical();
assert(hogql.includes("concerned_mom_good_grades_low_sat"), "hogql maps legacy slug");
assert(hogql.includes("THEN 'script_5'"), "hogql canonical target");

console.log("utm_content alias verify OK");
console.log(JSON.stringify(UTM_CONTENT_ALIAS_GROUPS, null, 2));
