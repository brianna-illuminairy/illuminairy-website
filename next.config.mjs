/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  skipTrailingSlashRedirect: true,
  async redirects() {
    return [
      {
        source: "/assessment",
        destination: "/quiz?step=q1",
        permanent: true
      },
      {
        source: "/assessment/:path*",
        destination: "/quiz?step=q1",
        permanent: true
      },
      {
        source: "/satplan",
        destination: "/quiz?step=q1",
        permanent: true
      },
      {
        source: "/satplan/:path*",
        destination: "/quiz?step=q1",
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
      }
    ];
  },
  async rewrites() {
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "";
    const region = host.includes("eu") ? "eu" : "us";
    const ingest = `https://${region}.i.posthog.com`;
    const assets = `https://${region}-assets.i.posthog.com`;

    return [
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

export default nextConfig;
