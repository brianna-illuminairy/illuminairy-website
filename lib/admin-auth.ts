import { cookies } from "next/headers";

export const ADMIN_COOKIE = "illuminairy_admin";

export function isAdminConfigured() {
  return Boolean(process.env.ADMIN_SECRET?.trim());
}

export async function isAdminAuthenticated() {
  const secret = process.env.ADMIN_SECRET?.trim();
  if (!secret) {
    return false;
  }
  const jar = await cookies();
  return jar.get(ADMIN_COOKIE)?.value === secret;
}
