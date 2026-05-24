/**
 * Hero typewriter outcomes — generic rotation + vertical-specific sets.
 * Pattern: "How to use AI to [outcome]"
 */
export const heroOutcomePrefix = "How to use AI to";

/** Default rotation — outcomes any professional would recognize */
export const heroGenericOutcomes = [
  "grow my business",
  "get more clients",
  "automate my workflow",
  "save 10 hours a week",
  "run my marketing",
  "generate leads",
  "build a sales pipeline",
  "grow sales",
  "start a side hustle",
  "improve my close rate"
] as const;

export type HeroVerticalId =
  | "general"
  | "restaurant"
  | "real-estate"
  | "dental"
  | "marketing"
  | "sales"
  | "accounting"
  | "small-biz";

export type HeroVertical = {
  id: HeroVerticalId;
  label: string;
  outcomes: readonly string[];
};

export const heroVerticals: readonly HeroVertical[] = [
  { id: "general", label: "Any role", outcomes: heroGenericOutcomes },
  {
    id: "restaurant",
    label: "Restaurant",
    outcomes: [
      "automate Google reviews",
      "optimize my menu",
      "rank on Google Maps",
      "fill tables on slow nights"
    ]
  },
  {
    id: "real-estate",
    label: "Real estate",
    outcomes: [
      "generate more listings",
      "write property descriptions",
      "rank in my local market",
      "automate follow-ups"
    ]
  },
  {
    id: "dental",
    label: "Dental",
    outcomes: [
      "get more patient referrals",
      "fill cancelled slots",
      "respond to reviews",
      "automate reminders"
    ]
  },
  {
    id: "marketing",
    label: "Marketing",
    outcomes: [
      "scale content production",
      "generate ad creatives",
      "personalize campaigns",
      "automate reporting"
    ]
  },
  {
    id: "sales",
    label: "Sales",
    outcomes: [
      "find qualified prospects",
      "write cold emails that convert",
      "automate CRM updates",
      "build a pipeline"
    ]
  },
  {
    id: "accounting",
    label: "Accounting",
    outcomes: [
      "automate data entry",
      "speed up tax prep",
      "generate client reports",
      "streamline bookkeeping"
    ]
  },
  {
    id: "small-biz",
    label: "Small biz",
    outcomes: [
      "grow my business",
      "automate bookkeeping",
      "write better proposals",
      "manage social media"
    ]
  }
] as const;

const verticalById = new Map(heroVerticals.map((v) => [v.id, v]));

export function getHeroVertical(id: HeroVerticalId): HeroVertical {
  return verticalById.get(id) ?? heroVerticals[0];
}

export function getHeroOutcomes(verticalId: HeroVerticalId): readonly string[] {
  return getHeroVertical(verticalId).outcomes;
}

/** Phrases from other verticals — used for slot “near miss” spins before a match */
export function getHeroMismatchPool(verticalId: HeroVerticalId): string[] {
  const pool: string[] = [];
  for (const v of heroVerticals) {
    if (v.id === verticalId) continue;
    pool.push(...v.outcomes);
  }
  return pool;
}

function pickRandom<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)]!;
}

/** Build a spin sequence that lands on `target` after near-misses from `mismatchPool` */
export function buildSlotSpinSequence(params: {
  outcomes: readonly string[];
  target: string;
  mismatchPool: readonly string[];
  spinCount?: number;
}): string[] {
  const { outcomes, target, mismatchPool } = params;
  const total = params.spinCount ?? 9 + Math.floor(Math.random() * 5);
  const seq: string[] = [];
  const nearMatchFrom = Math.max(2, Math.floor(total * 0.55));

  for (let i = 0; i < total - 1; i++) {
    if (i < nearMatchFrom && mismatchPool.length > 0) {
      let phrase = pickRandom(mismatchPool);
      let guard = 0;
      while (phrase === seq[seq.length - 1] && guard++ < 8) {
        phrase = pickRandom(mismatchPool);
      }
      seq.push(phrase);
    } else {
      const candidates = outcomes.filter(
        (o) => o !== target && o !== seq[seq.length - 1]
      );
      seq.push(candidates.length > 0 ? pickRandom(candidates) : pickRandom(outcomes));
    }
  }
  seq.push(target);
  return seq;
}

export function getSlotStepDelayMs(step: number, total: number): number {
  const t = step / Math.max(total, 1);
  return Math.min(48 + t * t * 300, 280);
}

const VERTICAL_SLUGS = new Set(heroVerticals.map((v) => v.id));

export function parseHeroVerticalParam(
  value: string | null | undefined
): HeroVerticalId | null {
  if (!value) return null;
  const normalized = value.toLowerCase().replace(/_/g, "-");
  return VERTICAL_SLUGS.has(normalized as HeroVerticalId)
    ? (normalized as HeroVerticalId)
    : null;
}

/** @deprecated use heroGenericOutcomes */
export const heroSearchOutcomes = heroGenericOutcomes;
