import { resolveFirebaseProjectId } from "@/lib/firebase/server-config";
import {
  FUNNEL_PHONE_RECAPTCHA_ACTION,
  getRecaptchaEnterpriseSiteKey,
} from "@/lib/firebase/recaptcha-enterprise-public";

export type RecaptchaAssessmentResult = {
  ok: boolean;
  valid: boolean;
  score: number | null;
  action: string | null;
  hostname: string | null;
  invalidReason: string | null;
};

/**
 * Server API key allowed to call projects.assessments.create.
 * Do NOT use the Firebase browser key — GCP blocks it (403 PERMISSION_DENIED).
 * Create in GCP → APIs & Services → Credentials → API key → restrict to reCAPTCHA Enterprise API.
 */
function getRecaptchaEnterpriseApiKey(): string | null {
  return process.env.RECAPTCHA_ENTERPRISE_API_KEY?.trim() || null;
}

export function isRecaptchaEnterpriseAssessmentConfigured(): boolean {
  return (
    Boolean(resolveFirebaseProjectId()) &&
    Boolean(getRecaptchaEnterpriseSiteKey()) &&
    Boolean(getRecaptchaEnterpriseApiKey())
  );
}

export async function assessRecaptchaEnterpriseToken(input: {
  token: string;
  expectedAction?: string;
}): Promise<RecaptchaAssessmentResult> {
  const projectId = resolveFirebaseProjectId();
  const siteKey = getRecaptchaEnterpriseSiteKey();
  const apiKey = getRecaptchaEnterpriseApiKey();
  const expectedAction = input.expectedAction?.trim() || FUNNEL_PHONE_RECAPTCHA_ACTION;

  if (!projectId || !siteKey || !apiKey) {
    throw new Error("recaptcha_assessment_not_configured");
  }

  const url = `https://recaptchaenterprise.googleapis.com/v1/projects/${encodeURIComponent(projectId)}/assessments?key=${encodeURIComponent(apiKey)}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      event: {
        token: input.token,
        expectedAction,
        siteKey,
      },
    }),
  });

  const payload = (await response.json().catch(() => ({}))) as {
    tokenProperties?: {
      valid?: boolean;
      action?: string;
      hostname?: string;
      invalidReason?: string;
    };
    riskAnalysis?: {
      score?: number;
    };
    error?: {
      message?: string;
      status?: string;
    };
  };

  if (!response.ok) {
    const message = payload.error?.message || `assessment_http_${response.status}`;
    throw new Error(message);
  }

  const valid = payload.tokenProperties?.valid === true;
  const action = payload.tokenProperties?.action?.trim() || null;
  const hostname = payload.tokenProperties?.hostname?.trim() || null;
  const invalidReason = payload.tokenProperties?.invalidReason?.trim() || null;
  const score =
    typeof payload.riskAnalysis?.score === "number" ? payload.riskAnalysis.score : null;

  const actionMatches = !action || action === expectedAction;

  return {
    ok: valid && actionMatches,
    valid,
    score,
    action,
    hostname,
    invalidReason,
  };
}
