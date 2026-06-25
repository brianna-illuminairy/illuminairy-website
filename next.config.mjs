import path from "path";
import { fileURLToPath } from "url";
import { withPostHogConfig } from "@posthog/nextjs-config";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const personalApiKey =
  process.env.POSTHOG_PERSONAL_API_KEY ?? process.env.POSTHOG_API_KEY ?? "";
const posthogProjectId = process.env.POSTHOG_PROJECT_ID ?? "";
// Set DISABLE_POSTHOG_SOURCEMAPS=1 to skip the post-build upload even if both
// keys are present. Useful when the personal API key has rotated / is invalid
// and is blocking deploys, or in any environment where source-map upload is
// not desired.
const posthogSourcemapsDisabled =
  process.env.DISABLE_POSTHOG_SOURCEMAPS === "1" ||
  process.env.DISABLE_POSTHOG_SOURCEMAPS === "true";
const posthogSourcemapsEnabled =
  !posthogSourcemapsDisabled &&
  Boolean(personalApiKey && posthogProjectId) &&
  process.env.NODE_ENV === "production";

const devAllowedOrigins = (
  process.env.DEV_ALLOWED_ORIGINS ??
  "127.0.0.1,localhost,192.168.7.194"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["firebase-admin", "google-auth-library"],
  productionBrowserSourceMaps: posthogSourcemapsEnabled,
  // Hide Next.js dev badge ("N" / "Rendering") during phone QA on LAN.
  devIndicators: false,
  // Required for phone QA on LAN IP (Next.js 16 blocks /_next/* cross-origin otherwise).
  allowedDevOrigins: devAllowedOrigins,
  turbopack: {
    root: projectRoot
  },
  reactStrictMode: true,
  experimental: {
    cssChunking: "strict",
  },
  skipTrailingSlashRedirect: true,
  outputFileTracingIncludes: {
    "/danielle/files/[slug]": ["./content/danielle/**/*"],
    "/soha/files/[slug]": ["./content/soha/**/*"],
    "/skye/files/[slug]": ["./content/skye/**/*"],
    "/quiz-b": [
      "./app/quiz-b/quiz-b-bundle.css",
      "./app/quiz-b/quiz-b-lab.css",
    ],
    "/sat-plan-builder": [
      "./app/landing/landing-v4.css",
      "./app/sat-plan-builder/sat-plan-builder.css",
    ],
  },
  async redirects() {
    return [
      {
        source: "/quiz",
        destination: "/plan",
        permanent: false
      },
      {
        source: "/quiz/:path*",
        destination: "/plan/:path*",
        permanent: false
      },
      {
        source: "/assessment",
        destination: "/plan?step=q1-parent-child",
        permanent: true
      },
      {
        source: "/assessment/:path*",
        destination: "/plan?step=q1-parent-child",
        permanent: true
      },
      {
        source: "/go/:path*",
        destination: "/",
        permanent: true
      },
      {
        source: "/guides/uga-gatech-emory-sat-bands",
        destination: "/",
        permanent: true
      },
      {
        source: "/guides/uga-gatech-emory-sat-bands/download",
        destination: "/",
        permanent: true
      },
      {
        source: "/guides/uga-gatech-emory-sat-scores",
        destination: "/",
        permanent: true
      },
      {
        source: "/guides/uga-gatech-emory-sat-scores/download",
        destination: "/",
        permanent: true
      },
      {
        source: "/guides",
        destination: "/",
        permanent: true
      },
      {
        source: "/guides/:slug",
        destination: "/",
        permanent: true
      },
      {
        source: "/guides/:slug/download",
        destination: "/",
        permanent: true
      },
      {
        source: "/go/guide/:slug",
        destination: "/",
        permanent: true
      },
      {
        source: "/go/guide/:slug/download",
        destination: "/",
        permanent: true
      },
      {
        source: "/enroll/shelly-senior-sprint",
        destination: "/enroll/shelly-aug22-bootcamp",
        permanent: false
      },
      {
        source: "/enroll/shelly-aug22-sprint",
        destination: "/enroll/shelly-aug22-bootcamp",
        permanent: false
      },
      {
        source: "/sat-free-lesson",
        destination: "/sat-plan-builder",
        permanent: true
      },
      {
        source: "/sat-free-lesson/:path*",
        destination: "/sat-plan-builder",
        permanent: true
      }
    ];
  },
  async rewrites() {
    const planBuilderRewrites = [
      { source: "/plan", destination: "/quiz" },
      { source: "/plan/:path*", destination: "/quiz/:path*" },
      { source: "/plan-b", destination: "/quiz-b" },
      { source: "/plan-b/:path*", destination: "/quiz-b/:path*" },
      { source: "/score-review", destination: "/quiz-c" },
      { source: "/score-review/:path*", destination: "/quiz-c/:path*" }
    ];

    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "";
    const region = host.includes("eu") ? "eu" : "us";
    const ingest = `https://${region}.i.posthog.com`;
    const assets = `https://${region}-assets.i.posthog.com`;

    return [
      ...planBuilderRewrites,
      {
        source: "/ia/static/:path*",
        destination: `${assets}/static/:path*`
      },
      {
        source: "/ia/array/:path*",
        destination: `${assets}/array/:path*`
      },
      {
        source: "/ia/:path*",
        destination: `${ingest}/:path*`
      }
    ];
  }
};

export default posthogSourcemapsEnabled
  ? withPostHogConfig(nextConfig, {
      personalApiKey,
      projectId: posthogProjectId,
      host: process.env.POSTHOG_API_HOST ?? "https://us.posthog.com",
      sourcemaps: {
        enabled: true,
        releaseName: "illuminairy-site",
        releaseVersion:
          process.env.VERCEL_GIT_COMMIT_SHA ??
          process.env.GITHUB_SHA ??
          "local",
        deleteAfterUpload: true
      }
    })
  : nextConfig;
