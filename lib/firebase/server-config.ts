/** Server-side Firebase readiness checks — no firebase-admin import. */

function readServiceAccountProjectId(): string | null {
  const rawJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
  if (!rawJson) return null;

  try {
    const parsed = JSON.parse(rawJson) as { project_id?: string };
    return parsed.project_id?.trim() || null;
  } catch {
    return null;
  }
}

export function resolveFirebaseProjectId(): string | null {
  return (
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim() ||
    process.env.FIREBASE_PROJECT_ID?.trim() ||
    readServiceAccountProjectId() ||
    null
  );
}

export function isFirebaseAdminConfigured(): boolean {
  return resolveFirebaseProjectId() !== null;
}
