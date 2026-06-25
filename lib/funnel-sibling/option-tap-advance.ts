import { flushSync } from "react-dom";

/** One frame so selected option state paints before route change. */
export const OPTION_TAP_ADVANCE_MS = 16;

type SetQAction = { type: "SET_Q"; key: string; value?: string };

type CommitQuizAnswersOptions = {
  dispatch: (action: SetQAction) => void;
  updates: Array<{ key: string; value?: string }>;
};

/** Commit tap answers synchronously so step guards see them before navigation. */
export function commitQuizAnswers({ dispatch, updates }: CommitQuizAnswersOptions) {
  flushSync(() => {
    for (const { key, value } of updates) {
      dispatch({ type: "SET_Q", key, value });
    }
  });
}

type ScheduleOptionTapAdvanceOptions<TAnswers extends Record<string, unknown>> = {
  mergedAnswers: TAnswers;
  fromStepId: string;
  getRouteSteps: (answers: TAnswers) => string[];
  goTo: (stepId: string) => void;
  delayMs?: number;
};

export function scheduleOptionTapAdvance<TAnswers extends Record<string, unknown>>({
  mergedAnswers,
  fromStepId,
  getRouteSteps,
  goTo,
  delayMs = OPTION_TAP_ADVANCE_MS,
}: ScheduleOptionTapAdvanceOptions<TAnswers>) {
  window.setTimeout(() => {
    const routeSteps = getRouteSteps(mergedAnswers);
    const idx = routeSteps.indexOf(fromStepId);
    if (idx >= 0 && idx < routeSteps.length - 1) {
      goTo(routeSteps[idx + 1]!);
    }
  }, delayMs);
}
