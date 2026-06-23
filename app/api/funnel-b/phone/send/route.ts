import { NextResponse } from "next/server";
import { funnelBVerifyStatus } from "@/lib/funnel-b-verify";
import { isFirebaseClientConfigured } from "@/lib/firebase/public-config";
import { assessRecaptchaEnterpriseToken } from "@/lib/firebase/recaptcha-enterprise-assess";
import { isFunnelPhoneEnterpriseRecaptchaEnabled } from "@/lib/firebase/funnel-phone-recaptcha";

export const dynamic = "force-dynamic";

function phoneSendStatus() {
  const status = funnelBVerifyStatus();
  const enterpriseRecaptchaEnabled = isFunnelPhoneEnterpriseRecaptchaEnabled();

  return {
    ok: status.configured,
    channel: status.channel,
    clientConfigured: status.clientConfigured,
    serverConfigured: status.serverConfigured,
    enterpriseRecaptchaEnabled,
  };
}

export async function GET() {
  const status = phoneSendStatus();
  return NextResponse.json({
    ok: status.ok,
    channel: status.channel,
    clientConfigured: status.clientConfigured,
    serverConfigured: status.serverConfigured,
    enterpriseRecaptchaEnabled: status.enterpriseRecaptchaEnabled,
  });
}

export async function POST(request: Request) {
  const status = phoneSendStatus();

  if (!status.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: "verify_not_configured",
        message: "Verification is temporarily unavailable. Email support@illuminairy.com.",
        clientConfigured: status.clientConfigured,
        serverConfigured: status.serverConfigured,
      },
      { status: 503 }
    );
  }

  if (!status.enterpriseRecaptchaEnabled) {
    return NextResponse.json({
      ok: true,
      channel: "firebase",
      clientSide: true,
    });
  }

  let body: { recaptchaToken?: unknown; recaptchaAction?: unknown } = {};
  try {
    body = (await request.json()) as typeof body;
  } catch {
    body = {};
  }

  const recaptchaToken =
    typeof body.recaptchaToken === "string" ? body.recaptchaToken.trim() : "";
  const recaptchaAction =
    typeof body.recaptchaAction === "string" ? body.recaptchaAction.trim() : undefined;

  if (!recaptchaToken) {
    return NextResponse.json(
      {
        ok: false,
        error: "recaptcha_token_required",
        message: "Security check failed. Refresh the page and try again.",
      },
      { status: 400 }
    );
  }

  try {
    const assessment = await assessRecaptchaEnterpriseToken({
      token: recaptchaToken,
      expectedAction: recaptchaAction,
    });

    if (!assessment.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: "recaptcha_assessment_failed",
          message: "Security check failed. Refresh the page and try again.",
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      ok: true,
      channel: "firebase",
      clientSide: true,
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "recaptcha_assessment_error",
        message: "Security check failed. Refresh the page and try again.",
      },
      { status: 503 }
    );
  }
}
