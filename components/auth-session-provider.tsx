"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";

/** Required for Auth.js client signIn / session sync (Google, Facebook). */
export function AuthSessionProvider({ children }: { children: ReactNode }) {
  return <SessionProvider refetchOnWindowFocus={false}>{children}</SessionProvider>;
}
