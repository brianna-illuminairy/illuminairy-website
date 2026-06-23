"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { planBuilderBStepHref } from "@/lib/plan-builder-b-routes";
import {
  isValidOAuthEmail,
  OAUTH_ERROR_PARAM,
  OAUTH_OK_PARAM,
  OAUTH_REASON_PARAM,
  stripOAuthFunnelParams,
} from "@/lib/quiz-funnel-b/oauth-complete";
import {
  clearOAuthHandoffArtifacts,
  isOAuthSignInPending,
  resolveOAuthEmailAfterRedirect,
} from "@/lib/quiz-funnel-b/oauth-email-sync";
import { persistQuizSnapshot } from "@/lib/quiz-funnel-b/quiz-storage";
import { useQuiz } from "./state";

/**
 * After Google/Facebook sign-in, ensure parentEmail is in funnel state.
 * Cookie + session API + retries — survives blocked cookies and slow session writes.
 */
export function useSyncOAuthEmail() {
  const router = useRouter();
  const params = useSearchParams();
  const search = params.toString();
  const { answers, dispatch, lastStep, hydrated } = useQuiz();
  const syncGeneration = useRef(0);
  const answersRef = useRef(answers);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  useEffect(() => {
    if (!hydrated) return;

    const urlParams = new URLSearchParams(search);
    const oauthOk = urlParams.get(OAUTH_OK_PARAM) === "1";
    const oauthError = urlParams.get(OAUTH_ERROR_PARAM) === "1";
    const pending = isOAuthSignInPending();
    const hasEmail = isValidOAuthEmail(answers.parentEmail);

    if (hasEmail) {
      if (oauthOk || pending) clearOAuthHandoffArtifacts();
      if (oauthOk && urlParams.get("step") === "b-email") {
        const cleaned = stripOAuthFunnelParams(urlParams);
        router.replace(planBuilderBStepHref("b-zip", cleaned.toString()));
      }
      return;
    }

    if (!oauthOk && !pending && !oauthError) return;

    const generation = ++syncGeneration.current;

    async function sync() {
      const email = await resolveOAuthEmailAfterRedirect();
      if (generation !== syncGeneration.current) return;

      const cleaned = stripOAuthFunnelParams(new URLSearchParams(search));

      if (email) {
        clearOAuthHandoffArtifacts();
        dispatch({ type: "SET_FIELD", key: "parentEmail", value: email });
        persistQuizSnapshot({
          answers: { ...answersRef.current, parentEmail: email },
          lastStep: lastStep ?? "b-zip",
          updatedAt: Date.now(),
        });
        cleaned.set("step", "b-zip");
        router.replace(planBuilderBStepHref("b-zip", cleaned.toString()));
        return;
      }

      clearOAuthHandoffArtifacts();
      if (oauthOk || pending) {
        cleaned.set("step", "b-email");
        cleaned.set(OAUTH_ERROR_PARAM, "1");
        cleaned.delete(OAUTH_REASON_PARAM);
        router.replace(planBuilderBStepHref("b-email", cleaned.toString()));
      }
    }

    void sync();
  }, [hydrated, answers.parentEmail, dispatch, lastStep, search, router]);
}
