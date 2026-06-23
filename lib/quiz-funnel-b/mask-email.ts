/** Mask email for public social-proof strips (e.g. em*******@gmail.com). */
export function maskEmailForDisplay(raw: string): string | null {
  const email = raw.trim().toLowerCase();
  const at = email.indexOf("@");
  if (at <= 0) return null;
  const local = email.slice(0, at);
  const domain = email.slice(at + 1);
  if (!domain.includes(".")) return null;

  const prefixLen = Math.min(2, local.length);
  const prefix = local.slice(0, prefixLen);
  const maskLen = Math.max(5, local.length - prefixLen);
  return `${prefix}${"*".repeat(maskLen)}@${domain}`;
}
