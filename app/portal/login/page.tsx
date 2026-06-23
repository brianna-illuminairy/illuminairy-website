import Link from "next/link";
import { PortalLoginChrome } from "@/components/portal/portal-shell";
import { isNextAuthConfigured } from "@/lib/auth";
import { isPortalAuthenticated } from "@/lib/portal-auth";
import { OAuthSignInButton } from "@/components/oauth-sign-in-button";
import {
  isFacebookOAuthConfigured,
  isGoogleOAuthConfigured,
} from "@/lib/oauth-providers";
import { redirect } from "next/navigation";

type Props = {
  searchParams: Promise<{ next?: string }>;
};

export default async function PortalLoginPage({ searchParams }: Props) {
  const params = await searchParams;
  const next = params.next?.trim() || "/portal/home";

  if (await isPortalAuthenticated()) {
    redirect(next.startsWith("/portal") ? next : "/portal/home");
  }

  const oauthReady = isNextAuthConfigured();
  const googleEnabled = isGoogleOAuthConfigured();
  const facebookEnabled = isFacebookOAuthConfigured();

  return (
    <PortalLoginChrome>
      <div className="aurora-page" style={{ maxWidth: "420px", margin: "0 auto" }}>
        <h1 className="aurora-display-title">Sign in to your portal</h1>
        <p className="aurora-lede">
          After you book your free lesson, we email a link. You can also sign in with the same
          email you used on the SAT Score Path.
        </p>

        {oauthReady ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "24px" }}>
            {googleEnabled ? (
              <OAuthSignInButton provider="google" callbackUrl={next} className="aurora-btn-primary">
                Continue with Google
              </OAuthSignInButton>
            ) : null}
            {facebookEnabled ? (
              <OAuthSignInButton
                provider="facebook"
                callbackUrl={next}
                className="aurora-btn-secondary"
              >
                Continue with Facebook
              </OAuthSignInButton>
            ) : null}
          </div>
        ) : (
          <p className="aurora-muted" style={{ marginTop: "20px" }}>
            Social sign-in is not configured in this environment. Use the link from your booking
            confirmation email, or contact{" "}
            <a href="mailto:support@illuminairy.com">support@illuminairy.com</a>.
          </p>
        )}

        <p className="aurora-muted" style={{ marginTop: "24px" }}>
          Need to start over?{" "}
          <Link href="/plan-b">Return to the SAT Score Path</Link>.
        </p>
      </div>
    </PortalLoginChrome>
  );
}
