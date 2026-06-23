"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import {
  normalizeOAuthCallbackUrl,
  oauthReturnPathCookieWrite,
  type OAuthProviderId,
} from "@/lib/oauth-providers";

type Props = {
  provider: OAuthProviderId;
  callbackUrl: string;
  className?: string;
  onBeforeSignIn?: () => void;
  children: React.ReactNode;
};

/** Auth.js v5: POST sign-in via signIn(); callback must be a relative same-origin path. */
export function OAuthSignInButton({
  provider,
  callbackUrl,
  className,
  onBeforeSignIn,
  children,
}: Props) {
  const [pending, setPending] = useState(false);

  return (
    <button
      type="button"
      className={className}
      disabled={pending}
      aria-busy={pending}
      onClick={() => {
        if (pending) return;
        const redirectTo = normalizeOAuthCallbackUrl(callbackUrl);
        onBeforeSignIn?.();
        if (typeof document !== "undefined") {
          document.cookie = oauthReturnPathCookieWrite(redirectTo);
        }
        setPending(true);
        void signIn(provider, { redirectTo }).catch(() => {
          setPending(false);
        });
      }}
    >
      {children}
    </button>
  );
}
