import { phoneToCalendlyE164 } from "@/lib/calendly/phone-e164";
import { isFirebaseClientConfigured } from "@/lib/firebase/public-config";
import {
  isFirebasePhoneTokenVerifyConfigured,
  verifyFirebasePhoneIdToken,
} from "@/lib/firebase/verify-phone-id-token";

export type FunnelBVerifyChannel = "firebase";

export function resolveFunnelBVerifyChannel(): FunnelBVerifyChannel {
  return "firebase";
}

export function isFunnelBVerifyConfigured(): boolean {
  return isFirebaseClientConfigured() && isFirebasePhoneTokenVerifyConfigured();
}

export function funnelBVerifyStatus() {
  const clientConfigured = isFirebaseClientConfigured();
  const serverConfigured = isFirebasePhoneTokenVerifyConfigured();
  const firebaseConfigured = clientConfigured && serverConfigured;

  return {
    channel: "firebase" as const,
    configured: firebaseConfigured,
    clientConfigured,
    serverConfigured,
    firebaseConfigured,
  };
}

export async function verifyFunnelBPhoneIdToken(input: { phone: string; idToken: string }) {
  const channel: FunnelBVerifyChannel = "firebase";
  const expectedPhone = phoneToCalendlyE164(input.phone);
  if (!expectedPhone) {
    return { ok: false as const, error: "invalid_phone" as const, channel };
  }

  const result = await verifyFirebasePhoneIdToken(input.idToken);
  if (!result.ok) {
    const error =
      result.error === "id_token_required"
        ? ("id_token_required" as const)
        : result.error === "invalid_token_provider"
          ? ("invalid_token_provider" as const)
          : result.error === "firebase_not_configured"
            ? ("firebase_not_configured" as const)
            : ("invalid_id_token" as const);
    return { ok: false as const, error, channel };
  }

  if (result.user.phoneNumber !== expectedPhone) {
    return { ok: false as const, error: "phone_mismatch" as const, channel };
  }

  return { ok: true as const, verifiedAt: new Date().toISOString(), channel };
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
