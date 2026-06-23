import { GoogleAuth } from "google-auth-library";
import { resolveFirebaseProjectId } from "@/lib/firebase/server-config";
import {
  FUNNEL_PHONE_RECAPTCHA_ACTION,
  getRecaptchaEnterpriseSiteKey,
} from "@/lib/firebase/recaptcha-enterprise-public";

type ServiceAccountCredentials = {
  project_id?: string;
  client_email?: string;
  private_key?: string;
};

export type RecaptchaAssessmentResult = {
  ok: boolean;
  valid: boolean;
  score: number | null;
  action: string | null;
  hostname: string | null;
  invalidReason: string | null;
};

function readServiceAccountCredentials(): ServiceAccountCredentials | null {
  const rawJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
  if (rawJson) {
    try {
      return JSON.parse(rawJson) as ServiceAccountCredentials;
    } catch {
      return null;
    }
  }

  const projectId = process.env.FIREBASE_PROJECT_ID?.trim();
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim();
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n")?.trim();

  if (!projectId || !clientEmail || !privateKey) {
    return null;
  }

  return {
    project_id: projectId,
    client_email: clientEmail,
    private_key: privateKey,
  };
}

export function isRecaptchaEnterpriseAssessmentConfigured(): boolean {
  const credentials = readServiceAccountCredentials();
  return (
    Boolean(resolveFirebaseProjectId()) &&
    Boolean(getRecaptchaEnterpriseSiteKey()) &&
    Boolean(credentials?.client_email && credentials.private_key)
  );
}

export async function assessRecaptchaEnterpriseToken(input: {
  token: string;
  expectedAction?: string;
}): Promise<RecaptchaAssessmentResult> {
  const projectId = resolveFirebaseProjectId();
  const siteKey = getRecaptchaEnterpriseSiteKey();
  const credentials = readServiceAccountCredentials();
  const expectedAction = input.expectedAction?.trim() || FUNNEL_PHONE_RECAPTCHA_ACTION;

  if (!projectId || !siteKey || !credentials?.client_email || !credentials.private_key) {
    throw new Error("recaptcha_assessment_not_configured");
  }

  const auth = new GoogleAuth({
    credentials: {
      client_email: credentials.client_email,
      private_key: credentials.private_key,
    },
    scopes: ["https://www.googleapis.com/auth/cloud-platform"],
  });

  const client = await auth.getClient();
  const accessToken = await client.getAccessToken();
  const bearer = accessToken.token?.trim();
  if (!bearer) {
    throw new Error("recaptcha_assessment_auth_failed");
  }

  const response = await fetch(
    `https://recaptchaenterprise.googleapis.com/v1/projects/${encodeURIComponent(projectId)}/assessments`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${bearer}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event: {
          token: input.token,
          siteKey,
          expectedAction,
        },
      }),
    }
  );

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
