import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const PORTAL_SESSION_COOKIE = "portal_session";

export type PortalSessionPayload = {
  leadId: string;
  email: string;
  exp: number;
};

function portalSessionSecret(): string | null {
  return (
    process.env.PORTAL_SESSION_SECRET?.trim() ||
    process.env.NEXTAUTH_SECRET?.trim() ||
    process.env.ADMIN_SECRET?.trim() ||
    null
  );
}

function signPayload(encoded: string, secret: string): string {
  return createHmac("sha256", secret).update(encoded).digest("base64url");
}

export function createPortalSessionToken(
  payload: Omit<PortalSessionPayload, "exp">,
  maxAgeSec = 60 * 60 * 24 * 90
): string | null {
  const secret = portalSessionSecret();
  if (!secret) return null;

  const full: PortalSessionPayload = {
    ...payload,
    email: payload.email.trim().toLowerCase(),
    exp: Math.floor(Date.now() / 1000) + maxAgeSec,
  };
  const encoded = Buffer.from(JSON.stringify(full)).toString("base64url");
  const sig = signPayload(encoded, secret);
  return `${encoded}.${sig}`;
}

export function verifyPortalSessionToken(token: string): PortalSessionPayload | null {
  const secret = portalSessionSecret();
  if (!secret) return null;

  const [encoded, sig] = token.split(".");
  if (!encoded || !sig) return null;

  const expected = signPayload(encoded, secret);
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(encoded, "base64url").toString("utf8")
    ) as PortalSessionPayload;
    if (!payload.leadId || !payload.email || !payload.exp) return null;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return { ...payload, email: payload.email.trim().toLowerCase() };
  } catch {
    return null;
  }
}

export function portalSessionCookieOptions(maxAge = 60 * 60 * 24 * 90) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}

export async function getPortalSession(): Promise<PortalSessionPayload | null> {
  const jar = await cookies();
  const raw = jar.get(PORTAL_SESSION_COOKIE)?.value;
  if (!raw) return null;
  return verifyPortalSessionToken(raw);
}

export async function isPortalAuthenticated(): Promise<boolean> {
  return Boolean(await getPortalSession());
}

export function setPortalSessionCookie(
  response: { cookies: { set: (name: string, value: string, options: ReturnType<typeof portalSessionCookieOptions>) => void } },
  leadId: string,
  email: string
): boolean {
  const token = createPortalSessionToken({ leadId, email });
  if (!token) return false;
  response.cookies.set(PORTAL_SESSION_COOKIE, token, portalSessionCookieOptions());
  return true;
}
