import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
import {
  getFacebookOAuthCredentials,
  getGoogleOAuthCredentials,
} from "@/lib/oauth-providers";

function authSecret(): string | undefined {
  return (
    process.env.AUTH_SECRET?.trim() ||
    process.env.NEXTAUTH_SECRET?.trim() ||
    undefined
  );
}

function buildProviders() {
  const providers = [];

  const google = getGoogleOAuthCredentials();
  if (google) {
    providers.push(
      Google({
        clientId: google.clientId,
        clientSecret: google.clientSecret,
      })
    );
  }

  const facebook = getFacebookOAuthCredentials();
  if (facebook) {
    providers.push(
      Facebook({
        clientId: facebook.clientId,
        clientSecret: facebook.clientSecret,
        authorization: { params: { scope: "email public_profile" } },
      })
    );
  }

  return providers;
}

export const isNextAuthConfigured = () => buildProviders().length > 0;

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: authSecret(),
  providers: buildProviders(),
  pages: {
    signIn: "/portal/login",
    error: "/api/auth/error-redirect",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email?.trim() && account?.provider === "facebook") {
        const fbEmail =
          typeof profile === "object" &&
          profile !== null &&
          "email" in profile &&
          typeof profile.email === "string"
            ? profile.email.trim()
            : "";
        if (fbEmail) user.email = fbEmail;
      }
      return Boolean(user.email?.trim());
    },
    async jwt({ token, user }) {
      if (user?.email) {
        token.email = user.email.trim().toLowerCase();
      }
      return token;
    },
    async session({ session, token }) {
      if (token.email && session.user) {
        session.user.email = String(token.email);
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      const base = baseUrl.replace(/\/$/, "");
      if (url.startsWith("/")) {
        return `${base}${url}`;
      }
      try {
        const target = new URL(url);
        if (target.origin === new URL(base).origin) return url;
      } catch {
        /* fall through */
      }
      if (url.startsWith(base)) return url;
      return base;
    },
  },
  trustHost: true,
});
