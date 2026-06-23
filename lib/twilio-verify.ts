const TWILIO_API = "https://verify.twilio.com/v2";

function twilioConfig() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID?.trim();
  const authToken = process.env.TWILIO_AUTH_TOKEN?.trim();
  const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID?.trim();
  if (!accountSid || !authToken || !serviceSid) {
    return null;
  }
  return { accountSid, authToken, serviceSid };
}

function toE164(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  if (raw.trim().startsWith("+") && digits.length >= 10) return `+${digits}`;
  return null;
}

async function twilioPost(path: string, body: Record<string, string>) {
  const cfg = twilioConfig();
  if (!cfg) {
    return { ok: false as const, error: "twilio_not_configured" as const };
  }

  const params = new URLSearchParams(body);
  const auth = Buffer.from(`${cfg.accountSid}:${cfg.authToken}`).toString("base64");
  const res = await fetch(`${TWILIO_API}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  const data = (await res.json()) as { status?: string; message?: string };
  if (!res.ok) {
    return {
      ok: false as const,
      error: data.message ?? `twilio_${res.status}`,
    };
  }
  return { ok: true as const, status: data.status ?? "pending" };
}

export async function sendPhoneVerification(phone: string) {
  const e164 = toE164(phone);
  if (!e164) {
    return { ok: false as const, error: "invalid_phone" as const };
  }

  const cfg = twilioConfig();
  if (!cfg) {
    return { ok: false as const, error: "twilio_not_configured" as const };
  }

  return twilioPost(`/Services/${cfg.serviceSid}/Verifications`, {
    To: e164,
    Channel: "sms",
  });
}

export async function checkPhoneVerification(phone: string, code: string) {
  const e164 = toE164(phone);
  if (!e164) {
    return { ok: false as const, error: "invalid_phone" as const };
  }

  const trimmedCode = code.replace(/\D/g, "");
  if (trimmedCode.length < 4) {
    return { ok: false as const, error: "invalid_code" as const };
  }

  const cfg = twilioConfig();
  if (!cfg) {
    return { ok: false as const, error: "twilio_not_configured" as const };
  }

  const result = await twilioPost(
    `/Services/${cfg.serviceSid}/VerificationCheck`,
    {
      To: e164,
      Code: trimmedCode,
    }
  );

  if (!result.ok) {
    return result;
  }

  if (result.status !== "approved") {
    return { ok: false as const, error: "code_not_approved" as const };
  }

  return { ok: true as const, verifiedAt: new Date().toISOString() };
}

export function isTwilioVerifyConfigured(): boolean {
  return twilioConfig() !== null;
}
