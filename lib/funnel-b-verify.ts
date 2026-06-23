import { phoneToCalendlyE164 } from "@/lib/calendly/phone-e164";
import {
  hasFirebaseServiceAccountCredentials,
  isFirebaseAdminConfigured,
} from "@/lib/firebase/server-config";
import { isFirebaseClientConfigured } from "@/lib/firebase/public-config";

export type FunnelBVerifyChannel = "firebase";

export function resolveFunnelBVerifyChannel(): FunnelBVerifyChannel {
  return "firebase";
}

export function isFunnelBVerifyConfigured(): boolean {
  return isFirebaseClientConfigured() && isFirebaseAdminConfigured();
}

export function funnelBVerifyStatus() {
  const firebaseConfigured =
    isFirebaseClientConfigured() && isFirebaseAdminConfigured();

  return {
    channel: "firebase" as const,
    configured: firebaseConfigured,
    clientConfigured: isFirebaseClientConfigured(),
    serverConfigured: isFirebaseAdminConfigured(),
    serviceAccountConfigured: hasFirebaseServiceAccountCredentials(),
    firebaseConfigured,
  };
}

export async function verifyFunnelBPhoneIdToken(input: { phone: string; idToken: string }) {
  const channel: FunnelBVerifyChannel = "firebase";
  const expectedPhone = phoneToCalendlyE164(input.phone);
  if (!expectedPhone) {
    return { ok: false as const, error: "invalid_phone" as const, channel };
  }

  const idToken = input.idToken.trim();
  if (!idToken) {
    return { ok: false as const, error: "id_token_required" as const, channel };
  }

  const { getFirebaseAdminAuth } = await import("@/lib/firebase/admin");
  const auth = getFirebaseAdminAuth();
  if (!auth) {
    return { ok: false as const, error: "firebase_not_configured" as const, channel };
  }

  try {
    const decoded = await auth.verifyIdToken(idToken);
    if (decoded.firebase?.sign_in_provider !== "phone") {
      return { ok: false as const, error: "invalid_token_provider" as const, channel };
    }

    const tokenPhone =
      typeof decoded.phone_number === "string" ? decoded.phone_number.trim() : "";
    if (!tokenPhone || tokenPhone !== expectedPhone) {
      return { ok: false as const, error: "phone_mismatch" as const, channel };
    }

    return { ok: true as const, verifiedAt: new Date().toISOString(), channel };
  } catch {
    return { ok: false as const, error: "invalid_id_token" as const, channel };
  }
}

export function funnelBVerifyErrorMessage(error: string): string {
  switch (error) {
    case "invalid_phone":
      return "Enter a valid US mobile number.";
    case "id_token_required":
      return "Complete phone verification before continuing.";
    case "invalid_id_token":
    case "invalid_token_provider":
    case "phone_mismatch":
      return "Phone verification failed. Request a new code and try again.";
    case "firebase_not_configured":
      return "Verification is temporarily unavailable. Email support@illuminairy.com.";
    default:
      return "Could not verify right now. Try again.";
  }
}
