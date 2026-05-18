/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  skipTrailingSlashRedirect: true,
  async redirects() {
    return [
      {
        source: "/guides/uga-gatech-emory-sat-bands",
        destination: "/go/guide",
        permanent: true
      },
      {
        source: "/guides/uga-gatech-emory-sat-bands/download",
        destination: "/go/guide/download",
        permanent: true
      },
      {
        source: "/guides/uga-gatech-emory-sat-scores",
        destination: "/go/guide",
        permanent: true
      },
      {
        source: "/guides/uga-gatech-emory-sat-scores/download",
        destination: "/go/guide/download",
        permanent: true
      },
      {
        source: "/guides",
        destination: "/go/guide",
        permanent: true
      },
      {
        source: "/guides/:slug",
        destination: "/go/guide",
        permanent: true
      },
      {
        source: "/guides/:slug/download",
        destination: "/go/guide/download",
        permanent: true
      },
      {
        source: "/go/guide/:slug",
        destination: "/go/guide",
        permanent: true
      },
      {
        source: "/go/guide/:slug/download",
        destination: "/go/guide/download",
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
