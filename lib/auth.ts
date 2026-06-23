import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
import {
  getFacebookOAuthCredentials,
  getGoogleOAuthCredentials,
} from "@/lib/oauth-providers";

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
  providers: buildProviders(),
  pages: {
    signIn: "/portal/login",
    error: "/api/auth/error-redirect",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user }) {
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
      if (url.startsWith("/")) return `${baseUrl.replace(/\/$/, "")}${url}`;
      if (url.startsWith(baseUrl)) return url;
      return baseUrl;
    },
  },
  trustHost: true,
});
