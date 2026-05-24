import type { SatPlanAnswers, SatPlanFunnelState, SatPlanStep, SatPlanStepMeta } from "@/lib/sat-plan-funnel/types";

export const STORAGE_KEY = "illuminairy_satplan_v1";

const DEFAULT_STATE: SatPlanFunnelState = {
  step: "landing",
  path: "spine",
  answers: {}
};

export const SAT_PLAN_STEPS: Record<SatPlanStep, SatPlanStepMeta> = {
  landing: { progress: 0, label: null },
  worries: { progress: 7, label: "Question 1 of 14", labelUpper: true },
  who: { progress: 14, label: "Question 2 of 14", labelUpper: true },
  target: { progress: 21, label: "Question 3 of 14", labelUpper: true },
  trust: { progress: 28, label: null },
  "history-stub": { progress: 35, label: "Question 4 of 14", labelUpper: true }
};

export function loadSatPlanState(): SatPlanFunnelState {
  if (typeof window === "undefined") return { ...DEFAULT_STATE };
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_STATE };
    const parsed = JSON.parse(raw) as Partial<SatPlanFunnelState>;
    return {
      ...DEFAULT_STATE,
      ...parsed,
      answers: { ...DEFAULT_STATE.answers, ...(parsed.answers ?? {}) }
    };
  } catch {
    return { ...DEFAULT_STATE };
  }
}

export function saveSatPlanState(state: SatPlanFunnelState): void {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function stepFromSearchParam(value: string | null): SatPlanStep {
  if (value === "target-stub") return "target";
  if (value === "trust-stub") return "trust";
  if (
    value === "worries" ||
    value === "who" ||
    value === "target" ||
    value === "trust" ||
    value === "history-stub" ||
    value === "history"
  ) {
    if (value === "history") return "history-stub";
    return value;
  }
  if (value === "chapter1-stub") return "who";
  return "landing";
}

export function satPlanPathForStep(step: SatPlanStep): string {
  return step === "landing" ? "/satplan" : `/satplan?step=${step}`;
}

export function patchSatPlanAnswers(patch: Partial<SatPlanAnswers>): SatPlanFunnelState {
  const state = loadSatPlanState();
  state.answers = { ...state.answers, ...patch };
  saveSatPlanState(state);
  return state;
}

export function setSatPlanStep(step: SatPlanStep): SatPlanFunnelState {
  const state = loadSatPlanState();
  state.step = step;
  saveSatPlanState(state);
  return state;
}
