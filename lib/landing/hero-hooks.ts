/** Optional ad message-match — `?hook=gpa|fall|khan|nov1|gap|june` (UTM passthrough). */
export const LANDING_HOOK_PARAM = "hook" as const;

export type LandingHeroHook =
  | "default"
  | "gpa"
  | "fall"
  | "khan"
  | "nov1"
  | "gap"
  | "june"
  | "tutor";

export function landingHeroHookFromSearch(search: string): LandingHeroHook {
  const normalized = search.startsWith("?") ? search.slice(1) : search;
  const raw = new URLSearchParams(normalized).get(LANDING_HOOK_PARAM)?.toLowerCase();
  if (
    raw === "gpa" ||
    raw === "fall" ||
    raw === "khan" ||
    raw === "nov1" ||
    raw === "gap" ||
    raw === "june" ||
    raw === "tutor"
  ) {
    return raw;
  }
  return "default";
}

export type LandingHeroHookSource =
  | "query"
  | "utm_content"
  | "utm_campaign"
  | "metro"
  | "default";

const HOOK_UTM_TOKENS: readonly LandingHeroHook[] = [
  "gpa",
  "fall",
  "khan",
  "nov1",
  "gap",
  "june",
  "tutor"
];

/** Icon / Meta creative slugs — `utm_content=script_1`, etc. */
const ICON_SCRIPT_HOOKS: Record<string, LandingHeroHook> = {
  script_1: "gpa",
  script_2: "gpa",
  script_3: "nov1",
  script_4: "khan",
  script_5: "gap",
  script_6: "june",
  angle_a: "gap",
  angle_b: "june",
  angle_g: "nov1",
  /** Meta c1 cold creative slugs — `utm_content` on live ad URLs. */
  ad2_enough_time: "fall",
  ad3_before_tutoring: "tutor",
  ad4_mom_first_story: "gpa"
};

function hookFromToken(token: string): LandingHeroHook | null {
  if (ICON_SCRIPT_HOOKS[token]) return ICON_SCRIPT_HOOKS[token];
  if (HOOK_UTM_TOKENS.includes(token as LandingHeroHook)) {
    return token as LandingHeroHook;
  }
  return null;
}

/** Parse hook name from utm_content or utm_campaign slug. */
export function landingHeroHookFromUtmSlug(slug?: string | null): LandingHeroHook | null {
  if (!slug) return null;
  const lower = slug.toLowerCase().trim();
  const direct = hookFromToken(lower);
  if (direct) return direct;

  for (const token of HOOK_UTM_TOKENS) {
    if (
      lower.includes(`_${token}`) ||
      lower.includes(`${token}_`) ||
      lower.startsWith(`${token}-`) ||
      lower.endsWith(`-${token}`)
    ) {
      return token;
    }
  }

  for (const [scriptId, hook] of Object.entries(ICON_SCRIPT_HOOKS)) {
    if (lower.includes(scriptId)) return hook;
  }

  if (lower.includes("bluebook") || lower.includes("khan")) return "khan";
  if (lower.includes("retake") || lower.includes("june")) return "june";
  if (lower.includes("nov1") || lower.includes("early_action") || lower.includes("deadline")) {
    return "nov1";
  }
  if (lower.includes("gpa") || lower.includes("ap_class")) return "gpa";
  if (lower.includes("enough_time")) return "fall";
  if (lower.includes("before_tutoring") || lower.includes("tutoring")) return "tutor";
  if (lower.includes("mom_first_story") || lower.includes("first_story")) return "gpa";

  return null;
}

export type ResolvedLandingHeroHook = {
  hook: LandingHeroHook;
  source: LandingHeroHookSource;
};

/** National Meta default: match creative slug, not geography. */
export function resolveLandingHeroHook(input: {
  search?: string;
  utmContent?: string | null;
  utmCampaign?: string | null;
  metroHook?: LandingHeroHook | null;
}): ResolvedLandingHeroHook {
  const search = input.search ?? "";
  const fromQuery = landingHeroHookFromSearch(search);
  if (fromQuery !== "default") {
    return { hook: fromQuery, source: "query" };
  }

  const fromContent = landingHeroHookFromUtmSlug(input.utmContent);
  if (fromContent) return { hook: fromContent, source: "utm_content" };

  const fromCampaign = landingHeroHookFromUtmSlug(input.utmCampaign);
  if (fromCampaign) return { hook: fromCampaign, source: "utm_campaign" };

  if (input.metroHook && input.metroHook !== "default") {
    return { hook: input.metroHook, source: "metro" };
  }

  return { hook: "default", source: "default" };
}

export type LandingHeroHeadline = {
  lines: readonly [string, string, string];
  accentLine: 0 | 1 | 2;
};

/** Cold traffic: situation first. Default = score vs college expectations (widest Meta cold). */
export const landingHeroHeadlines: Record<LandingHeroHook, LandingHeroHeadline> = {
  default: {
    lines: [
      "Your child's SAT is in the 1100s or 1200s.",
      "The colleges they're applying to expect scores around 1400.",
      "Find out what's still realistic before their fall test."
    ],
    accentLine: 1
  },
  gpa: {
    lines: [
      "Strong GPA.",
      "SAT stuck in the 1100s or 1200s?",
      "Find out what's still realistic before their fall test."
    ],
    accentLine: 1
  },
  gap: {
    lines: [
      "SAT in the 1100s or 1200s.",
      "Target colleges expect scores around 1400?",
      "Find out what's still realistic before their fall test."
    ],
    accentLine: 1
  },
  fall: {
    lines: [
      "Fall SAT coming up.",
      "Early applications are weeks away.",
      "Find out if the score can still move in time."
    ],
    accentLine: 2
  },
  june: {
    lines: [
      "June SAT score too low?",
      "Retaking this fall before applications?",
      "Find out what's still realistic on their timeline."
    ],
    accentLine: 2
  },
  khan: {
    lines: [
      "They used Khan Academy and Bluebook.",
      "The official score still isn't where it needs to be.",
      "Find out what to do differently this time."
    ],
    accentLine: 1
  },
  nov1: {
    lines: [
      "Need 150 to 200+ points",
      "before November 1 early applications?",
      "See if that's still realistic on their timeline."
    ],
    accentLine: 0
  },
  tutor: {
    lines: [
      "Before you pay for SAT tutoring.",
      "Find out what score is realistic",
      "before their next test."
    ],
    accentLine: 1
  }
};
