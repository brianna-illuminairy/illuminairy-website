import { nextStepAfterPrepFailed } from "@/lib/sat-plan-funnel/funnel-routing";
import type { SatPlanFunnelState, SatPlanStep, SatPlanStepMeta } from "@/lib/sat-plan-funnel/types";
import { SAT_PLAN_ROUTABLE_STEPS } from "@/lib/sat-plan-funnel/types";

export const STORAGE_KEY = "illuminairy_satplan_v1";

const DEFAULT_STATE: SatPlanFunnelState = {
  step: "landing",
  path: "spine",
  answers: {}
};

export const SAT_PLAN_STEPS: Record<SatPlanStep, SatPlanStepMeta> = {
  landing: { progress: 0, label: null },
  worries: { progress: 6, label: "Question 1 of 10", labelUpper: true },
  who: { progress: 12, label: "Question 2 of 10", labelUpper: true },
  target: { progress: 18, label: "Question 3 of 10", labelUpper: true },
  trust: { progress: 24, label: null },
  history: { progress: 30, label: "Question 4 of 10", labelUpper: true },
  "int3-retake": { progress: 33, label: null },
  prep: { progress: 36, label: "Question 5 of 10", labelUpper: true },
  "prep-failed-group-class": { progress: 38, label: null },
  "prep-failed-self-study": { progress: 38, label: null },
  "prep-failed-plateau": { progress: 39, label: null },
  "prep-failed-proof": { progress: 42, label: null },
  "prep-failed-mentors": { progress: 44, label: null },
  "prep-failed-guided": { progress: 46, label: null },
  "prep-failed-mistake-driven": { progress: 48, label: null },
  "prep-failed-stub": { progress: 43, label: null },
  score: { progress: 52, label: "Question 6 of 10", labelUpper: true },
  wrong: { progress: 62, label: "Question 7 of 10", labelUpper: true },
  "sat-changed": { progress: 65, label: null },
  gpa: { progress: 68, label: "Question 8 of 10", labelUpper: true },
  "gpa-paradox": { progress: 72, label: null },
  "test-date": { progress: 76, label: "Question 9 of 10", labelUpper: true },
  timeline: { progress: 80, label: null },
  schools: { progress: 84, label: "Question 10 of 10", labelUpper: true },
  "plan-path": { progress: 88, label: null },
  contact: { progress: 92, label: null },
  "plan-ready": { progress: 95, label: null },
  report: { progress: 98, label: null },
  book: { progress: 100, label: null }
};

export function loadSatPlanState(): SatPlanFunnelState {
  if (typeof window === "undefined") return { ...DEFAULT_STATE };
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_STATE };
    const parsed = JSON.parse(raw) as Partial<SatPlanFunnelState> & { step?: string };
    const answers = { ...DEFAULT_STATE.answers, ...(parsed.answers ?? {}) };
    let step = (parsed.step ?? DEFAULT_STATE.step) as SatPlanStep;
    const legacyStep = parsed.step as string | undefined;
    if (
      legacyStep === "hours" ||
      legacyStep === "int13-kid-problem" ||
      legacyStep === "kid-problem"
    ) {
      step = nextStepAfterPrepFailed(answers.test_history, answers.prep_method);
    }
    return {
      ...DEFAULT_STATE,
      ...parsed,
      step,
      answers
    };
  } catch {
    return { ...DEFAULT_STATE };
  }
}

export function saveSatPlanState(state: SatPlanFunnelState): void {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

const LEGACY_STEP_ALIASES: Record<string, SatPlanStep> = {
  "target-stub": "target",
  "trust-stub": "trust",
  "history-stub": "history",
  "prep-stub": "prep",
  "chapter1-stub": "who",
  "gpa-stub": "gpa",
  "int13-kid-problem": "score",
  "kid-problem": "score"
};

export function stepFromSearchParam(value: string | null): SatPlanStep {
  if (!value) return "landing";
  if (value === "hours") {
    const { answers } = loadSatPlanState();
    return nextStepAfterPrepFailed(answers.test_history, answers.prep_method);
  }
  if (value in LEGACY_STEP_ALIASES) {
    return LEGACY_STEP_ALIASES[value];
  }
  if ((SAT_PLAN_ROUTABLE_STEPS as string[]).includes(value)) {
    return value as SatPlanStep;
  }
  return "landing";
}

export function satPlanPathForStep(step: SatPlanStep): string {
  return step === "landing" ? "/satplan" : `/satplan?step=${step}`;
}

export function patchSatPlanAnswers(patch: Partial<SatPlanFunnelState["answers"]>): SatPlanFunnelState {
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

export function clearSatPlanAnswerKey(key: keyof SatPlanFunnelState["answers"]): SatPlanFunnelState {
  const state = loadSatPlanState();
  delete state.answers[key];
  saveSatPlanState(state);
  return state;
}
