import { getFirebasePublicConfig } from "@/lib/firebase/public-config";

export type VerifiedFirebasePhoneToken = {
  phoneNumber: string;
  uid: string;
};

type LookupResponse = {
  users?: Array<{
    localId?: string;
    phoneNumber?: string;
  }>;
  error?: {
    message?: string;
  };
};

/**
 * Verify a Firebase phone-auth ID token using Identity Toolkit accounts:lookup.
 * Uses the same Web API key as the client — no Admin SDK service account JSON required.
 */
export async function verifyFirebasePhoneIdToken(
  idToken: string
): Promise<{ ok: true; user: VerifiedFirebasePhoneToken } | { ok: false; error: string }> {
  const apiKey =
    process.env.FIREBASE_SERVER_API_KEY?.trim() ||
    getFirebasePublicConfig()?.apiKey ||
    null;
  if (!apiKey) {
    return { ok: false, error: "firebase_not_configured" };
  }

  const trimmed = idToken.trim();
  if (!trimmed) {
    return { ok: false, error: "id_token_required" };
  }

  const url = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(apiKey)}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken: trimmed }),
  });

  const payload = (await response.json().catch(() => ({}))) as LookupResponse;

  if (!response.ok) {
    const message = payload.error?.message || `lookup_http_${response.status}`;
    if (message.includes("INVALID_ID_TOKEN") || message.includes("EXPIRED")) {
      return { ok: false, error: "invalid_id_token" };
    }
    return { ok: false, error: "invalid_id_token" };
  }

  const user = payload.users?.[0];
  const phoneNumber = user?.phoneNumber?.trim();
  const uid = user?.localId?.trim();

  if (!phoneNumber || !uid) {
    return { ok: false, error: "invalid_token_provider" };
  }

  return {
    ok: true,
    user: { phoneNumber, uid },
  };
}

export function isFirebasePhoneTokenVerifyConfigured(): boolean {
  return Boolean(
    process.env.FIREBASE_SERVER_API_KEY?.trim() || getFirebasePublicConfig()?.apiKey
  );
}
