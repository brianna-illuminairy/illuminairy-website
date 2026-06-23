"use client";

import { signIn } from "next-auth/react";
import type { OAuthProviderId } from "@/lib/oauth-providers";

type Props = {
  provider: OAuthProviderId;
  callbackUrl: string;
  className?: string;
  children: React.ReactNode;
};

/** Auth.js v5 requires POST sign-in; GET /api/auth/signin/google throws UnknownAction. */
export function OAuthSignInButton({ provider, callbackUrl, className, children }: Props) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        void signIn(provider, { redirectTo: callbackUrl });
      }}
    >
      {children}
    </button>
  );
}
