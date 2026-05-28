import { questionNumber } from "@/lib/assessment-funnel/funnel-routing";
import type {
  AssessmentFunnelState,
  AssessmentStep,
  AssessmentStepMeta
} from "@/lib/assessment-funnel/types";
import { ASSESSMENT_ROUTABLE_STEPS } from "@/lib/assessment-funnel/types";

export const STORAGE_KEY = "illuminairy_assessment_v1";

const DEFAULT_STATE: AssessmentFunnelState = {
  step: "landing",
  answers: {},
  landing_ctx: "low"
};

const PROGRESS_BY_STEP: Record<AssessmentStep, number> = {
  landing: 0,
  situation: 12,
  who: 24,
  target: 36,
  current: 48,
  tried: 60,
  "test-date": 72,
  "insight-situation": 84,
  "insight-path": 92,
  complete: 100
};

export const ASSESSMENT_STEPS: Record<AssessmentStep, AssessmentStepMeta> = {
  landing: { progress: 0, label: null },
  situation: { progress: 12, label: "Question 1 of 6", labelUpper: true },
  who: { progress: 24, label: "Question 2 of 6", labelUpper: true },
  target: { progress: 36, label: "Question 3 of 6", labelUpper: true },
  current: { progress: 48, label: "Question 4 of 6", labelUpper: true },
  tried: { progress: 60, label: "Question 5 of 6", labelUpper: true },
  "test-date": { progress: 72, label: "Question 6 of 6", labelUpper: true },
  "insight-situation": { progress: 84, label: null },
  "insight-path": { progress: 92, label: null },
  complete: { progress: 100, label: null }
};

export function loadAssessmentState(): AssessmentFunnelState {
  if (typeof window === "undefined") return { ...DEFAULT_STATE };
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_STATE };
    const parsed = JSON.parse(raw) as Partial<AssessmentFunnelState>;
    const step = (parsed.step ?? DEFAULT_STATE.step) as AssessmentStep;
    return {
      ...DEFAULT_STATE,
      ...parsed,
      step: ASSESSMENT_ROUTABLE_STEPS.includes(step) || step === "landing" ? step : "landing",
      answers: { ...DEFAULT_STATE.answers, ...(parsed.answers ?? {}) }
    };
  } catch {
    return { ...DEFAULT_STATE };
  }
}

export function saveAssessmentState(state: AssessmentFunnelState): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore quota
  }
}

export function patchAssessmentAnswers(
  patch: Partial<AssessmentFunnelState["answers"]>
): AssessmentFunnelState {
  const current = loadAssessmentState();
  const next = {
    ...current,
    answers: { ...current.answers, ...patch }
  };
  saveAssessmentState(next);
  return next;
}

export function setAssessmentStep(step: AssessmentStep): void {
  const current = loadAssessmentState();
  saveAssessmentState({ ...current, step });
}

export function stepFromSearchParam(param: string | null): AssessmentStep {
  if (!param || param === "landing") return "landing";
  if (ASSESSMENT_ROUTABLE_STEPS.includes(param as AssessmentStep)) {
    return param as AssessmentStep;
  }
  return "landing";
}

export function assessmentPathForStep(step: AssessmentStep): string {
  if (step === "landing") return "/assessment";
  return `/assessment?step=${encodeURIComponent(step)}`;
}

export function progressForStep(step: AssessmentStep): number {
  return PROGRESS_BY_STEP[step] ?? 0;
}

export { questionNumber };
