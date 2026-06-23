/** Server-side Firebase readiness checks — no firebase-admin import. */

function readServiceAccountFromJson(): {
  projectId: string;
  clientEmail: string;
  privateKey: string;
} | null {
  const rawJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
  if (!rawJson) return null;

  try {
    const parsed = JSON.parse(rawJson) as {
      project_id?: string;
      client_email?: string;
      private_key?: string;
    };
    if (parsed.project_id && parsed.client_email && parsed.private_key) {
      return {
        projectId: parsed.project_id.trim(),
        clientEmail: parsed.client_email.trim(),
        privateKey: parsed.private_key,
      };
    }
  } catch {
    return null;
  }
  return null;
}

function readServiceAccountFromSplitEnv(): {
  projectId: string;
  clientEmail: string;
  privateKey: string;
} | null {
  const projectId = process.env.FIREBASE_PROJECT_ID?.trim();
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim();
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n")?.trim();

  if (!projectId || !clientEmail || !privateKey) {
    return null;
  }

  return { projectId, clientEmail, privateKey };
}

export function hasFirebaseServiceAccountCredentials(): boolean {
  return readServiceAccountFromJson() !== null || readServiceAccountFromSplitEnv() !== null;
}

export function resolveFirebaseProjectId(): string | null {
  return (
    readServiceAccountFromJson()?.projectId ||
    readServiceAccountFromSplitEnv()?.projectId ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim() ||
    process.env.FIREBASE_PROJECT_ID?.trim() ||
    null
  );
}

export function isFirebaseAdminConfigured(): boolean {
  return hasFirebaseServiceAccountCredentials();
}
