import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { resolveFirebaseProjectId } from "@/lib/firebase/server-config";

export { isFirebaseAdminConfigured } from "@/lib/firebase/server-config";

type ServiceAccount = {
  projectId: string;
  clientEmail: string;
  privateKey: string;
};

function readServiceAccount(): ServiceAccount | null {
  const rawJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
  if (rawJson) {
    try {
      const parsed = JSON.parse(rawJson) as {
        project_id?: string;
        client_email?: string;
        private_key?: string;
      };
      if (parsed.project_id && parsed.client_email && parsed.private_key) {
        return {
          projectId: parsed.project_id,
          clientEmail: parsed.client_email,
          privateKey: parsed.private_key,
        };
      }
    } catch {
      return null;
    }
  }

  const projectId = process.env.FIREBASE_PROJECT_ID?.trim();
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim();
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n")?.trim();

  if (!projectId || !clientEmail || !privateKey) {
    return null;
  }

  return { projectId, clientEmail, privateKey };
}

let adminApp: App | null = null;
let adminAuth: Auth | null = null;

export function getFirebaseAdminAuth(): Auth | null {
  if (adminAuth) return adminAuth;

  const serviceAccount = readServiceAccount();
  const projectId = resolveFirebaseProjectId();
  if (!projectId) return null;

  if (!getApps().length) {
    adminApp = serviceAccount
      ? initializeApp({
          credential: cert(serviceAccount),
          projectId: serviceAccount.projectId,
        })
      : initializeApp({ projectId });
  } else {
    adminApp = getApps()[0] ?? null;
  }

  if (!adminApp) return null;
  adminAuth = getAuth(adminApp);
  return adminAuth;
}
